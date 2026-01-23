const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { apiLimiter } = require("../middlewares/rateLimiter");
const { requirePermission, requireEditAccess, requireOwnerRole } = require("../middlewares/rbac.middleware");
const { PERMISSIONS } = require("../utils/rbac.constants");
const {
  addCategorySchema,
  addItemSchema,
  updateItemSchema,
  updateCategoryBudgetSchema,
} = require("../validations/schemas");
const budgetController = require("../controllers/budget.controller");

router.use(authMiddleware);
router.use(apiLimiter);

// View budget (VIEWER, EDITOR, OWNER)
router.get("/overview", requirePermission(PERMISSIONS.VIEW_BUDGET), budgetController.getOverview);

// Create category (EDITOR, OWNER)
router.post("/category", requireEditAccess(), validate(addCategorySchema), budgetController.addCategory);

// Create item (EDITOR, OWNER)
router.post("/item", requireEditAccess(), validate(addItemSchema), budgetController.addItem);

// Update item (EDITOR, OWNER)
router.patch("/item/:id", requireEditAccess(), validate(updateItemSchema), budgetController.updateItem);

// Delete item (OWNER only)
router.delete("/item/:id", requireOwnerRole(), budgetController.deleteItem);

// Update category budget (EDITOR, OWNER)
router.patch("/category/:id", requireEditAccess(), validate(updateCategoryBudgetSchema), budgetController.updateCategoryBudget);

// Delete category (OWNER only)
router.delete("/category/:id", requireOwnerRole(), budgetController.deleteCategory);

module.exports = router;
