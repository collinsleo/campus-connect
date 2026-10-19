

exports. adminOnly = (req, res, next)=>{
    const user = req.user

    if(user.role !== "admin"){
        throw new Error("Unauthourized, Access denaied");
    }

    next();
}