const express = require("express");
const jwt = require("jsonwebtoken");
const bcyrpt = require("bcryptjs");
var ObjectId = require('mongoose').Types.ObjectId;
var nodemailer = require("nodemailer");
const routerUser = express.Router();
const jwt_secret = "abc123";

const subgreddiitModel = require("../model/subgreddiitModel.js");
const user = require("../model/userModel.js");
const posts = require("../model/postModel.js");
const report = require("../model/reportModel.js");
const message = require("../model/message.js");
const conversation = require("../model/conversation.js")
const { protect } = require("../middleware/usermiddleware");

routerUser.post("/register", async (req, res) => { //register user
    const { firstname, lastname, username, email, age, contact, password } = req.body;
    if (firstname === "" || lastname === "" || username === "" || email === "" || age === "" || contact === "" || password === "") {
        return res.status(401).send("Insufficient data");
    }

    let agenum = parseInt(age);
    if (isNaN(agenum) || agenum < 1 || agenum > 100) {
        return res.status(402).send("Invalid Age");
    }

    var phoneno = /^\d{10}$/;
    if (!contact.match(phoneno)) {
        return res.status(403).send("Invalid contact number");
    }

    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.match(validRegex)) {
        return res.status(404).send("Invalid email format");
    }

    const userExistemail = await user.findOne({ email });
    if (userExistemail) {
        return res.status(400).json(`User with email id ${email} alreeady exists`);
    }
    const userExistusername = await user.findOne({ username });
    if (userExistusername) {
        return res.status(400).json(`User with email id ${username} alreeady exists`);
    }
    else {
        //hashing
        const salt = await bcyrpt.genSalt(10);
        const hashedPassword = await bcyrpt.hash(password, salt);
        //create user
        const userdata = await user.create({
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            age: age,
            contact: contact,
            password: hashedPassword,
            follower: [],
            following: [],
        })

        if (userdata) {
            return res.status(201).json({
                _id: userdata.id,
                username: userdata.username,
                token: generatetoken(userdata._id),
            })
        }
        else {
            return res.status(400).json("Cannot create user - Problem with server");
        }
    }
})

routerUser.post("/cas/login", async (req, res) => {
    try {
        const id = req.body.id;

        const user_find = await user.findById(id);
        if (user_find.username !== "") {
            return res.status(201).json({
                token: generatetoken(user_find._id),
            })
        }
        else {
            return res.status(202).send("Take details");
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
})

routerUser.post("/googledata", async (req, res) => {
    try {
        const userId = req.body.user;
        const data = req.body.data;

        if (data.username === "" || data.age === "" || data.contact === "" || data.password === "") {
            return res.status(401).send("Insufficient data");
        }

        let agenum = parseInt(data.age);
        if (isNaN(agenum) || agenum < 1 || agenum > 100) {
            return res.status(402).send("Invalid Age");
        }

        var phoneno = /^\d{10}$/;
        if (!data.contact.match(phoneno)) {
            return res.status(403).send("Invalid contact number");
        }

        const userExistusername = await user.findOne({ username: data.username });
        if (userExistusername) {
            return res.status(400).json(`User with email id ${data.username} alreeady exists`);
        }

        const salt = await bcyrpt.genSalt(10);
        const hashedPassword = await bcyrpt.hash(data.password, salt);

        const user_update = await user.findByIdAndUpdate(userId, {
            contact: data.contact,
            age: data.age,
            username: data.username,
            password: hashedPassword,
        })

        if (user_update) {
            return res.status(201).json({
                _id: user_update.id,
                username: user_update.username,
                token: generatetoken(user_update._id),
            })
        }
        else {
            return res.status(400).json("Cannot create user - Problem with server");
        }

    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
})

routerUser.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const userExist = await user.findOne({ email });
        if (!userExist) {
            return res.status(400).json("Email doesn't exist");
        }
        const isMatch = await bcyrpt.compare(password, userExist.password);
        if (userExist && isMatch) {
            return res.status(201).json({
                id: userExist._id,
                username: userExist.username,
                token: generatetoken(userExist._id),
            })
        }
        else {
            return res.status(401).json("Email or password is wrong");
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).send("error");
    }
})

const generatetoken = (id) => {
    return jwt.sign({ id }, jwt_secret, {
        expiresIn: '30d',
    })
}

routerUser.use("/profile", protect, async (req, res) => {
    try {
        const userID = req.user;
        const userdata = await user.findById(userID).select("-password");
        return res.status(200).json(userdata);
    }
    catch {
        return res.status(401).send("Error");
    }
})

routerUser.use("/profilefollower", protect, async (req, res) => {
    try {
        const userID = req.user._id;
        const userdata = await user.findById(userID).select("-password");
        let userfollower = userdata.follower;
        let follower = [];
        for (let i = 0; i < userfollower.length; i++) {
            let temp = await user.findById(userfollower[i].fol_id).select("-password");
            follower.push(temp);
        }
        return res.status(200).json(follower);
    }
    catch {
        return res.status(401).send("Error");
    }
})

routerUser.use("/profilefollowing", protect, async (req, res) => {
    try {
        const userID = req.user._id;
        const userdata = await user.findById(userID).select("-password");
        let userfollowing = userdata.following;
        let following = [];
        for (let i = 0; i < userfollowing.length; i++) {
            let temp = await user.findById(userfollowing[i].fol_id).select("-password");
            following.push(temp);
        }
        return res.status(201).json(following);
    }
    catch {
        return res.status(401).send("Error");
    }
})

routerUser.use("/removefollower", protect, async (req, res) => {
    console.log(req.user)
    try {
        const userID = req.user._id;
        await user.findByIdAndUpdate(userID, { $pull: { "follower": { "fol_id": req.body.id } } });
        await user.findByIdAndUpdate(req.body.id, { $pull: { "following": { "fol_id": userID } } });
        return res.status(201).send("Deleted Follower");
    }
    catch (e) {
        return res.status(401).send("Error");
    }
})

routerUser.use("/removefollowing", protect, async (req, res) => {
    try {
        const userID = req.user._id;

        await user.findByIdAndUpdate(userID, { $pull: { "following": { "fol_id": req.body.id } } });
        await user.findByIdAndUpdate(req.body.id, { $pull: { "follower": { "fol_id": userID } } });
        return res.status(201).json("Deleted Following");
    }
    catch {
        return res.status(401).send("Error");
    }
})

routerUser.use("/addfollower", protect, async (req, res) => {
    const userId = req.user;
    const folUser = req.body.id;

    if (folUser.toString() === userId._id.toString()) {
        return res.status(401).send("Cannot be added");
    }

    const user2Id = await user.findById(folUser).select("-password");
    let flag = 0;
    const followerArr = user2Id.follower;
    for (let i = 0; i < followerArr.length; i++) {
        if (followerArr[i].fol_id.equals(userId._id)) {
            flag = 1;
        }
    }
    if (!flag) {
        await user.findByIdAndUpdate(folUser, { $push: { follower: { name: userId.username, fol_id: userId._id } } });
        await user.findByIdAndUpdate(userId._id, { $push: { following: { name: user2Id.username, fol_id: user2Id._id } } });

        return res.status(201).send("Successfully added");
    }
    else {
        return res.status(401).send("Already Added");
    }
})

routerUser.use("/editprofile", protect, async (req, res) => {
    if (req.body.username === "" || req.body.age === "" || req.body.contact === "") {
        return res.status(401).send("Insufficient Data");
    }
    const userID = req.user;
    const username = req.body.username;
    const userdata = await user.findOne({ username: username });
    if (userdata) {
        return res.status(400).json("Username alreday used");
    }
    const age = req.body.age;
    const contact = req.body.contact;
    let agenum = parseInt(age);
    if (isNaN(agenum) || agenum < 1 || agenum > 100) {
        return res.status(402).send("Invalid Age");
    }
    var phoneno = /^\d{10}$/;
    if (!contact.match(phoneno)) {
        return res.status(403).send("Invalid contact number");
    }
    await user.findByIdAndUpdate(userID, { username: req.body.username, age: req.body.age, contact: req.body.contact });
    const postuser = await posts.find({ "postedBy.id": userID })
    for (let i = 0; i < postuser.length; i++) {
        await posts.findByIdAndUpdate(postuser[i]._id, { $set: { "postedBy.username": req.body.username } })
    }
    return res.status(201).json("Updated Data");
})

routerUser.use("/createsubgreddiit", protect, async (req, res) => {
    try {
        const userID = req.user;

        const subgreddiit = {
            owner: userID._id,
            name: req.body.name,
            desc: req.body.desc,
            tags: req.body.tags,
            banned: req.body.banned,
            follower: [userID._id],
            requestJoin: [],
            imageFile: req.body.file,
            memberTime: [],
        }

        const createSub = await subgreddiitModel.create(subgreddiit);

        if (createSub) {
            return res.status(201).json("Subgreddiit Created");
        }
        else {
            return res.status(401).json("error");
        }
    }
    catch {
        return res.status(401).json("error");
    }
})

routerUser.use("/getsubgreddiit", protect, async (req, res) => {
    try {
        const userID = req.user._id;
        const subgreddiitUser = await subgreddiitModel.find({ owner: userID }).select(["-owner", "-imageFile"]);

        return res.status(201).json({ subgreddiitUser: subgreddiitUser });
    }
    catch {
        return res.status(401).json("Server Error");
    }

})

routerUser.use("/deletesubgreddiit", protect, async (req, res) => {
    try {
        const subId = req.body.deleteSub;
        let postGreddiit = await posts.find({ subGreddit: subId }).select(["_id", "saved"]);

        for (let i = 0; i < postGreddiit.length; i++) {
            const reportPost = await report.find({ PostId: postGreddiit[i]._id });
            for (let j = 0; j < reportPost.length; j++)
                await report.findByIdAndDelete(reportPost[j]._id);
        }
        for (let i = 0; i < postGreddiit.length; i++) {
            for (let j = 0; j < postGreddiit[i].saved.length; j++) {
                await user.findByIdAndUpdate(postGreddiit[i].saved[j], { $pull: { savedPost: postGreddiit[i]._id } });
            }
            await posts.findByIdAndDelete(postGreddiit[i]._id);
        }

        const subgreddiitfind = await subgreddiitModel.findByIdAndDelete(subId);

        if (subgreddiitfind)
            return res.status(201).json("Deleted Successfully");
        else {
            return res.status(401).json("Server Error");
        }
    }
    catch {
        return res.status(401).json("Server Error");
    }
})

routerUser.use("/getAllsubgreddiit", protect, async (req, res) => {
    try {
        const subgreddiitfind = await subgreddiitModel.find();
        const user = req.user._id;

        if (subgreddiitfind)
            return res.status(201).json({
                Greddiit: subgreddiitfind,
                user: user,
            });
        else {
            return res.status(401).json("Server Error");
        }
    }
    catch {
        return res.status(401).json("Server Error");
    }
})

routerUser.use("/leavesubgreddiit", protect, async (req, res) => {
    try {
        const user = req.user._id;

        await subgreddiitModel.findByIdAndUpdate(req.body.LeaveSub, { $pull: { follower: user } });
        await subgreddiitModel.findByIdAndUpdate(req.body.LeaveSub, { $push: { unfollowedUser: user } });

        return res.status(201).send("Successfully Left");
    }
    catch {
        return res.status(400).send("Error");
    }
})

routerUser.use("/joinsubgreddiit", protect, async (req, res) => {
    try {
        const user = req.user._id;
        const blocked = await subgreddiitModel.findById(req.body.JoinSub).select("blockedUser");
        const blockedArr = blocked.blockedUser;
        if (blockedArr.includes(user)) {
            return res.status(401).send("Bloked")
        }
        const unfollow = await subgreddiitModel.findById(req.body.JoinSub).select("unfollowedUser");
        const unfollowArr = unfollow.unfollowedUser;
        if (unfollowArr.includes(user)) {
            return res.status(202).send("Cannot join");
        }

        const pendJoin = await subgreddiitModel.findById(req.body.JoinSub).select("requestJoin");
        const pendJoinArr = pendJoin.requestJoin;

        if (pendJoinArr.includes(user)) {
            return res.status(400).send("Request Already Sent");
        }
        const join = await subgreddiitModel.findOneAndUpdate({ '_id': req.body.JoinSub }, { $push: { requestJoin: user } },);
        return res.status(201).send("Sent Request");
    }
    catch {
        return res.status(402).send("Error");
    }
})

routerUser.use("/acceptRequest", protect, async (req, res) => {
    try {
        const sub = await subgreddiitModel.findById(req.body.subId);
        let date = new Date();
        date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
        const memberTime = sub.memberTime;
        let flagtime = 0;
        for (let i = 0; i < memberTime.length; i++) {
            if (memberTime[i].date.localeCompare(date) === 0) {
                flagtime = 1;
                await subgreddiitModel.updateOne({ "memberTime": { "$elemMatch": { "date": date } } }, { $inc: { "memberTime.$.users": 1 } });
            }
        }

        if (!flagtime) {
            let tempobj = {
                date: date,
                users: sub.follower.length,
                posts: 0,
                visitors: 0,
                reported: 0,
                deleted: 0,
            }
            await subgreddiitModel.findByIdAndUpdate(req.body.sub_Id, { $push: { memberTime: tempobj } });
        }

        let reqPend = sub.requestJoin;
        if (reqPend.includes(req.body.id)) {
            await subgreddiitModel.findByIdAndUpdate(req.body.subId, { $pull: { requestJoin: req.body.id } });
            await subgreddiitModel.findByIdAndUpdate(req.body.subId, { $push: { follower: req.body.id } });

            return res.status(201).send("Accepted");
        }
        else {
            return res.status(401).send("Error");
        }
    }
    catch {
        return res.status(401).send("Error");
    }

})

routerUser.use("/rejectRequest", protect, async (req, res) => {
    try {
        let reqPend = await subgreddiitModel.findById(req.body.subId).select("requestJoin");
        reqPend = reqPend.requestJoin;
        if (reqPend.includes(req.body.id)) {
            await subgreddiitModel.findByIdAndUpdate(req.body.subId, { $pull: { requestJoin: req.body.id } });

            return res.status(201).send("Rejected");
        }
        else {
            return res.status(401).send("Error");
        }
    }
    catch {
        return res.status(401).send("Error");
    }

})

routerUser.use("/incVisitor", protect, async (req, res) => {
    try {
        const sub = await subgreddiitModel.findById(req.body.sub_Id);
        let date = new Date();
        date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
        const memberTime = sub.memberTime;
        let flagtime = 0;
        for (let i = 0; i < memberTime.length; i++) {
            if (memberTime[i].date.localeCompare(date) === 0) {
                flagtime = 1;
                await subgreddiitModel.updateOne({ "memberTime": { "$elemMatch": { "date": date } } }, { $inc: { "memberTime.$.visitors": 1 } });
            }
        }

        if (!flagtime) {
            let tempobj = {
                date: date,
                users: sub.follower.length,
                posts: 0,
                visitors: 1,
                reported: 0,
                deleted: 0,
            }
            await subgreddiitModel.findByIdAndUpdate(req.body.sub_Id, { $push: { memberTime: tempobj } });
        }
        return res.status(201).send("Done");
    }
    catch {
        return res.status(400).send("Error");
    }
})

routerUser.use("/getdetailsSubgreddiit", protect, async (req, res) => {
    try {
        const sub = await subgreddiitModel.findById(req.body.id);
        const moderator = await user.findById(sub.owner).select("username");
        if (sub || moderator) {
            return res.status(201).json({
                moderator: moderator.username,
                name: sub.name,
                desc: sub.desc,
                tags: sub.tags,
                banned: sub.banned,
                follower: sub.follower,
                imageFile: sub.imageFile,
                posts: sub.posts.length,
                blocked: sub.blockedUser,
            })
        }
    }
    catch {
        return res.status(401).send("Error");
    }
    return res.status(401).send("Error");
})

routerUser.use("/getdetailsMySubgreddiit", protect, async (req, res) => {
    try {
        const sub = await subgreddiitModel.findById(req.body.id);
        const fol = sub.follower, blocked = sub.blockedUser;
        let followerArr = [], blockedArr = [];
        for (let i = 0; i < fol.length; i++) {
            let temp = await user.findById(fol[i]);
            followerArr.push(temp);
        }

        for (let i = 0; i < blocked.length; i++) {
            let temp = await user.findById(blocked[i]);
            blockedArr.push(temp);
        }

        const moderator = await user.findById(sub.owner).select("username");
        return res.status(201).json({
            moderator: moderator.username,
            name: sub.name,
            desc: sub.desc,
            tags: sub.tags,
            banned: sub.banned,
            follower: followerArr,
            blocked: blockedArr,
            imageFile: sub.imageFile,
            posts: sub.posts.length,
        })

    }
    catch {
        return res.status(401).send("Error");
    }
    return res.status(401).send("Error");
})

routerUser.use("/getdetailsMySubgreddiitRequestJoin", protect, async (req, res) => {
    try {
        const sub = await subgreddiitModel.findById(req.body.id);
        const reqJoin = sub.requestJoin;
        let reqJoinArr = []
        for (let i = 0; i < reqJoin.length; i++) {
            let temp = await user.findById(reqJoin[i]);
            reqJoinArr.push(temp);
        }

        const moderator = await user.findById(sub.owner).select("username");
        if (sub || moderator) {
            return res.status(201).json({
                moderator: moderator.username,
                name: sub.name,
                desc: sub.desc,
                tags: sub.tags,
                banned: sub.banned,
                follower: sub.follower.length,
                imageFile: sub.imageFile,
                posts: sub.posts.length,
                reqJoin: reqJoinArr,
            })
        }
    }
    catch {
        return res.status(401).send("Error");
    }
    return res.status(401).send("Error");
})

routerUser.use("/getdetailsMySubgreddiitStat", protect, async (req, res) => {
    try {
        const sub = await subgreddiitModel.findById(req.body.id);
        const fol = sub.follower.length;

        const moderator = await user.findById(sub.owner).select("username");
        if (sub || moderator) {
            return res.status(201).json({
                moderator: moderator.username,
                name: sub.name,
                desc: sub.desc,
                tags: sub.tags,
                banned: sub.banned,
                follower: fol,
                imageFile: sub.imageFile,
                posts: sub.posts.length,
                memberTime: sub.memberTime,
            })
        }
    }
    catch {
        return res.status(401).send("Error");
    }
    return res.status(401).send("Error");
})

routerUser.use("/fetchPost", protect, async (req, res) => {
    try {
        const subId = req.body.id;
        const user = req.user._id;
        const post = await posts.find({ subGreddit: subId });
        const sub = await subgreddiitModel.findById(subId).select(["blockedUser", "owner"]);
        const blockedArr = sub.blockedUser;

        for (let i = 0; i < post.length; i++) {
            if (blockedArr.includes(post[i].postedBy.id)) {
                post[i].postedBy.username = "Blocked User";
            }
        }

        return res.status(201).json({
            post: post,
            user: req.user.id,
        });
    }
    catch (e) {
        console.log(e);
        return res.status(401).send("Error");
    }
})

routerUser.use("/newPost", protect, async (req, res) => {
    try {
        const sub = await subgreddiitModel.findById(req.body.sub_id);
        let date = new Date();
        date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
        const memberTime = sub.memberTime;
        let flagtime = 0;
        for (let i = 0; i < memberTime.length; i++) {
            if (memberTime[i].date.localeCompare(date) === 0) {
                flagtime = 1;
                await subgreddiitModel.updateOne({ "memberTime": { "$elemMatch": { "date": date } } }, { $inc: { "memberTime.$.posts": 1 } });
            }
        }

        if (!flagtime) {
            let tempobj = {
                date: date,
                users: sub.follower.length,
                posts: 1,
                visitors: 1,
                reported: 0,
                deleted: 0,
            }
            await subgreddiitModel.findByIdAndUpdate(req.body.sub_id, { $push: { memberTime: tempobj } });
        }

        let ban = sub.banned;
        let post1 = req.body.post;
        let flag = 0;

        for (let i = 0; i < ban.length; i++) {
            var searchMask = ban[i];
            var regEx = new RegExp(searchMask, "ig");
            var replaceMask = "*";
            if (post1.search(new RegExp(ban[i], "i")) !== -1) {
                post1 = post1.replace(regEx, replaceMask);
                flag = 1;
            }
        }

        // if (post2.localeCompare(post1) !== 0) {
        //     flag = 1;
        // }
        const newPost = await posts.create({
            subGreddit: req.body.sub_id,
            postedBy: {
                id: req.user.id,
                username: req.user.username,
            },
            liked: [],
            disliked: [],
            post: post1,
            comments: [],
        });

        await subgreddiitModel.findByIdAndUpdate(sub, { $push: { posts: newPost._id } });
        if (!flag)
            return res.status(201).json(newPost);
        else if (flag)
            return res.status(202).json(newPost);
    }
    catch (e) {
        console.log(e);
        return res.status(400).send("Error Occured");
    }
})

routerUser.use("/Postupvote", protect, async (req, res) => {
    const postId = req.body.PostId;

    if (ObjectId.isValid(postId)) {
        try {
            const userId = req.user._id;
            const postUpdate = await posts.findById(postId);
            if (!postUpdate.liked.includes(userId)) {
                await posts.findByIdAndUpdate(postId, { $pull: { disliked: userId } });
                const post = await posts.findByIdAndUpdate(postId, { $push: { liked: userId } }, { new: true });
                return res.status(201).json(post.liked.length);
            }
            else {
                return res.status(202).send("Already Added");
            }
        }
        catch {
            return res.status(400).send("Error");
        }
    }
    return res.status(400).send("Error");
})

routerUser.use("/Postupvotedelete", protect, async (req, res) => {
    const postId = req.body.PostId;
    const userId = req.user._id;
    if (ObjectId.isValid(postId)) {
        try {
            const post = await posts.findByIdAndUpdate(postId, { $pull: { liked: userId } }, { new: true });
            return res.status(201).json(post.liked.length);
        }
        catch {
            return res.status(400).send("Error");
        }
    }
    return res.status(400).send("Error");
})

routerUser.use("/Postdownvote", protect, async (req, res) => {
    const postId = req.body.PostId;
    const userId = req.user._id;
    if (ObjectId.isValid(postId)) {
        try {
            await posts.findByIdAndUpdate(postId, { $pull: { liked: userId } });
            const post = await posts.findByIdAndUpdate(postId, { $push: { disliked: userId } }, { new: true });
            return res.status(201).json(post.liked.length);
        }
        catch {
            return res.status(400).send("Error");
        }
    }
    return res.status(400).send("Error");
})

routerUser.use("/Postdownvotedelete", protect, async (req, res) => {
    const postId = req.body.PostId;
    const userId = req.user._id;
    if (ObjectId.isValid(postId)) {
        try {
            const post = await posts.findByIdAndUpdate(postId, { $pull: { disliked: userId } }, { new: true });
            return res.status(201).json(post.liked.length);
        }
        catch {
            return res.status(400).send("Error");
        }
    }
    return res.status(400).send("Error");
})

routerUser.use("/nestComment", protect, async (req, res) => {
    try {
        const id = req.body.id;
        console.log(id);
        if (id) {
            const post = await posts.findOne({ "comments._id": id });
            const comment = post.comments;

            let reply = []
            for (let i = 0; i < comment?.length; i++) {
                if (comment[i].parent?.toString() === id) {
                    reply.push(comment[i]);
                }
            }
            return res.status(201).json({
                nestComment: reply,
            })
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
})

routerUser.use("/fetchCommentNum", protect, async (req, res) => {
    try {
        const id = req.body.id;
        const post = await posts.findOne({ "comments._id": id });
        const comment = post.comments;
        let count = 0

        for (let i = 0; i < comment.length; i++) {
            if (comment[i]["parent"] === id) {
                count += 1;
            }
        }

        return res.status(201).json(count);

    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
})

routerUser.use("/addnestComment", protect, async (req, res) => {
    try {
        const id = req.body.Id;
        const comment = req.body.reply;
        const userId = req.user._id;
        let post = await posts.findOne({ "comments._id": id })
        const user_find = await user.findById(userId).select("username");

        const obj = {
            parent: id,
            comment: comment,
            userName: user_find.username,
            userId: user_find._id,
        }

        await posts.findByIdAndUpdate(post._id, { $push: { comments: obj } })

        post = await posts.findById(post._id).select("comments");
        const comment_nest = post.comments;

        let curr = [];
        for (let i = 0; i < comment_nest.length; i++) {

            if (comment_nest[i]["parent"] === id) {
                curr.push(comment_nest[i]);
            }
        }
        return res.status(201).json(curr);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
})

routerUser.use("/addComment", protect, async (req, res) => {
    const postId = req.body.PostId;
    const userId = req.user._id;
    const username = req.user.username;
    const comment = req.body.comment;

    const post = await posts.findByIdAndUpdate(postId, {
        $push: {
            comments: {
                userId: userId,
                userName: username,
                comment: comment,
            }
        }
    }, { new: true });
    let newcom = null;
    for (let i = 0; i < post.comments.length; i++) {
        if (post.comments[i].userId.toString() === userId.toString() && post.comments[i].userName === username && post.comments[i].comment === comment) {
            newcom = post.comments[i];
        }
    }

    if (post)
        return res.status(201).json(newcom);
    else {
        return res.status(401).send("Error");
    }
})

routerUser.use("/savePost", protect, async (req, res) => {
    const postId = req.body.PostId;
    const userId = req.user._id;
    if (ObjectId.isValid(postId)) {
        try {
            const userUpdate = await user.findByIdAndUpdate(userId, { $push: { savedPost: postId } }, { new: true });
            await posts.findByIdAndUpdate(postId, { $push: { saved: userId } }, { new: true });
            return res.status(201).send("Added to saved Post");
        }
        catch {
            return res.status(401).send("Error");
        }
    }
    return res.status(401).send("Error");
})

routerUser.use("/unsavePost", protect, async (req, res) => {
    const postId = req.body.PostId;
    const userId = req.user._id;
    if (ObjectId.isValid(postId)) {
        try {
            const userUpdate = await user.findByIdAndUpdate(userId, { $pull: { savedPost: postId } }, { new: true });
            await posts.findByIdAndUpdate(postId, { $pull: { saved: userId } }, { new: true })
            return res.status(201).send("Removed from saved Post");
        }
        catch {
            return res.status(401).send("Error");
        }
    }
    return res.status(401).send("Error");
})


routerUser.use("/getSavedpost", protect, async (req, res) => {
    const userId = req.user.id;
    try {
        let SavedArr = await user.findById(userId).select("savedPost");
        SavedArr = SavedArr.savedPost;
        let savedpost = [];

        for (let i = 0; i < SavedArr.length; i++) {
            let temp = await posts.findById(SavedArr[i]);
            let sub = await subgreddiitModel.findById(temp.subGreddit).select(["name", "blockedUser"]);
            if (sub.blockedUser.includes(temp.postedBy.id)) {
                temp.postedBy.username = "Blocked User";
            }
            let tempObj = {
                postedBy: temp.postedBy,
                _id: temp._id,
                subGreddit: temp.subGreddit,
                sub: sub.name,
                post: temp.post,
                liked: temp.liked,
                disliked: temp.disliked,
                saved: temp.saved,
                comments: temp.comments,
            }
            savedpost.push(tempObj);
        }

        return res.status(201).json({
            saved: savedpost,
            user: userId,
        })
    }
    catch (e) {
        console.log(e);
        return res.status(400).send("Error");
    }
})

routerUser.use("/addReport", protect, async (req, res) => {
    const userId = req.user._id;

    try {
        let date = new Date();
        date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
        const postcurr = await posts.findById(req.body.postId);
        const sub = await subgreddiitModel.findById(postcurr.subGreddit);
        const memberTime = sub.memberTime;
        let flagtime = 0;
        for (let i = 0; i < memberTime.length; i++) {
            if (memberTime[i].date.localeCompare(date) === 0) {
                flagtime = 1;
                await subgreddiitModel.updateOne({ "memberTime": { "$elemMatch": { "date": date } } }, { $inc: { "memberTime.$.reported": 1 } });
            }
        }

        // if (!flagtime) {
        //     let tempobj = {
        //         date: date,
        //         users: 1,
        //         posts: 1,
        //         visitors: 1,
        //         reported: 1,
        //         deleted: 0,
        //     }
        //     await subgreddiitModel.findByIdAndUpdate(req.body.sub_id, { $push: { tempobj } });
        // }

        const reportCreated = await report.create({
            concern: req.body.concern,
            PostId: req.body.postId,
            reportedBy: userId,
            status: "Reported",
        });
        return res.status(201).send("Reported Post");
    }
    catch {
        return res.status(401).send("Error Occured");
    }
})

routerUser.use("/reports", protect, async (req, res) => {
    const subId = req.body.subId;
    try {
        const sub = await subgreddiitModel.findById(subId).select("posts");
        const poststemp = sub.posts;

        let reportSub = [];

        for (let i = 0; i < poststemp.length; i++) {
            let reportDel = await report.find({ PostId: poststemp[i] });
            for (let j = 0; j < reportDel.length; j++)
                reportSub.push(reportDel[j]);
        }

        let reportSubtemp = [];
        const days = 10;
        const miliDays = days * 24 * 60 * 60 * 1000;

        for (let i = 0; i < reportSub.length; i++) {
            if (reportSub[i].status === "Reported") {
                if (Date.now() - reportSub[i].createdAt >= miliDays) {
                    await report.findByIdAndDelete(reportSub[i]._id);
                    continue;
                }
            }
            let postOwner = await posts.findById(reportSub[i].PostId).select(["postedBy", "post"]);
            let reportedBy = await user.findById(reportSub[i].reportedBy).select("username");
            reportSubtemp.push({
                "_id": reportSub[i]._id,
                "PostId": reportSub[i].PostId,
                "concern": reportSub[i].concern,
                "postOwner": postOwner,
                "reportedByname": reportedBy,
                "status": reportSub[i].status,
            })
        }

        return res.status(201).json({ reportSub: reportSubtemp });

    }
    catch {
        return res.status(401).send("Error");
    }
})

routerUser.use("/deleteReport", protect, async (req, res) => {
    try {
        let date = new Date();
        date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
        const reportcurr = await report.findById(req.body.id);
        const postcurr = await posts.findById(reportcurr.PostId);
        const saved = postcurr.saved;
        const sub = await subgreddiitModel.findById(postcurr.subGreddit);
        const memberTime = sub.memberTime;
        //let flagtime = 0;
        for (let i = 0; i < memberTime.length; i++) {
            if (memberTime[i].date.localeCompare(date) === 0) {
                //flagtime = 1;
                await subgreddiitModel.updateOne({ "memberTime": { "$elemMatch": { "date": date } } }, { $inc: { "memberTime.$.deleted": 1 } });
            }
        };
        await subgreddiitModel.findByIdAndUpdate(sub._id, { $pull: { posts: postcurr._id } });
        for (let i = 0; i < saved.length; i++) {
            await user.findByIdAndUpdate(saved[i], { $pull: { savedPost: postcurr._id } });
        }
        let reportPost = await report.find({ PostId: postcurr._id });
        for (let i = 0; i < reportPost.length; i++) {
            await report.findByIdAndDelete(reportPost[i]._id);
        }
        // if (!flagtime) {
        //     let tempobj = {
        //         date: date,
        //         users: 1,
        //         posts: 1,
        //         visitors: 1,
        //         reported:1,
        //         deleted:1,
        //     }
        //     await subgreddiitModel.findByIdAndUpdate(req.body.sub_id, { $push: { tempobj } });
        // }
        const reportedBy = await user.findById(reportcurr.reportedBy).select("-password");
        let email = `${reportedBy.email}`;
        let text = `This mail is to inform you that the report that you had submitted against post created by ${postcurr.postedBy.username} is deleted.`;
        sendmail(email, text);
        const postedBy = await user.findById(postcurr.postedBy.id).select("-password");
        email = `${postedBy.email}`
        text = `This mail is to inform you that the post created by you has been deleted as your post was reported`;
        sendmail(email, text);
        await posts.findOneAndDelete(postcurr._id);
        return res.status(201).send("Done");
    }
    catch {
        return res.status(401).send("Error");
    }
})

routerUser.use("/ignoreReport", protect, async (req, res) => {
    const id = req.body.id;
    try {
        const reportcurr = await report.findById(req.body.id);
        const reportedBy = await user.findById(reportcurr.reportedBy).select("-password");
        let email = `${reportedBy.email}`;
        let text = `This mail is to inform you that the report that you had submitted against post is ignored and no furthur actions will be taken.`;
        sendmail(email, text);
        await report.findByIdAndUpdate(id, { $set: { status: "ignore" } });
        return res.status(201).send("Done");
    }
    catch {
        return res.status(401).send("Error");
    }
})

routerUser.use("/blockReport", protect, async (req, res) => {
    const id = req.body.id;
    let date = new Date();
    date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    try {
        await report.findByIdAndUpdate(id, { $set: { status: "block" } });
        const sub = await subgreddiitModel.findById(req.body.subId).select(["blockedUser", "owner"]);
        console.log(sub);
        const blockedArr = sub.blockedUser;
        const owner = sub.owner;

        if (req.body.userId.toString() === owner.toString()) {
            return res.status(403).send("Cannot block moderator");
        }

        if (blockedArr.includes(req.body.userId)) {
            return res.status(402).send("Blocked Already");
        }

        const reportcurr = await report.findById(id);
        const reportedBy = await user.findById(reportcurr.reportedBy).select("-password");
        const post = await posts.findById(reportcurr.PostId);
        const postedBy = await user.findById(post.postedBy.id).select("-password");
        await subgreddiitModel.findByIdAndUpdate(req.body.subId, { $push: { blockedUser: req.body.userId } });
        await subgreddiitModel.findByIdAndUpdate(req.body.subId, { $pull: { follower: req.body.userId } });
        await subgreddiitModel.updateOne({ "memberTime": { "$elemMatch": { "date": date } } }, { $inc: { "memberTime.$.users": -1 } });
        let email = `${reportedBy.email}`;
        let text = `This mail is to inform you that the creator of the post that you reported has been blocked.`;
        sendmail(email, text);
        email = `${postedBy.email}`
        text = `This mail is to inform you that you have been blocked by the moderator of the subgrediit in response of the report`;
        sendmail(email, text);
        return res.status(201).send("Done");
    }
    catch (e) {
        console.log(e)
        return res.status(400).send("Error");
    }
})

const sendmail = (email, text) => {
    console.log(email);
    var transporter = nodemailer.createTransport({
        service: 'gmail',

        auth: {
            user: 'nipun.tulsian.nt@gmail.com',
            pass: 'hoyaowwwuxgfbinb',
        },
    });

    var mailOptions = {
        from: 'nipun.tulsian.nt@gmail.com',
        to: email,
        subject: 'Action on Report',
        text: text,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

routerUser.use("/conversation", protect, async (req, res) => {
    try {
        const id1 = req.body.id;
        const id2 = req.user._id;

        let convo = await conversation.find({
            members: { $all: [id1, id2] }
        });

        if (convo.length > 0) {
            return res.status(201).json(convo);
        }

        const obj = {
            members: [req.body.id, req.user._id]
        };
        convo = await conversation.create(obj);

        return res.status(201).json(convo);
    }
    catch (e) {
        return res.status(500).json(e);
    }
})

routerUser.use("/getconversation", protect, async (req, res) => {
    try {
        const convos = await conversation.find({
            members: { $in: [req.user._id] }
        });

        return res.status(201).json({
            convos: convos,
            user: req.user._id
        });
    }
    catch (e) {
        return res.status(500).json(e);
    }
})

routerUser.use("/chatable", protect, async (req, res) => {
    try {
        const id1 = req.user.id;
        const profile1 = await user.findById(req.body.id).select(["follower", "following"]);
        const follower = profile1.follower;
        const following = profile1.following;
        let flag1 = 0;
        let flag2 = 0;

        for (let i = 0; i < follower.length; i++) {
            if (follower[i].fol_id.toString() === id1) {
                flag1 = 1;
            }
        }

        for (let i = 0; i < following.length; i++) {
            if (following[i].fol_id.toString() === id1) {
                flag2 = 1;
            }
        }

        if (flag1 && flag2) {
            return res.status(201).json(1);
        }
        else {
            return res.status(202).json(0);
        }


    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
})
routerUser.use("/message", protect, async (req, res) => {
    const obj = {
        conversationId: req.body.conversationId,
        senderId: req.body.senderId,
        text: req.body.text,
    }
    try {
        const msg = await message.create(obj);

        return res.status(201).json(msg);
    } catch (e) {
        return res.status(500).json(e);
    }
})

routerUser.use("/chat/fetchMessage", protect, async (req, res) => {
    const id = req.body.conversationId;
    try {
        const msg = await message.find({
            conversationId: id
        })

        return res.status(201).json(msg);
    }
    catch (e) {

        return res.status(500).json(e);
    }
})

routerUser.use("/getDetuser", protect, async (req, res) => {
    try {
        const userInfo = await user.findById(req.body.userid);
        return res.status(201).json({ userInfo: userInfo });
    }
    catch (e) {
        return res.status(500).json(e);
    }
})


module.exports = routerUser;