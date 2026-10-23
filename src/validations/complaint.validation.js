const {z} = require("zod");

exports. createComplaintSchema = z.object({
  title: z.string().trim().min(5).max(150),

  description: z.string().trim().min(10).max(10000),

  category: z.enum(["Academic", "Accommodation", "Finance", "Technical", "Other"]),

  priority: z.enum([
    "Low",
    "Middium",
    "High",
  ]).default("Middium"),

}).strict();

exports. responsesSchema = z.object({
  message: z.string().trim().min(10).max(10000),
}).strict();

exports.userIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid Complaints ID"),
});

exports.statusSchema = z.object({
  status: z.string().regex(/^[a-f\d]{24}$/i, "Invalid Complaints ID"),
});

exports.assignedToSchema = z.object({
  assignedTo: z.string().regex(/^[a-f\d]{24}$/i, "Invalid Complaints ID"),
});


exports. paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

