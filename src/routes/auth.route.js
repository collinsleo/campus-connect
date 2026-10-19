const router =  require('express').Router();
const { registerUser, loginUser, getMe, changePassword } = require('../controllers/auth.controller');
const {auth} = require('../middlewares/auth.middleware')

// POST /api/auth/register, 
router.post("/register", registerUser )

// POST login, 
router.post("/login", loginUser )

// GET /api/auth/me, 
router.get("/me", auth, getMe)

// PATCH /api/auth/change-password, 
router.patch("/change-password", auth, changePassword)


// POST /api/auth/logout.


module.exports = router;
