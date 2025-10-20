// src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { FaBoxOpen, FaTags, FaUsers, FaShoppingCart } from 'react-icons/fa';
import './AdminDashboardPage.css';

const StatCard = ({ icon, title, value, color }) => (
    <div className="stat-card" style={{ borderLeftColor: color }}>
        <div className="stat-card-icon">{icon}</div>
        <div className="stat-card-info">
            <p>{title}</p>
            <span>{value}</span>
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
            <h1>Dashboard</h1>
            <div className="stats-grid">
                <StatCard icon={<FaBoxOpen />} title="Total Productos" value={stats?.productos ?? 0} color="#3498db" />
                <StatCard icon={<FaTags />} title="Total Categorías" value={stats?.categorias ?? 0} color="#2ecc71" />
                <StatCard icon={<FaUsers />} title="Total Clientes" value={stats?.clientes ?? 0} color="#e67e22" />
                <StatCard icon={<FaShoppingCart />} title="Total Reservas" value={stats?.reservas ?? 0} color="#9b59b6" />
            </div>
        </div>
    );
};

export default AdminDashboardPage;