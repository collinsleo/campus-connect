
const User = require("../models/users.model.js");
const Complaint = require("../models/complaint.model.js");
const Announcement = require("../models/annoucement.model.js");

exports. getAdminDashboard = async () => {
  const [
    totalUsers,
    usersByRole,
    totalComplaints,
    openComplaints,
    resolvedComplaints,
    totalAnnouncements,
    announcementsByCategory,
  ] = await Promise.all([
    // User statistics
    User.countDocuments(),

    User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]),

    // Complaint statistics
    Complaint.countDocuments(),
    Complaint.countDocuments({ status: "Open" }),
    Complaint.countDocuments({ status: "Resolved" }),

    // Announcement statistics
    Announcement.countDocuments(),

    Announcement.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]),
  ]);

  const roleCounts = Object.fromEntries(
    usersByRole.map(({ _id, count }) => [_id, count])
  );

  const categoryCounts = Object.fromEntries(
    announcementsByCategory.map(({ _id, count }) => [_id, count])
  );

  return {
    users: {
      total: totalUsers,
      byRole: roleCounts,
    },

    complaints: {
      total: totalComplaints,
      open: openComplaints,
      resolved: resolvedComplaints,
    },

    announcements: {
      total: totalAnnouncements,
      byCategory: {
        academic: categoryCounts.academic || 0,
        event: categoryCounts.event || 0,
        general: categoryCounts.general || 0,
        emergency: categoryCounts.emergency || 0,
      },
    },
  };
};
