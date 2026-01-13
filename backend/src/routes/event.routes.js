const express = require("express");
const router=express.Router();
const auth = require("../middlewares/auth.middleware");
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent
} = require("../controllers/event.controller.js");


// Enable auth middleware for user-specific data
router.post("/", auth, createEvent);
router.get("/", auth, getEvents);
router.put("/:id", auth, updateEvent);
router.delete("/:id", auth, deleteEvent);

module.exports=router;
