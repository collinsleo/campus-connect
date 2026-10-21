
const express = require("express");

const {
    createAnnouncement,
    getAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement,
} = require("../controllers/announcement.controller");

const { auth } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/admin.middleware");

const router = express.Router();



// Everyone logged in can read announcements.
router.get("/", auth, adminOnly, getAnnouncements);
router.get("/:id", auth, getAnnouncementById);

// Only administrators can manage announcements.
router.post("/", auth, adminOnly, createAnnouncement);

router.patch(
    "/:id",
    auth, adminOnly,
    updateAnnouncement
);

router.delete(
    "/:id",
    auth, adminOnly,
    deleteAnnouncement
);

module.exports = router;
