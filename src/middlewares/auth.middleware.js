const jwt = require('jsonwebtoken')
const User  = require('../models/users.model')


exports.auth = async (req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({
                message : "authentication header is required"
            })
        }

        if(!authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                message: "Invalid Authorization format"
            })
        }

        const token = authHeader.split(" ")[1]

        if(!token){
            return res.status(401).json({
                message: "Authntication token is missing or invalid"
            })
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRETE
        )

        const user = await User.findById(
            decoded.id
        ).select('-password')
        

        if(!user){
            return res.status(401).json({
                message: "User no longer exist"
            })
        }

        req.user = user;

        req.user.role= user.role || "student";
        next()

    }catch(error){
        console.log(error.message);
        return res.status(401).json({
            message: `Bad request: ${error.message}`
        })
    }
}


