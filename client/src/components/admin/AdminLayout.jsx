import React from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaBoxOpen, FaTags, FaSignOutAlt, 
    FaChartBar, FaUsers, FaShoppingCart } from 'react-icons/fa';
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
            </div>
            <nav className="sidebar-nav">
                <span className="nav-section-title">Principal</span>
                <NavLink to="/admin/dashboard">
                    <FaTachometerAlt /> <span>Dashboard</span>
                </NavLink>

                <span className="nav-section-title">Gestión</span>
                <NavLink to="/admin/productos">
                    <FaBoxOpen /> <span>Productos</span>
                </NavLink>
                <NavLink to="/admin/categorias">
                    <FaTags /> <span>Categorías</span>
                </NavLink>
                <NavLink to="/admin/reservas"> {/* Placeholder para el futuro */}
                    <FaShoppingCart /> <span>Reservas</span>
                </NavLink>
                <NavLink to="/admin/clientes"> {/* Placeholder para el futuro */}
                    <FaUsers /> <span>Clientes</span>
                </NavLink>

                <span className="nav-section-title">Análisis</span>
                <NavLink to="/admin/reportes"> {/* Placeholder para el futuro */}
                    <FaChartBar /> <span>Reportes</span>
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