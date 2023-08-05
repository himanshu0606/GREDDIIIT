const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    conversationId: {
        type: mongoose.ObjectId,
    },
    senderId: {
        type: mongoose.ObjectId,
    },
    text: {
        type: String,
    }
},
    { timestamps: true },
);

module.exports = mongoose.model("messages", messageSchema);