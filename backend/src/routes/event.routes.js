const express = require("express");
const router=express.Router();
const auth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { apiLimiter } = require("../middlewares/rateLimiter");
const { requirePermission, requireEditAccess, requireOwnerRole } = require("../middlewares/rbac.middleware");
const { PERMISSIONS } = require("../utils/rbac.constants");
const { addEventSchema, updateEventSchema } = require("../validations/schemas");
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent
} = require("../controllers/event.controller.js");

// Enable auth middleware for user-specific data
router.use(auth);
router.use(apiLimiter);

router.post("/", requireEditAccess(), validate(addEventSchema), createEvent);
router.get("/", requirePermission(PERMISSIONS.VIEW_EVENTS), getEvents);
router.put("/:id", requireEditAccess(), validate(updateEventSchema), updateEvent);
router.delete("/:id", requireOwnerRole(), deleteEvent);

module.exports=router;
