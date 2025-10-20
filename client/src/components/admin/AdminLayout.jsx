import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
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
                <a href="/admin/dashboard">Dashboard</a>
                <a href="/admin/productos">Productos</a>
                <a href="/admin/categorias">Categorías</a>
                {/* Agrega aquí futuros enlaces como "Reservas", "Clientes", etc. */}
            </nav>
            <button onClick={handleLogout} className="sidebar-logout">
                Cerrar Sesión
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