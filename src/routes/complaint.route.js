const express = require("express");
const router= express.Router();

const {auth} = require("../middlewares/auth.middleware")
const {allowRole} = require("../middlewares/role.middleware")
const {createComplaints, getMyComplaints,getAllComplaints, assignComplaint, updateComplaintStatus, addComplaintResponse } = require("../controllers/complaint.controller")

const {createComplaintSchema, paginationSchema, userIdSchema, assignedToSchema, statusSchema , responsesSchema} = require("../validations/complaint.validation")
const {validate} = require('../middlewares/zodvalidation.middleware')

// Build: POST /api/complaints, GET /my, GET / (admin and support), GET /:id, PATCH /:id/status, PATCH /:id/assign (admin only), POST /:id/responses.
router.post('/', auth,  allowRole(['student']), validate(createComplaintSchema),  createComplaints)
router.get('/my', auth,  allowRole(['student']), getMyComplaints)

router.get('/', auth,  allowRole(['admin', 'support_officer']), getAllComplaints)
router.patch('/:id/assign', auth,  allowRole(['admin']), validate(userIdSchema, "params"), validate(assignedToSchema), assignComplaint)
router.patch('/:id/status', auth, updateComplaintStatus)
router.patch('/:id/responses', auth,  allowRole(['admin', 'support_officer']), validate(userIdSchema, "params"), validate(responsesSchema), addComplaintResponse)

module.exports = router;