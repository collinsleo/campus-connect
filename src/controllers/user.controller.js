
const userService = require("../services/user.service");

// GET /api/users/me
exports.getMyProfile = async (req, res) => {
    try {
        const user = await userService.getMyProfile(req.user.id);

        return res.status(200).json({
            success: true,
            data: { user },
        });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            "message":"Unable to fetch my profile"
        })
        
    }
};

// PATCH /api/users/me
exports.updateMyProfile = async (req, res) => {
    try {
        const {fullName, department, phone, profileImage} = req.body
        const input = {
            fullName,
            department,
            phone,
            profileImage
        }

        const user = await userService.updateMyProfile(
            req.user.id,
            input
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: { user },
        });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            "message":"Unable to update my profile"
        })
    }
};

// GET /api/users
exports.getUsers = async (req, res) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const search = String(req.query.search ?? "").trim();

        if (
            !Number.isInteger(page) ||
            page < 1 ||
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Page must be positive and limit must be between 1 and 100",
            });
        }

        if (search.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Search cannot exceed 100 characters",
            });
        }

        const result = await userService.getUsers({
            page,
            limit,
            search,
        });

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({
            "message":"Unable to fetch users"
        })    
    }
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);

        return res.status(200).json({
            success: true,
            data: { user },
        });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            "message":"Unable to fetch current user "
        })
    }
};

// PATCH /api/users/:id/role
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (typeof role !== "string") {
            return res.status(400).json({
                success: false,
                message: "A valid role is required",
            });
        }

        const user = await userService.updateUserRole(
            req.params.id,
            role,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: "User role updated successfully",
            data: { user },
        });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            "message":"Unable to update user role"
        })
    }
};

// PATCH /api/users/:id/status
exports.updateUserStatus = async (req, res) => {
    try {
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be a boolean",
            });
        }

        const user = await userService.updateUserStatus(
            req.params.id,
            isActive,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: isActive
                ? "User account reactivated successfully"
                : "User account suspended successfully",
            data: { user },
        });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            "message":"Unable to update user status"
        })    
    }
};
