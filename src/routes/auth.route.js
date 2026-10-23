const router =  require('express').Router();
const { registerUser, loginUser, getMe, changePassword } = require('../controllers/auth.controller');
const {auth} = require('../middlewares/auth.middleware')
//validation
const {registerSchema, loginSchema} = require("../validations/auth.validation")
const {validate} = require("../middlewares/zodvalidation.middleware")


// POST /api/auth/register, 
router.post("/register", validate(registerSchema),  registerUser )

// POST login, 
router.post("/login", validate(loginSchema), loginUser )

// GET /api/auth/me, 
router.get("/me", auth, getMe)

// PATCH /api/auth/change-password, 
router.patch("/change-password", auth, changePassword)


// POST /api/auth/logout.


module.exports = router;
