
const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: [3, "Title must be at least 3 characters"],
            maxlength: [150, "Title cannot exceed 150 characters"],
        },

        content: {
            type: String,
            required: true,
            trim: true,
            minlength: [10, "Content must be at least 10 characters"],
        },

        category: {
            type: String,
            enum: [
                "academic",
                "event",
                "general",
                "emergency",
            ],
            default: "general",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Announcement = mongoose.model(
    "Announcement",
    announcementSchema
);

module.exports = Announcement;
