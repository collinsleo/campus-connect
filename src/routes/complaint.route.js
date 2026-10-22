const express = require("express");
const router= express.Router();

const {auth} = require("../middlewares/auth.middleware")
const {allowRole} = require("../middlewares/role.middleware")
const {createComplaints, getMyComplaints,getAllComplaints, assignComplaint, updateComplaintStatus, addComplaintResponse } = require("../controllers/complaint.controller")


// Build: POST /api/complaints, GET /my, GET / (admin and support), GET /:id, PATCH /:id/status, PATCH /:id/assign (admin only), POST /:id/responses.
router.post('/', auth,  allowRole(['student']), createComplaints)
router.get('/my', auth,  allowRole(['student']), getMyComplaints)

router.get('/', auth,  allowRole(['admin', 'support_officer']), getAllComplaints)
router.patch('/:id/assign', auth,  allowRole(['admin']), assignComplaint)
router.patch('/:id/status', auth, updateComplaintStatus)
router.patch('/:id/responses', auth,  allowRole(['admin', 'support_officer']), addComplaintResponse)

module.exports = router;