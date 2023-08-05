const mongoose = require("mongoose");

const subgreddiitSchema = mongoose.Schema({
    owner: {
        type: mongoose.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    tags: [String],
    banned: [String],
    follower: [mongoose.ObjectId],
    requestJoin: [mongoose.ObjectId],
    unfollowedUser: [mongoose.ObjectId],
    blockedUser: [mongoose.ObjectId],
    posts: [mongoose.ObjectId],
    imageFile: {
        type: String,
    },
    memberTime:[{
        date:{
            type:String,
        },
        users:{
            type:Number,
        },
        posts:{
            type:Number,
        },
        visitors:{
            type:Number,
        },
        reported:{
            type:Number,
        },
        deleted:{
            type:Number,
        }
    }],
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("subgreddiit", subgreddiitSchema);