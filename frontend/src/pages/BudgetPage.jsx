import { useEffect, useState } from "react";
import CategorySection from "../components/budget/CategorySection";
import { getOverview, addCategory } from "../services/budget.api";
import BudgetPieChart from "../components/budget/BudgetPieChart";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BudgetPage = () => {
  const [data, setData] = useState(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const fetchOverview = async () => {
    try {
      const res = await getOverview();
      setData(res.data.data);
    } catch (err) {
      console.error("Failed to load overview", err);
    }
  };



const downloadPDF = () => {
  const categories = data.categories;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Wedding Budget Report", 14, 20);

  let y = 30;

  categories.forEach((category) => {
    doc.setFontSize(13);
    doc.text(category.name, 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [["Item", "Planned Cost", "Actual Cost"]],
      body: category.items.map(item => [
        item.title,
        item.plannedCost,
        item.actualCost
      ]),
      theme: "grid"
    });

    y = doc.lastAutoTable.finalY + 10;
  });

  doc.save("wedding-budget.pdf");
};


  useEffect(() => {
    fetchOverview();
  }, []);

  const handleAddCategory = async () => {
    if (!categoryName.trim()) return;
    try {
      const response = await addCategory(categoryName.trim());
      if (response.data.success) {
        setCategoryName("");
        setShowCategoryDialog(false);
        await fetchOverview();
      } else {
        console.error("Failed to add category:", response.data.message);
        alert("Failed to add category");
      }
    } catch (err) {
      console.error("Add category error:", err);
      alert("Failed to add category: " + (err.response?.data?.message || err.message));
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <h1 className="page-title">Budget</h1>

      <BudgetPieChart categories={data.categories} />

      {data.categories.map((cat) => (
        <CategorySection
          key={cat.id}
          category={cat}
          refreshOverview={fetchOverview}
        />
      ))}

      <button className="add-category" onClick={() => setShowCategoryDialog(true)}>
        + Add category
      </button>

      <div className="budget-footer">
        <span>Actual total</span>
        <strong>₹ {data.overallTotal.toLocaleString()}</strong>
      </div>

      <div className="budget-actions">
        <button className="secondary" onClick={downloadPDF}>Download PDF</button>
        <button className="secondary">Download XLS</button>
      </div>

      {showCategoryDialog && (
        <div className="dialog-backdrop">
          <div className="dialog">
            <h3>Add category</h3>
            <input
              placeholder="Category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <div className="dialog-actions">
              <button onClick={() => setShowCategoryDialog(false)}>Cancel</button>
              <button onClick={handleAddCategory}>Add</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BudgetPage;
