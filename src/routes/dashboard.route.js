const express = require('express');
const router = express.Router();
const {adminDashboard} = require("../controllers/dashboard.controller")
const {auth} = require("../middlewares/auth.middleware")
const {allowRole} = require("../middlewares/role.middleware")

router.get(
  "/",
  auth,
  allowRole(['admin']),
  adminDashboard
);

module.exports =  router;