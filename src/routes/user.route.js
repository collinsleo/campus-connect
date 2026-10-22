const router =  require('express').Router();
const { getMyProfile, updateMyProfile, getUsers, getUserById, updateUserRole, updateUserStatus } = require('../controllers/user.controller');
const {auth} = require('../middlewares/auth.middleware')
const {adminOnly, allowRole} = require('../middlewares/role.middleware')

// GET /api/users/me
router.get("/me", auth, getMyProfile)

// PATCH /api/users/me
router.patch("/me", auth, updateMyProfile)

// GET /api/users
router.get("/", auth, getUsers)

// GET /api/users/:id
router.get("/:id", auth, adminOnly,  getUserById)

// PATCH /api/users/:id/role
router.patch("/:id/role", auth, allowRole(['admin']), updateUserRole)

// PATCH /api/users/:id/status
router.patch("/:id/status", auth, allowRole(['admin']), updateUserStatus)


module.exports = router;
