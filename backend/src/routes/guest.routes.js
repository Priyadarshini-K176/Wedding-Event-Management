const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { apiLimiter } = require("../middlewares/rateLimiter");
const { requirePermission, requireEditAccess, requireOwnerRole } = require("../middlewares/rbac.middleware");
const { PERMISSIONS } = require("../utils/rbac.constants");
const { addGuestSchema, updateGuestSchema } = require("../validations/schemas");
const { addGuest, getGuests, updateGuestRsvp } = require("../controllers/guest.controller");

router.use(authMiddleware);
router.use(apiLimiter);

// Add guest (EDITOR, OWNER)
router.post("/", requireEditAccess(), validate(addGuestSchema), addGuest);

// Get guests (VIEWER, EDITOR, OWNER)
router.get("/", requirePermission(PERMISSIONS.VIEW_GUESTS), getGuests);

// Update RSVP (EDITOR, OWNER)
router.patch("/:id/rsvp", requireEditAccess(), validate(updateGuestSchema), updateGuestRsvp);

module.exports = router;
