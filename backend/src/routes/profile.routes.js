const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { apiLimiter } = require("../middlewares/rateLimiter");
const { requirePermission, requireEditAccess } = require("../middlewares/rbac.middleware");
const { PERMISSIONS } = require("../utils/rbac.constants");
const { updateProfileSchema } = require("../validations/schemas");
const { getProfile, updateProfile } = require("../controllers/profile.controller");

router.use(auth);
router.use(apiLimiter);

// Get profile (all authenticated users)
router.get("/", requirePermission(PERMISSIONS.VIEW_PROFILE), getProfile);

// Update profile (OWNER, EDITOR)
router.put("/", requireEditAccess(), validate(updateProfileSchema), updateProfile);

module.exports = router;