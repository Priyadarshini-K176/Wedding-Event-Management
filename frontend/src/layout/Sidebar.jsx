import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/me/permissions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success && data.data.role === 'OWNER') {
        setIsOwner(true);
      }
    } catch (err) {
      console.error('Failed to check role:', err);
    }
  };

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
        {isOwner && <NavLink to="/share-wedding">Share Wedding</NavLink>}
      </nav>
    </aside>
  );
};

export default Sidebar;
