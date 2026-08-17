import React from 'react';
import AdminSidebar from './AdminSidebar';
import '../styles/AdminLayout.css';

function AdminLayout({ children, user, setIsAuthenticated, setUser }) {
  return (
    <div className="admin-layout">
      <AdminSidebar user={user} setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
      <main className="admin-main-content">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
