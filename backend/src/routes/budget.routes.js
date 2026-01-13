const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const budgetController = require("../controllers/budget.controller");

router.use(authMiddleware);

router.get("/overview", budgetController.getOverview);
router.post("/category", budgetController.addCategory);
router.post("/item", budgetController.addItem);
router.patch("/item/:id", budgetController.updateItem);
router.patch("/category/:id", budgetController.updateCategoryBudget);

module.exports = router;
