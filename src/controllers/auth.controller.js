const authService = require('../services/auth.service')
const jwt = require("jsonwebtoken")


exports.registerUser = async (req, res) =>{
    try{
        const { fullName, email, password } = req.body;

        if(!fullName || !email || !password){
            return res.status(400).json({
                message: "Please provide all required fields",
            })
        }

        const newUser = await authService.registerUser({fullName, email, password})

        return res.status(201).json({
            message: "User registered successfully",
            newUser
        })
       
    }catch(error){

        console.log("ERROR:", error.message);
        return res.status(500).json({
            message: "Error registering user",
        })

    }
}


exports. loginUser = async (req,res) =>{
    try{

        const {email, password} = req.body;
        

        if(!email || !password){
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const {token, user} = await authService.loginUser(email, password)
        
        return res.status(200).json({
            message: "Login successful",
            token,
            user:{
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            }
        })

    }catch(error){
        console.log("Error login in: ", error.message);    
        return res.status(500).json({
            message: "Error loging in user",
        })
    }
}


exports. getMe = async(req,res) => {
    try {
        
        const result = await authService.userProfile(req.user.id);

        res.status(200).json({
            success: true,
            result,
        });        
    } catch (error) {
        console.log("Error showing user profile: ", error.message);    
    }
}

exports. changePassword = async(req,res) => {
    try {
        const {currentPassword, newPassword} = req.body;


        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required",
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters",
            });
        }

        const result = await authService.changePassword(req.user._id, currentPassword, newPassword);

        res.status(200).json({
            success: true,
            result,
        });        
    } catch (error) {
        console.log("Error showing user profile: ", error.message);    
    }
}

