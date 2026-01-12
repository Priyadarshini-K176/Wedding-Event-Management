const express = require("express");
const router = express.Router();

const {
  getOverview,
  addCategory,
  addItem,
  updateItem,
  updateCategoryBudget
} = require("../controllers/budget.controller");

const auth = require("../middlewares/auth.middleware");

// TODO: Re-enable auth middleware after frontend auth is implemented
router.get("/overview", getOverview);
router.post("/categories", addCategory);
router.post("/items", addItem);
router.patch("/items/:id", updateItem);
router.patch("/categories/:id/budget", updateCategoryBudget);


module.exports = router;
