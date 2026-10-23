const {z} = require("zod")

exports. createAnnouncementSchema = z.object({
  title: z.string().trim().min(5).max(150),

  content: z.string().trim().min(10).max(10000),

  category: z.enum([
    "academic",
    "event",
    "general",
    "emergency",
  ]).default("general"),

}).strict();

exports. updateAnnoucementSchema = z.object({
  title: z.string().trim().min(5).max(150),

  content: z.string().trim().min(10).max(10000),

  category: z.enum([
    "academic",
    "event",
    "general",
    "emergency",
  ]).default("general"),

}).strict();

exports.userIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid user ID"),
});


exports. paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

