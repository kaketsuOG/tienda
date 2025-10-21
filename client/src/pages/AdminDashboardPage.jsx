import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { FaBoxOpen, FaTags, FaUsers, FaShoppingCart } from 'react-icons/fa';
import ReservasChart from '../components/admin/charts/ReservasChart';
import './AdminDashboardPage.css';

// Nuevo componente para las tarjetas de estadísticas, basado en la plantilla
const StatBox = ({ icon, title, value, color }) => (
    <div className="stat-box" style={{ backgroundColor: color }}>
        <div className="stat-box-icon">
            {icon}
        </div>
        <div className="stat-box-content">
            <h3>{value}</h3>
            <p>{title}</p>
        </div>
    </div>
);

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('adminToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            try {
                const response = await apiClient.get('/admin/stats', config);
                setStats(response.data);
            } catch (error) {
                console.error("Error al cargar estadísticas", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <p>Cargando dashboard...</p>;

    return (
        <div className="dashboard-container">
            {/* Cabecera del Dashboard, como en la plantilla */}
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Bienvenido a tu panel de control.</p>
            </div>

            <div className="stats-grid">
                {/* Usamos los nuevos StatBox con los colores de la plantilla */}
                <StatBox icon={<FaBoxOpen />} title="Total Productos" value={stats?.productos ?? 0} color="#00c0ef" />
                <StatBox icon={<FaTags />} title="Total Categorías" value={stats?.categorias ?? 0} color="#00a65a" />
                <StatBox icon={<FaUsers />} title="Total Clientes" value={stats?.clientes ?? 0} color="#3b82f6" />
                <StatBox icon={<FaShoppingCart />} title="Total Reservas" value={stats?.reservas ?? 0} color="#f56954" />
            </div>

            {/* Aquí es donde, en futuros pasos, agregaremos los gráficos */}
            <div className="chart-widget">
                <div className="widget-header">
                    <h2>Reservas (Últimos 7 días)</h2>
                </div>
                <div className="widget-content">
                    <ReservasChart />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;