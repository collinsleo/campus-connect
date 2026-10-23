
const complaintService = require("../services/complaint.service")


exports.createComplaints = async(req,res)=>{
    try{
        const {title, description, category, priority} = req.body
        if(!title || !description || !category || !priority){
            return res.status(400).json({
                message: "Required field is empty"
            })
        }

        const complaint = await complaintService.createComplaint(
        req.body,
        req.user
        );

        res.status(201).json({
        success: true,
        message: "Complaint submitted successfully",
        data: complaint,
        });

    }catch(error){
        console.log(error.message);
        return res.status(500).json({
            message:"Error creating complient"
        })
    }

}

exports.getMyComplaints = async(req, res)=> {
  try {
    const result = await complaintService.getMyComplaints(
      req.user.id,
      Number(req.query.page) || 1,
      Number(req.query.limit) || 10
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Error fetching my Complaint "
    })
  }
}

exports.getAllComplaints = async(req, res, next) => {
  try {
    const user= req.user;
    if(!user){
      return res.status(400).json({
        message: "user no found"
      })
    }
    const result = await complaintService.getAllComplaints(req.query, user);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Error fetching all Complaints"
    })
  }
}

exports.getComplaintById = async(req, res, next)=> {
  try {
    const complaint = await complaintService.getComplaintById(
      req.params.id,
      req.user
    );

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {    
    console.error(error.message);
    return res.status(500).json({
      message: "Error fetching a Complaint"
    })
  }
}

exports.updateComplaintStatus = async(req, res, next)=> {
  try {
    const user = req.user;
    const {status} = req.body

    const complaint = await complaintService.updateComplaintStatus(
      req.params.id,
      status,
      user
    );

    res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      data: complaint,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error update Complaint status "
    })
  }
}

exports.assignComplaint = async(req, res, next) => {
  try {
    const complaint = await complaintService.assignComplaint(
      req.params.id,
      req.body.assignedTo
    );

    res.status(200).json({
      success: true,
      message: "Complaint assigned successfully",
      data: complaint,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error assigning Complaint "
    })
  }
}

exports.addComplaintResponse = async(req, res, next)=> {
  try {
    const user = req.user
    if(!user){
      return res.status(400).json({
        message:"user not found"
      })
    }

    const complaint = await complaintService.addComplaintResponse(
      req.params.id,
      req.body.message,
      req.user
    );

    res.status(201).json({
      success: true,
      message: "Response added successfully",
      data: complaint,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Error responding to Complaints"
    })
  }
}

