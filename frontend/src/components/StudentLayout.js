import React from 'react';
import Sidebar from './Sidebar';
import '../styles/StudentLayout.css';

function StudentLayout({ children, user, setIsAuthenticated, setUser }) {
  return (
    <div className="student-layout">
      {/* Sidebar */}
      <Sidebar user={user} setIsAuthenticated={setIsAuthenticated} setUser={setUser} />

      {/* Main Content */}
      <main className="layout-main">
        <div className="layout-content">
          {children}
        </div>
      </main>
    </div>
  );
}

export default StudentLayout;
