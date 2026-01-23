const mongoose = require("mongoose");
const Category = require("../models/Category");
const BudgetItem = require("../models/BudgetItem");


/* Get full budget overview */
const getOverview = async (req, res) => {
  try {
    // TODO: Remove fallback after frontend auth is implemented
    if (!req.user || !req.user.weddingId) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized"
  });
}

    const weddingId = req.user?.weddingId ;

    const categories = await Category.find({ weddingId })
      .sort({ order: 1 })
      .lean();

    const items = await BudgetItem.find({ weddingId }).lean();

    const categoryMap = categories.map((cat) => {
      const catItems = items.filter(
        (item) => item.categoryId.toString() === cat._id.toString()
      );

      const categoryTotal = catItems.reduce(
        (sum, i) => sum + i.actualCost,
        0
      );

    const remaining = (cat.plannedBudget || 0) - categoryTotal;

return {
  id: cat._id,
  name: cat.name,
  plannedBudget: cat.plannedBudget || 0,
  categoryTotal,
  remaining,
  items: catItems.map((i) => ({
    id: i._id,
    title: i.title,
    plannedCost: i.plannedCost || 0,
    actualCost: i.actualCost
  }))
};

    });

    const overallTotal = categoryMap.reduce(
      (sum, c) => sum + c.categoryTotal,
      0
    );

    res.json({
      success: true,
      data: {
        categories: categoryMap,
        overallTotal
      }
    });
  } catch (err) {
    console.error("Get overview error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load budget"
    });
  }
};

/* Add new category */
const addCategory = async (req, res) => {
  try {
    if (!req.user || !req.user.weddingId) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized"
  });
}

    const { name } = req.body;
    // TODO: Remove fallback after frontend auth is implemented
    const weddingId = req.user?.weddingId ;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required"
      });
    }

    const count = await Category.countDocuments({ weddingId });

    const category = await Category.create({
      weddingId,
      name,
      order: count
    });

    res.status(201).json({
      success: true,
      data: {
        id: category._id,
        name: category.name
      }
    });
  } catch (err) {
    console.error("Add category error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add category"
    });
  }
};


/* Add new item */
const addItem = async (req, res) => {
  try {
    if (!req.user || !req.user.weddingId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const { categoryId, title, plannedCost } = req.body;
    const weddingId = req.user.weddingId;

    // ✅ Validate categoryId properly
    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Valid categoryId is required"
      });
    }

    // ✅ Enforce title (NO silent fallback)
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Item title is required"
      });
    }

    const item = await BudgetItem.create({
      weddingId,
      categoryId,
      title: title.trim(),
      plannedCost: Number(plannedCost) || 0,
      actualCost: 0
    });

    res.status(201).json({
      success: true,
      data: {
        id: item._id,
        title: item.title,
        plannedCost: item.plannedCost,
        actualCost: item.actualCost
      }
    });
  } catch (err) {
    console.error("Add item error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add item"
    });
  }
};



/* Update budget item (autosave-safe) */
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, actualCost, plannedCost } = req.body;
    if (!req.user || !req.user.weddingId) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized"
  });
}

    // TODO: Remove fallback after frontend auth is implemented
    const weddingId = req.user?.weddingId ;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Item id is required"
      });
    }

    const update = {};

    if (title !== undefined) update.title = title;
    if (actualCost !== undefined) update.actualCost = actualCost;
    if (plannedCost !== undefined) update.plannedCost = plannedCost;

    if (Object.keys(update).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update"
      });
    }

    const item = await BudgetItem.findOneAndUpdate(
      { _id: id, weddingId },
      { $set: update },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    res.json({
      success: true,
      data: {
        id: item._id,
        title: item.title,
        plannedCost: item.plannedCost,
        actualCost: item.actualCost
      }
    });
  } catch (err) {
    console.error("Update item error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update item"
    });
  }
};

//updateCatgoryBudget

const updateCategoryBudget = async (req, res) => {
  try {
    if (!req.user || !req.user.weddingId) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized"
  });
}

    const { id } = req.params;
    const { plannedBudget } = req.body;
    // TODO: Remove fallback after frontend auth is implemented
    const weddingId = req.user?.weddingId ;

    if (plannedBudget === undefined || plannedBudget < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid planned budget"
      });
    }

    const category = await Category.findOneAndUpdate(
      { _id: id, weddingId },
      { $set: { plannedBudget: Number(plannedBudget) } },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.json({
      success: true,
      data: {
        id: category._id,
        plannedBudget: category.plannedBudget
      }
    });
  } catch (err) {
    console.error("Update category budget error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update category budget"
    });
  }
};

/* Delete budget item */
const deleteItem = async (req, res) => {
  try {
    if (!req.user || !req.user.weddingId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const { id } = req.params;
    const weddingId = req.user.weddingId;

    console.log("Delete item request - ID:", id, "WeddingID:", weddingId);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Item id is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID format"
      });
    }

    const item = await BudgetItem.findOneAndDelete(
      { _id: id, weddingId }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    res.json({
      success: true,
      message: "Item deleted successfully"
    });
  } catch (err) {
    console.error("Delete item error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete item"
    });
  }
};

/* Delete budget category */
const deleteCategory = async (req, res) => {
  try {
    if (!req.user || !req.user.weddingId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const { id } = req.params;
    const weddingId = req.user.weddingId;

    console.log("Delete category request - ID:", id, "WeddingID:", weddingId);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category id is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format"
      });
    }

    // Check if category has items
    const itemCount = await BudgetItem.countDocuments({ categoryId: id, weddingId });
    if (itemCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${itemCount} items. Delete items first.`
      });
    }

    const category = await Category.findOneAndDelete(
      { _id: id, weddingId }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (err) {
    console.error("Delete category error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete category"
    });
  }
};



module.exports = {
  getOverview,
  addCategory,
  addItem,
  updateItem,
  updateCategoryBudget,
  deleteItem,
  deleteCategory,
};
