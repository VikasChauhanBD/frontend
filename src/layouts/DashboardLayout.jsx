import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  Stethoscope,
  ShieldCheck,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./DashboardLayout.css";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-layout">
      <Navbar />

      <div className="dashboard-body">
        {/* Mobile / Tablet Toggle */}
        <button
          className={`dashboard-sidebar-toggle ${
            sidebarOpen ? "sidebar-toggle-open" : ""
          }`}
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="dashboard-sidebar-overlay"
            onClick={closeSidebar}
          ></div>
        )}

        {/* Sidebar */}
        <aside
          className={`dashboard-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
        >
          <h2>Dashboard</h2>

          <NavLink to="/dashboard/neet-pg" onClick={closeSidebar}>
            <Stethoscope size={18} />
            NEET PG
          </NavLink>

          <NavLink to="/dashboard/neet-ug" onClick={closeSidebar}>
            <GraduationCap size={18} />
            NEET UG
          </NavLink>

          <NavLink to="/dashboard/inicet" onClick={closeSidebar}>
            <BookOpen size={18} />
            INI-CET
          </NavLink>

          <NavLink to="/dashboard/neet-ss" onClick={closeSidebar}>
            <ShieldCheck size={18} />
            NEET SS
          </NavLink>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default DashboardLayout;
