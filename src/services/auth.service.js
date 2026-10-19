const User = require('../models/users.model')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');



exports.registerUser = async ({fullName, email, password})=>{
    
    const userExisting = await User.findOne({email:email})
    if(userExisting){
        throw new Error("User ALready Existing");
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        fullName,
        email,
        password: hashedPassword,
    });

    await newUser.save();

    return newUser      
}



exports. loginUser = async (email, password )=>{
    
    const user = await User.findOne({email})
    if(!user){
        throw new Error("User not found")
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password)

    if(!passwordMatch){
        throw new Error("Invalid password"); 
    }

    const token = jwt.sign({id:user._id, email:user.email, role:user.role}, process.env.JWT_SECRETE, {expiresIn: "1h"})
    return({
        token: token, 
        user: user
    })
}


exports.userProfile = async (id)=>{
    
    const user = await User.findById({_id:id}).select("-password")
    if(!user){
        throw new Error("User not found")
    }

    return(user)
}

exports.changePassword = async (
    userId,
    currentPassword,
    newPassword
) => {
    // Find the user 
    const user = await User.findById(userId).select("+password");

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    // Verify the current password
    const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
    );

    if (!isPasswordValid) {
        const error = new Error("Current password is incorrect");
        error.statusCode = 400;
        throw error;
    }

    // Prevent changing the password to the same password
    const isSamePassword = await bcrypt.compare(
        newPassword,
        user.password
    );

    if (isSamePassword) {
        const error = new Error(
            "New password must be different from current password"
        );
        error.statusCode = 400;
        throw error;
    }

    // Hash the new password before saving
    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    return {
        message: "Password changed successfully",
    };
};

