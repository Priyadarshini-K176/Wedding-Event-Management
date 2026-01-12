import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BudgetPage from "../src/pages/BudgetPage";
import Itinerary from "../src/pages/Itinerary";
import AppLayout from "../src/layout/AppLayout";
import Notes from "../src/pages/Notes";

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/notes" element={<Notes />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
