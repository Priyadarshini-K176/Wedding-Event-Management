import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AppLayout from "./layout/AppLayout";

import Overview from "./pages/Overview";
import BudgetPage from "./pages/BudgetPage";
import Itinerary from "./pages/Itinerary";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Guests from "./pages/Guests";

function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC ROUTES (NO SIDEBAR) */}
        <Route path="/overview" element={<Overview />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED ROUTES (WITH SIDEBAR) */}
        <Route element={<AppLayout />}>
          
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/guests" element={<Guests/>} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
