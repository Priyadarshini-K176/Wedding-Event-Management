import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";

import Overview from "./pages/Overview";
import BudgetPage from "./pages/BudgetPage";
import Itinerary from "./pages/Itinerary";
import Notes from "./pages/Notes";
import Guests from "./pages/Guests";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Navigate to="/overview" replace />} />


        {/* PUBLIC ROUTES (NO SIDEBAR) */}
        <Route path="/" element={<Overview />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED ROUTES WITH SIDEBAR (NO /app PREFIX) */}
        <Route element={<AppLayout />}>
          <Route path="/app" index element={<Dashboard />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
