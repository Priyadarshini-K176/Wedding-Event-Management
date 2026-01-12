const express = require("express");
const router = express.Router();

const {
  createNote,
  getNotes,
  deleteNote,
} = require("../controllers/noteController");

router.post("/", createNote);
router.get("/", getNotes);
router.delete("/:id", deleteNote);

module.exports = router;
