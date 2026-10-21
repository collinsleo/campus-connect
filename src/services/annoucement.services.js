
const Announcement = require("../models/annoucement.model");

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

// POST /api/announcements
exports.createAnnouncement = async (input, adminId) => {
    const announcement = await Announcement.create({
        title: input.title,
        content: input.content,
        category: input.category || "general",
        createdBy: adminId,
    });

    return announcement;
};

// GET /api/announcements
exports.getAnnouncements = async (page, limit) => {
    const skip = (page - 1) * limit;

    const [announcements, totalAnnouncements] = await Promise.all([
        Announcement.find()
            .populate("createdBy", "fullName email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),

        Announcement.countDocuments(),
    ]);

    return {
        announcements,
        pagination: {
            totalAnnouncements,
            currentPage: page,
            limit,
            totalPages: Math.ceil(totalAnnouncements / limit),
            hasNextPage: page * limit < totalAnnouncements,
            hasPreviousPage: page > 1,
        },
    };
};

// GET /api/announcements/:id
exports.getAnnouncementById = async (announcementId) => {
    const announcement = await Announcement.findById(announcementId)
        .populate("createdBy", "fullName email");

    if (!announcement) {
        throw createError("Announcement not found", 404);
    }

    return announcement;
};

// PATCH /api/announcements/:id
exports.updateAnnouncement = async (announcementId, input) => {
    const allowedFields = ["title", "content", "category"];
    const updates = {};

    for (const field of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(input, field)) {
            updates[field] = input[field];
        }
    }

    if (Object.keys(updates).length === 0) {
        throw createError(
            "Provide at least one valid field to update",
            400
        );
    }

    const announcement = await Announcement.findByIdAndUpdate(
        announcementId,
        { $set: updates },
        {
            new: true,
            runValidators: true,
        }
    ).populate("createdBy", "fullName email");

    if (!announcement) {
        throw createError("Announcement not found", 404);
    }

    return announcement;
};

// DELETE /api/announcements/:id
exports.deleteAnnouncement = async (announcementId) => {
    const announcement = await Announcement.findByIdAndDelete(
        announcementId
    );

    if (!announcement) {
        throw createError("Announcement not found", 404);
    }

    return announcement;
};
