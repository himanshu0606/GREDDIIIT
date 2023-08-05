const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: String,
    },
    contact: {
        type: String,
    },
    password: {
        type: String,
    },
    follower: [{
        name: String,
        fol_id: mongoose.ObjectId
    }],
    following: [{
        name: String,
        fol_id: mongoose.ObjectId
    }],
    savedPost: [mongoose.ObjectId],
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("users", userSchema);