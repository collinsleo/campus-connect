
const dashboardService = require("../services/dashboard.services")

exports. adminDashboard = async(req,res)=>{
    try {
        const analysis = await dashboardService.getAdminDashboard();
    
        return res.status(200).json({
            message:"dashboard analysis",
            data: analysis,
        })
        
        
    } catch (error) {
        console.log(error.message);
        
        return res.status(500).json({
            message:"can't fetch dashboard analysis",
        })
    }
}
