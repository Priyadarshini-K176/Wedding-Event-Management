import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h4 className="sidebar-title">Planning Tools</h4>

      <nav className="sidebar-nav">
        <NavLink to="/app">Dashboard</NavLink>
        <NavLink to="/guests">Guest List</NavLink>
        <NavLink to="/budget">Budget</NavLink>
        <NavLink to="/itinerary">Itinerary</NavLink>
        <NavLink to="/notes">Notes</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
