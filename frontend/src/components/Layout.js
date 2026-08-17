import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import "../styles/Layout.css";

function Layout({ user, setIsAuthenticated, setUser }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="layout-container">
      {/* Fixed Sidebar - NEVER disappears */}
      <aside className={`sidebar-wrapper ${sidebarOpen ? "open" : "closed"}`}>
        <Sidebar 
          user={user}
          setIsAuthenticated={setIsAuthenticated}
          setUser={setUser}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Top Navbar */}
        <nav className="navbar-wrapper">
          <Navbar 
            user={user}
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </nav>

        {/* Page Content - Outlet renders here */}
        <main className="content-wrapper">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;