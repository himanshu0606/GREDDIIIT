const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    subGreddit: {
        type: mongoose.ObjectId,
        required: true,
    },
    post: {
        type: String,
        required: true,
    },
    postedBy: {
        id: {
            type: mongoose.ObjectId,
        },
        username: {
            type: String,
        }
    },
    liked: [{ type: mongoose.ObjectId }],
    disliked: [{ type: mongoose.ObjectId }],
    saved: [mongoose.ObjectId],
    comments: [{
        userId: {
            type: mongoose.ObjectId,
            required: true,
        },
        userName: {
            type: String,
        },
        comment: {
            type: String,
            required: true,
        },
        parent: {
            type: String,
            default: null,
        },
    }],
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("posts", postSchema);