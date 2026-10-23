const Complaint = require("../models/complaint.model")
const User = require("../models/users.model")
const mongoose = require('mongoose')

// Create a complaint
exports.createComplaint = async (data, user)=>{
  return Complaint.create({
    title: data.title,
    description: data.description,
    category: data.category,
    priority: data.priority ?? "Medium",
    submittedBy: user.id,
  });
}

// Get the current student's complaints
exports.getMyComplaints = async (userId, page = 1, limit = 10)=> {
  const skip = (page - 1) * limit;

  const [complaints, total] = await Promise.all([
    Complaint.find({ submittedBy: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Complaint.countDocuments({ submittedBy: userId }),
  ]);

  return {
    complaints,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// Admin and support: list complaints
exports.getAllComplaints = async(query = {}, user) =>{
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.category) filter.category = query.category;
  if (query.priority) filter.priority = query.priority;
  if (user.role == "support_officer")  filter.assignedTo = user._id;

  const [complaints, total] = await Promise.all([
    Complaint.find(filter)
      .populate("submittedBy", "fullName email")
      .populate("assignedTo", "fullName email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Complaint.countDocuments(filter),
  ]);

  return {
    complaints,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// Get one complaint with ownership protection
exports.getComplaintById =  async(complaintId, user) =>{
  if (!mongoose.isValidObjectId(complaintId)) {
    throw httpError(404, "Complaint not found");
  }

  const filter = { _id: complaintId };

  if (user.role == "student") {
    filter.submittedBy = user._id;
  }

  const complaint = await Complaint.findOne(filter)
    .populate("submittedBy", "fullName email")
    .populate("assignedTo", "fullName email")
    .populate("responses.senderId", "fullName role");

  if (!complaint) {
    throw httpError(404, "Complaint not found");
  }

  return complaint;
}

// Update complaint status
exports. updateComplaintStatus = async(
  complaintId,
  status,
  user
)=> {
  const complaint = await Complaint({_id:complaintId});

  if (user.role == "student") {

    if(!complaint.submittedBy.equals(user._id)){
      throw new Error("Student can only update there complaints")
    }


    // Students may reopen their own complaint, but cannot
    // set it to In Progress, Resolved, or Closed.
    if (status !== "Open") {
      throw httpError(
        403,
        "Students can only reopen their own complaints"
      );
    }

    if (["Resolved", "Closed"].includes(complaint.status)) {
      // A student may reopen a previously resolved/closed complaint.
      complaint.Status = "Open";
      await complaint.save();
      return complaint;
    }
  }

  if(status == "support_officer" && !complaint.assignedTo.egauls(user._id)){
    throw new Error("Support officers can only update complaints assigned to them")
  }

  const Status = {Status: status}


 const announcement = await Complaint.findByIdAndUpdate(
    complaintId,
    { $set: {Status:status} },
  )
  await complaint.save();

  return complaint;
}

// Assign complaint — admin only
exports.assignComplaint = async(
  complaintId,
  assignedTo
)=> {
  if (!mongoose.isValidObjectId(complaintId)) {
    throw new Error("Complaint not found");
  }

  if (!mongoose.isValidObjectId(assignedTo)) {
    throw new Error("Invalid staff ID");
  }

  const staff = await User.findById(assignedTo).select("role");

  if (!staff || !["admin", "support_officer"].includes(staff.role)) {
    throw httpError(400, "Assignee must be an admin or support officer");
  }

  const complaint = await Complaint.findByIdAndUpdate(
    complaintId,
    { $set: { assignedTo } },
    { returnDocument: "after", runValidators: true }
  );

  if (!complaint) {
    throw httpError(404, "Complaint not found");
  }

  return complaint;
}

// Add a response
exports.addComplaintResponse = async(
  complaintId,
  message,
  user
) => {
  const complaint = await Complaint.findById({_id:complaintId});

  if(!complaint){
    throw new Error("complaints record no found"); 
  }

  if((user.role == "student" && !complaint.submittedBy.eguala(user._id)) || (!complaint.assignedTo.equals(user._id))){    
    throw new Error("Not Eligible to send a resrponse");
  }

  if (complaint.Status === "Closed") {
    throw new Error("Cannot respond to a closed complaint");
  }

  complaint.responses.push({
    senderId: user._id,
    message,
    timestamp: new Date(),
  });

  await complaint.save();

  return complaint;
}

