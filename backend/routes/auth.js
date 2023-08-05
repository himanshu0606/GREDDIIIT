const express = require("express");
const routerUser = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel.js");
const jwt_secret = "abc123";
const CASAuthentication = require('node-cas-authentication');

const generatetoken = (id) => {
    return jwt.sign({ id }, jwt_secret, {
        expiresIn: '30d',
    })
}

// cas object
let cas = new CASAuthentication({
    cas_url: 'https://login.iiit.ac.in/cas',
    service_url: 'http://localhost:8000/auth/cas',
    cas_version: '3.0',
    renew: true,
    is_dev_mode: false,
    dev_mode_user: '',
    dev_mode_info: {},
    session_name: 'cas_user',
    session_info: 'cas_userinfo',
    destroy_session: true,
});

routerUser.use("/cas", cas.bounce, async (req, res) => {
    console.log(req.session);
    try {
        const email = req.session["cas_userinfo"]["e-mail"];
        const user_find = await User.findOne({ email: email });
        if (user_find) {
            return res.redirect(`http://localhost:3000/cas/${user_find._id}`)
        }
        const firstname = req.session["cas_userinfo"]["firstname"];
        const lastname = req.session["cas_userinfo"]["lastname"];
        const newUser = {
            email: email,
            firstname: firstname,
            lastname: lastname,
            username: "",
            age: "",
            contact: "",
            password: "",
            follower: [],
            following: [],
            savedPost: [],
        }

        const user_create = await User.create(newUser);
        return res.redirect(`http://localhost:3000/cas/${user_create._id}`)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err);
    }
})

routerUser.get("/logoutcas", cas.logout);

routerUser.get("/login/success", async (req, res) => {
    const arr = Object.keys(req.sessionStore.sessions);
    const idx = arr[0];
    if (idx) {
        const obj = JSON.parse(req.sessionStore.sessions[idx])
        const id = (obj).passport.user;
        const user_curr = await User.findById(id);
        let flag = 0;
        if (user_curr) {
            if (user_curr.username === "" || user_curr.age === "" || user_curr.contact === "" || user_curr.password === "")
                flag = 1;
        }
        if (id) {
            if (!flag) {
                return res.status(200).json({
                    success: true,
                    message: "success",
                    user: id,
                    login: true,
                    jwt: generatetoken(user_curr._id)
                })
            }
            else {
                return res.status(200).json({
                    success: true,
                    message: "success",
                    user: id,
                    login: false,
                });
            }
        } else {
            res.redirect("/")
        }
    }
});

routerUser.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    });
});

routerUser.get('/logout', (req, res) => {
    req.logout();
    res.redirect("http://localhost:3000/");
})

routerUser.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

routerUser.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }
), (req, res) => { res.redirect("http://localhost:3000/google") })

module.exports = routerUser