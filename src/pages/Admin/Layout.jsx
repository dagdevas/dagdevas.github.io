import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  return (
    <div className="admin">
      <div className="container" style={{ padding: '24px 0' }}>
        <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Админ-панель</h2>
          <div>
            <span style={{ marginRight: 12 }}>{user?.email}</span>
            <button className="btn" onClick={logout}>Выйти</button>
          </div>
        </div>
        <nav className="admin-nav" style={{ display: 'flex', gap: 12, margin: '16px 0' }}>
          <NavLink to="/admin/news">Новости</NavLink>
          <NavLink to="/admin/products">Продукция</NavLink>
          <NavLink to="/admin/certifications">Сертификация</NavLink>
        </nav>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;



