const mongoose = require("mongoose")

const responseSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const complaintSchema = new mongoose.Schema({
    title:{
      type:String,
      required:true,
      trim:true,
      minlength:[3, "Title must be at least 3 characters"],
      maxlength:[100, "Title mustnot excide 100 characters"]
    },
    description:{
      type:String,
      required:true,
      trim:true,
      minlength:[10, "Title must be at least 3 characters"],
    },
    category:{
      type:String,
      required:true,
      trim:true,
      enum:["Academic", "Accommodation", "Finance", "Technical", "Other"],
    },
    priority:{
        type:String,
        required:true,
        trim:true,
        enum:["Low", "Middium", "High"],
        default:"Middium"
    },
    Status:{
        type:String,
        required:true,
        enum:["Open", "In Progress", "Resolved", "Closed"],
        default:"Open"
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    responses: {
      type: [responseSchema],
      default: [],
    },
}, 
    {timestamps:true}
)

const Complaint = mongoose.model('Complaint', complaintSchema)
module.exports = Complaint;



// 5. COMPLAINTS (most important module)
// Fields: title, description, category (Academic, Accommodation, Finance, Technical, Other), priority (Low, Medium, High), status (Open, In Progress, Resolved, Closed), submittedBy, assignedTo, responses (sender ID, message, timestamp).
// Build: POST /api/complaints, GET /my, GET / (admin and support), GET /:id, PATCH /:id/status, PATCH /:id/assign (admin only), POST /:id/responses.
// - Students see only their own complaints and cannot mark them Resolved.
// - Nobody can read another student's complaint just by guessing its ID.