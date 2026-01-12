const express = require("express");
const router=express.Router();
const auth = require("../middlewares/auth.middleware");
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent
} = require("../controllers/event.controller.js");


// TODO: Re-enable auth middleware after frontend auth is implemented
router.post("/", createEvent);
router.get("/", getEvents);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports=router;
