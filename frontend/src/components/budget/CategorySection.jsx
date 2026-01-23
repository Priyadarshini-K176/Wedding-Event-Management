import { useState, useEffect } from "react";
import EditableRow from "./EditableRow";
import { addItem, updateCategoryBudget, deleteCategory } from "../../services/budget.api";

const CategorySection = ({ category, refreshOverview }) => {
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [itemTitle, setItemTitle] = useState("");
  const [plannedBudget, setPlannedBudget] = useState(category.plannedBudget || 0);
  const [items, setItems] = useState(category.items || []);

  useEffect(() => {
    setPlannedBudget(category.plannedBudget || 0);
    setItems(category.items || []);
  }, [category.id, category.plannedBudget, category.items]);

  const handleAddItem = async () => {
    if (!itemTitle.trim()) return;
    try {
      const response = await addItem({
        categoryId: category.id,
        title: itemTitle.trim(),
        plannedCost: 0
      });
      if (response.data.success) {
        setItemTitle("");
        setShowItemDialog(false);
        refreshOverview();
      } else {
        console.error("Failed to add item:", response.data.message);
        alert("Failed to add item");
      }
    } catch (err) {
      console.error("Add item error:", err);
      alert("Failed to add item: " + (err.response?.data?.message || err.message));
    }
  };

  const handleBudgetBlur = async () => {
    if (plannedBudget !== category.plannedBudget) {
      try {
        const response = await updateCategoryBudget(category.id, plannedBudget);
        if (response.data.success) {
          refreshOverview();
        } else {
          console.error("Failed to update budget:", response.data.message);
        }
      } catch (err) {
        console.error("Budget update error:", err);
        alert("Failed to update budget");
      }
    }
  };

  const handleDeleteCategory = async () => {
    if (window.confirm(`Delete category "${category.name}" and all its items?`)) {
      try {
        const response = await deleteCategory(category.id);
        if (response.data.success) {
          refreshOverview();
        } else {
          alert(response.data.message || "Failed to delete category");
        }
      } catch (err) {
        console.error("Delete category error:", err);
        alert("Failed to delete category: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleDeleteItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  return (
    <div className="budget-category-container">
      {/* 1. High-Contrast Header */}
      <div className="category-header-bar">
        <div className="header-info">
          <h3 className="category-title">{category.name}</h3>
          <button className="delete-category-btn" onClick={handleDeleteCategory} title="Delete category">
            🗑️
          </button>
          <span className="count-badge">{items.length} Items</span>
        </div>

        <div className="header-summary">
          <div className="summary-item">
            <label>Actual Spent</label>
            <span className="total-amount">₹{(category.categoryTotal ?? 0).toLocaleString()}</span>
          </div>
          <div className="header-divider"></div>
          <div className="summary-item">
            <label>Planned Budget</label>
            <div className="input-group">
               <span className="curr">₹</span>
               <input
                type="number"
                value={plannedBudget}
                onChange={(e) => setPlannedBudget(Number(e.target.value))}
                onBlur={handleBudgetBlur}
                className="planned-total-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Structured Table Headings */}
      <div className="table-column-headers">
        <div className="col-desc">Expense Description</div>
        <div className="col-num">Planned</div>
        <div className="col-num">Actual</div>
        <div className="col-spacer"></div>
      </div>

      {/* 3. Items List */}
      <div className="category-items-list">
        {items.length > 0 ? (
          items.map((item) => (
            <EditableRow key={item.id} item={item} onDelete={handleDeleteItem} />
          ))
        ) : (
          <div className="empty-row">No items added to this category.</div>
        )}
      </div>

      {/* 4. Defined Add Button */}
      <button className="category-add-btn" onClick={() => setShowItemDialog(true)}>
        + Add New Item
      </button>

      {/* Dialog / Modal */}
      {showItemDialog && (
        <div className="dialog-backdrop">
          <div className="dialog-box">
            <h3>Add New Item</h3>
            <p>What is this expense for?</p>
            <input
              placeholder="e.g., Venue Deposit"
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              autoFocus
            />
            <div className="dialog-footer">
              <button className="cancel-btn" onClick={() => setShowItemDialog(false)}>Cancel</button>
              <button className="confirm-btn" onClick={handleAddItem}>Add Item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySection;