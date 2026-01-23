const User = require("../models/User");
const { ROLES } = require("../utils/rbac.constants");

/**
 * Get all users for a wedding
 * @route GET /api/users
 * @access OWNER only
 */
exports.getWeddingUsers = async (req, res) => {
  try {
    const { weddingId } = req.user;

    const users = await User.find({ weddingId })
      .select("name email role createdAt")
      .lean();

    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};

/**
 * Change user role
 * @route PATCH /api/users/:userId/role
 * @access OWNER only
 */
exports.changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const { weddingId } = req.user;

    // Validate role
    if (!Object.values(ROLES).includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${Object.values(ROLES).join(", ")}`
      });
    }

    // Check if user belongs to same wedding
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.weddingId.toString() !== weddingId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Cannot modify users from different wedding"
      });
    }

    // Prevent removing all owners
    if (user.role === ROLES.OWNER && role !== ROLES.OWNER) {
      const ownerCount = await User.countDocuments({
        weddingId,
        role: ROLES.OWNER
      });

      if (ownerCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "Cannot remove the last owner. Assign another owner first."
        });
      }
    }

    // Update role
    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role changed to ${role}`,
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error changing user role:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change user role"
    });
  }
};

/**
 * Remove user from wedding
 * @route DELETE /api/users/:userId
 * @access OWNER only
 */
exports.removeUserFromWedding = async (req, res) => {
  try {
    const { userId } = req.params;
    const { weddingId, userId: currentUserId } = req.user;

    // Prevent self-removal
    if (userId === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot remove yourself from the wedding"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check ownership
    if (user.weddingId.toString() !== weddingId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Cannot remove users from different wedding"
      });
    }

    // Prevent removing last owner
    if (user.role === ROLES.OWNER) {
      const ownerCount = await User.countDocuments({
        weddingId,
        role: ROLES.OWNER
      });

      if (ownerCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "Cannot remove the last owner"
        });
      }
    }

    // Remove weddingId (user still exists but not associated with wedding)
    user.weddingId = null;
    user.role = ROLES.OWNER; // Reset to default role
    await user.save();

    res.json({
      success: true,
      message: "User removed from wedding"
    });
  } catch (error) {
    console.error("Error removing user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove user"
    });
  }
};

/**
 * Get current user's role and permissions
 * @route GET /api/users/me/permissions
 * @access All authenticated users
 */
exports.getUserPermissions = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { ROLE_PERMISSIONS } = require("../utils/rbac.constants");

    const permissions = ROLE_PERMISSIONS[role] || [];

    res.json({
      success: true,
      data: {
        userId,
        role,
        permissions,
        permissionCount: permissions.length
      }
    });
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch permissions"
    });
  }
};
