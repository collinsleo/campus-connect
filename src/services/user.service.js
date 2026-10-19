
const User = require("../models/users.model");

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

// GET /api/users/me
exports.getMyProfile = async (userId) => {
    const user = await User.findById({_id:userId}).select("-password");

    if (!user) {
        throw createError("User not found", 404);
    }

    return user;
};

// PATCH /api/users/me
exports.updateMyProfile = async (userId, input) => {

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: input },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!user) {
        throw createError("User not found", 404);
    }

    return user;
};

// GET /api/users
exports.getUsers = async ({ page, limit, search }) => {
    const filter = {};

    if (search) {
        const escapedSearch = search.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const searchRegex = new RegExp(escapedSearch, "i");

        filter.$or = [
            { fullName: searchRegex },
            { email: searchRegex },
        ];
    }

    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
        User.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),

        User.countDocuments(filter),
    ]);

    return {
        users,
        pagination: {
            totalUsers,
            currentPage: page,
            limit,
            totalPages: Math.ceil(totalUsers / limit),
            hasNextPage: page * limit < totalUsers,
            hasPreviousPage: page > 1,
        },
    };
};

// GET /api/users/:id
exports.getUserById = async (userId) => {
    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw createError("User not found", 404);
    }

    return user;
};

// PATCH /api/users/:id/role
exports.updateUserRole = async (userId, role, adminId) => {
    
    if (userId === adminId && role !== "admin") {
        throw createError(
            "You cannot remove your own admin role",
            400
        );
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: { role } },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!user) {
        throw createError("User not found", 404);
    }

    return user;
};

// PATCH /api/users/:id/status
exports.updateUserStatus = async (userId, isActive, adminId) => {
    if (typeof isActive !== "boolean") {
        throw createError(
            "isActive must be true or false",
            400
        );
    }

    if (userId === adminId && isActive === false) {
        throw createError(
            "You cannot suspend your own account",
            400
        );
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: { isActive } },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!user) {
        throw createError("User not found", 404);
    }

    return user;
};
