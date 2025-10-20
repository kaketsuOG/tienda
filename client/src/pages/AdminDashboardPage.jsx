import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Panel de Administrador</h1>
            <nav>
                <Link to="/admin/productos">Gestionar Productos</Link>
                {/* Aquí irían otros enlaces como "Ver Reservas", etc. */}
            </nav>
            <button 
                onClick={handleLogout} 
                style={{ marginTop: '30px', backgroundColor: '#e74c3c', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
                Cerrar Sesión
            </button>
        </div>
    );
};

export default AdminDashboardPage;