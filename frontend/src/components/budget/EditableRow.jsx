import { useState, useEffect, useRef } from "react";
import { useDebouncedEffect } from "../../hooks/useDebouncedEffect";
import { updateItem, deleteItem } from "../../services/budget.api";

const EditableRow = ({ item, onDelete }) => {
  if (!item) return null;

  const [title, setTitle] = useState(item.title);
  const [actualCost, setActualCost] = useState(item.actualCost || 0);
  const [plannedCost, setPlannedCost] = useState(item.plannedCost || 0);

  const isFirstRender = useRef(true);

  /* Sync local state when backend data changes */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      setTitle(item.title);
      setActualCost(item.actualCost || 0);
      setPlannedCost(item.plannedCost || 0);
    }
  }, [item.id]);

  /* Autosave title */
  useDebouncedEffect(
    () => {
      if (title !== item.title) {
        updateItem(item.id, { title });
      }
    },
    [title],
    500
  );

  /* Autosave actual cost */
  useDebouncedEffect(
    () => {
      if (actualCost !== item.actualCost) {
        updateItem(item.id, { actualCost: Number(actualCost) });
      }
    },
    [actualCost],
    500
  );

  /* Autosave planned cost */
  useDebouncedEffect(
    () => {
      if (plannedCost !== item.plannedCost) {
        updateItem(item.id, { plannedCost: Number(plannedCost) });
      }
    },
    [plannedCost],
    500
  );

  const handleDelete = async () => {
    if (window.confirm(`Delete "${title}"?`)) {
      try {
        const response = await deleteItem(item.id);
        if (response.data.success) {
          onDelete(item.id);
        } else {
          alert("Failed to delete item");
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete item");
      }
    }
  };

  const isOverSpent =
    plannedCost > 0 && actualCost > plannedCost;

  return (
    <div className={`budget-row ${isOverSpent ? "overspent" : ""}`}>
      {/* Title */}
      <input
        className="title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Costs */}
      <div className="cost-inputs">
         <input
          className="actual-input"
          type="number"
          value={actualCost}
          onChange={(e) => setActualCost(e.target.value)}
        />
        
        

        <span className="cost-separator">/</span>

        <input
          className="planned-input"
          type="number"
          value={plannedCost}
          onChange={(e) => setPlannedCost(e.target.value)}
        />
       
      </div>

      {/* Delete Button */}
      <button className="delete-btn" onClick={handleDelete} title="Delete item">
        🗑️
      </button>
    </div>
  );
};

export default EditableRow;
