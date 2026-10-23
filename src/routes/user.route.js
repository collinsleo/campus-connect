const router =  require('express').Router();
const { getMyProfile, updateMyProfile, getUsers, getUserById, updateUserRole, updateUserStatus } = require('../controllers/user.controller');
const {auth} = require('../middlewares/auth.middleware')
const {adminOnly, allowRole} = require('../middlewares/role.middleware')

const {userIdSchema, paginationSchema} = require("../validations/user.validation")
const {validate} = require("../middlewares/zodvalidation.middleware")

// GET /api/users/me
router.get("/me", auth, getMyProfile)

// PATCH /api/users/me
router.patch("/me", auth, updateMyProfile)

// GET /api/users
router.get("/", auth, validate(paginationSchema, "query"), getUsers)

// GET /api/users/:id
router.get("/:id", auth, adminOnly, validate(userIdSchema, "params") ,  getUserById)

// PATCH /api/users/:id/role
router.patch("/:id/role", auth, allowRole(['admin']), validate(userIdSchema, "params") , updateUserRole)

// PATCH /api/users/:id/status
router.patch("/:id/status", auth, allowRole(['admin']), validate(userIdSchema, "params") , updateUserStatus)


module.exports = router;
