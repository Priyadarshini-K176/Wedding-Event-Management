const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { apiLimiter } = require("../middlewares/rateLimiter");
const { requirePermission, requireEditAccess, requireOwnerRole } = require("../middlewares/rbac.middleware");
const { PERMISSIONS } = require("../utils/rbac.constants");
const { addNoteSchema, updateNoteSchema } = require("../validations/schemas");

const {
  createNote,
  getNotes,
  deleteNote,
  updateNote,
} = require("../controllers/noteController");

router.use(auth);
router.use(apiLimiter);

router.post("/", requireEditAccess(), validate(addNoteSchema), createNote);
router.get("/", requirePermission(PERMISSIONS.VIEW_NOTES), getNotes);
router.put("/:id", requireEditAccess(), validate(updateNoteSchema), updateNote);
router.delete("/:id", requireEditAccess(), deleteNote);

module.exports = router;
