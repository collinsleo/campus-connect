
const announcementService = require("../services/annoucement.services");

// POST /api/announcements
exports.createAnnouncement = async (req, res, next) => {
    try {
        const { title, content, category } = req.body;

        if (!title || !content ||!category) {
            return res.status(400).json({
                success: false,
                message: "required fields are empty",
            });
        }


        const announcement =
            await announcementService.createAnnouncement(
                { title, content, category },
                req.user.id
            );

        return res.status(201).json({
            success: true,
            message: "Announcement created successfully",
            data: { announcement },
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            "message":"Error creating announcement"
        })
    }
};

// GET /api/announcements
exports.getAnnouncements = async (req, res, next) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);

        if (
            !Number.isInteger(page) ||
            page < 1 ||
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Page must be positive and limit must be between 1 and 100",
            });
        }

        const result = await announcementService.getAnnouncements(
            page,
            limit
        );

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message:"Error fetching announcement"
        })
    }
};

// GET /api/announcements/:id
exports.getAnnouncementById = async (req, res, next) => {
    try {
        const announcement =
            await announcementService.getAnnouncementById(req.params.id);

        return res.status(200).json({
            success: true,
            data: { announcement },
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message:"Error fetching one announcement"
        })
    }
};

// PATCH /api/announcements/:id
exports.updateAnnouncement = async (req, res, next) => {
    try {
        const allowedFields = ["title", "content", "category"];
        const providedFields = Object.keys(req.body);

        if (providedFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Provide at least one field to update",
            });
        }

        const invalidFields = providedFields.filter(
            (field) => !allowedFields.includes(field)
        );

        if (invalidFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Fields cannot be updated: ${invalidFields.join(", ")}`,
            });
        }

        const { title, content, category } = req.body;

        if (
            title !== undefined &&
            (typeof title !== "string" || !title.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Title must be a non-empty string",
            });
        }

        if (
            content !== undefined &&
            (typeof content !== "string" || !content.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Content must be a non-empty string",
            });
        }

        if (
            category !== undefined &&
            (
                typeof category !== "string" ||
                !["academic", "event", "general", "emergency"]
                    .includes(category)
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid announcement category",
            });
        }

        const announcement =
            await announcementService.updateAnnouncement(
                req.params.id,
                req.body
            );

        return res.status(200).json({
            success: true,
            message: "Announcement updated successfully",
            data: { announcement },
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message:"Error Updating announcement"
        })
    }
};

// DELETE /api/announcements/:id
exports.deleteAnnouncement = async (req, res, next) => {
    try {
        await announcementService.deleteAnnouncement(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Announcement deleted successfully",
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message:"Error deleting announcement"
        })
    }
};
