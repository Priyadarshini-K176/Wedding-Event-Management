import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
