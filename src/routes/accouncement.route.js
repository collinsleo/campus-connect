
const express = require("express");

const {
    createAnnouncement,
    getAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement,
} = require("../controllers/announcement.controller");

const { auth } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/role.middleware");

const {createAnnouncementSchema, userIdSchema, updateAnnoucementSchema, paginationSchema} = require('../validations/announcement.validation')
const {validate} = require('../middlewares/zodvalidation.middleware')

const router = express.Router();

// Everyone logged in can read announcements.
router.get("/", auth, adminOnly, validate(paginationSchema, "query"), getAnnouncements);
router.get("/:id", auth, validate(userIdSchema, "params"), getAnnouncementById);

// Only administrators can manage announcements.
router.post("/", auth, adminOnly, validate(createAnnouncementSchema), createAnnouncement);

router.patch(
    "/:id",
    auth, adminOnly,
    validate(userIdSchema, "params"),
    validate(updateAnnoucementSchema),
    updateAnnouncement
);

router.delete(
    "/:id",
    auth, adminOnly,
    validate(userIdSchema, "params"),
    deleteAnnouncement
);

module.exports = router;
