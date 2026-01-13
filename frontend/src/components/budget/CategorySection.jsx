import { useState, useEffect } from "react";
import EditableRow from "./EditableRow";
import { addItem, updateCategoryBudget } from "../../services/budget.api";

const CategorySection = ({ category, refreshOverview }) => {
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [itemTitle, setItemTitle] = useState("");
  const [plannedBudget, setPlannedBudget] = useState(category.plannedBudget || 0);

  useEffect(() => {
    setPlannedBudget(category.plannedBudget || 0);
  }, [category.id, category.plannedBudget]);

  const handleAddItem = async () => {
    if (!itemTitle.trim()) return;
    await addItem({
      categoryId: category.id,
      title: itemTitle.trim(),
      plannedCost: 0
    });
    setItemTitle("");
    setShowItemDialog(false);
    refreshOverview();
  };

  const handleBudgetBlur = async () => {
    if (plannedBudget !== category.plannedBudget) {
      await updateCategoryBudget(category.id, plannedBudget);
      refreshOverview();
    }
  };

  return (
    <div className="budget-category-container">
      {/* 1. High-Contrast Header */}
      <div className="category-header-bar">
        <div className="header-info">
          <h3 className="category-title">{category.name}</h3>
          <span className="count-badge">{category.items.length} Items</span>
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
        {category.items.length > 0 ? (
          category.items.map((item) => (
            <EditableRow key={item.id} item={item} />
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