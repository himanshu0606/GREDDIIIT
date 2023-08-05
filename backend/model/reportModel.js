const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
    PostId: {
        type: mongoose.ObjectId,
    },
    concern: {
        type: String,
        required: true,
    },
    reportedBy: {
        type: mongoose.ObjectId,
    },
    status: {
        type: String,
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Report", reportSchema);