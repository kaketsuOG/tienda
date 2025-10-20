import React from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaBoxOpen, FaTags, FaSignOutAlt } from 'react-icons/fa';
import './AdminLayout.css';

// Componente para la barra lateral de navegación
const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <h3>MiTienda</h3>
                <span>Admin</span>
            </div>
            <nav className="sidebar-nav">
                {/* Usamos NavLink para que el estilo activo se aplique automáticamente */}
                <NavLink to="/admin/dashboard">
                    <FaTachometerAlt /> <span>Dashboard</span>
                </NavLink>
                <NavLink to="/admin/productos">
                    <FaBoxOpen /> <span>Productos</span>
                </NavLink>
                <NavLink to="/admin/categorias">
                    <FaTags /> <span>Categorías</span>
                </NavLink>
            </nav>
            <button onClick={handleLogout} className="sidebar-logout">
                <FaSignOutAlt /> <span>Cerrar Sesión</span>
            </button>
        </aside>
    );
};

// Componente principal del Layout
const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <AdminSidebar />
            <main className="admin-main-content">
                <Outlet /> {/* Aquí es donde se renderizarán las páginas hijas */}
            </main>
        </div>
    );
};

export default AdminLayout;