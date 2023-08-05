const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema({
    members: [{ type: mongoose.ObjectId }],
},
    { timestamps: true },
);

module.exports = mongoose.model("conversation", conversationSchema);