import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import apiClient from '../services/apiClient';
import './AdminReservasPage.css'; // Crearemos este CSS

const AdminReservasPage = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReservas = async () => {
            const token = localStorage.getItem('adminToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            try {
                const response = await apiClient.get('/reservas', config);
                setReservas(response.data);
            } catch (err) {
                setError('No se pudieron cargar las reservas.');
            } finally {
                setLoading(false);
            }
        };
        fetchReservas();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('es-CL');
    };

    const handleRowClick = (id) => {
        navigate(`/admin/reservas/${id}`);
    };

    if (loading) return <p>Cargando reservas...</p>;

    return (
        <div className="admin-reservas-container">
            <div className="reservas-table-widget">
                <div className="widget-header">
                    <h2>Gestionar Reservas</h2>
                </div>
                <div className="widget-content">
                    {error && <p className="error-message">{error}</p>}
                    <table className="reservas-table">
                        <thead>
                            <tr>
                                <th>ID Reserva</th>
                                <th>Cliente</th>
                                <th>Email</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservas.map(reserva => (
                                <tr key={reserva.id} onClick={() => handleRowClick(reserva.id)} className="clickable-row">
                                    <td>{reserva.id}</td>
                                    <td>{reserva.nombre} {reserva.apellido}</td>
                                    <td>{reserva.email}</td>
                                    <td>{formatDate(reserva.fecha_reserva)}</td>
                                    <td>${new Intl.NumberFormat('es-CL').format(reserva.total_reserva)}</td>
                                    <td>
                                        <span className={`status-badge status-${reserva.estado.toLowerCase()}`}>
                                            {reserva.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminReservasPage;