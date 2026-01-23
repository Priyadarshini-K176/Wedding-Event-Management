const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { apiLimiter } = require("../middlewares/rateLimiter");
const { requireOwnerRole, requirePermission } = require("../middlewares/rbac.middleware");
const { PERMISSIONS } = require("../utils/rbac.constants");
const userController = require("../controllers/user.controller");

router.use(authMiddleware);
router.use(apiLimiter);

// Get current user's permissions (all authenticated users)
router.get("/me/permissions", userController.getUserPermissions);

// Get all users in wedding (OWNER only)
router.get("/", requireOwnerRole(), userController.getWeddingUsers);

// Change user role (OWNER only)
router.patch("/:userId/role", requireOwnerRole(), userController.changeUserRole);

// Remove user from wedding (OWNER only)
router.delete("/:userId", requireOwnerRole(), userController.removeUserFromWedding);

module.exports = router;
