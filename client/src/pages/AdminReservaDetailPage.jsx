import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import './AdminReservaDetailPage.css'; // Crearemos este CSS

const AdminReservaDetailPage = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nuevoEstado, setNuevoEstado] = useState('');

    const fetchDetalles = useCallback(async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('adminToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            const response = await apiClient.get(`/reservas/${id}`, config);
            setData(response.data);
            setNuevoEstado(response.data.reserva.estado);
        } catch (err) {
            setError('No se pudieron cargar los detalles de la reserva.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDetalles();
    }, [fetchDetalles]);

    const handleStatusChange = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            await apiClient.put(`/reservas/${id}/status`, { estado: nuevoEstado }, config);
            // Recargamos los datos para mostrar el estado actualizado
            fetchDetalles();
            alert('Estado actualizado con éxito');
        } catch (err) {
            alert('Error al actualizar el estado');
        }
    };

    if (loading) return <p>Cargando detalles...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!data) return null;

    const { reserva, detalles } = data;

    return (
        <div className="reserva-detail-container">
            <Link to="/admin/reservas" className="back-link">← Volver a todas las reservas</Link>
            
            <div className="reserva-grid">
                {/* Columna 1: Detalles del Pedido y Cliente */}
                <div className="reserva-info-widget">
                    <h3>Reserva #{reserva.id}</h3>
                    <p><strong>Fecha:</strong> {new Date(reserva.fecha_reserva).toLocaleString('es-CL')}</p>
                    <p><strong>Total:</strong> ${new Intl.NumberFormat('es-CL').format(reserva.total_reserva)}</p>

                    <hr />
                    
                    <h4>Datos del Cliente</h4>
                    <p><strong>Nombre:</strong> {reserva.nombre} {reserva.apellido}</p>
                    <p><strong>Email:</strong> {reserva.email}</p>
                    <p><strong>Teléfono:</strong> {reserva.telefono}</p>

                    <hr />

                    <h4>Actualizar Estado</h4>
                    <form onSubmit={handleStatusChange} className="status-form">
                        <select value={nuevoEstado} onChange={(e) => setNuevoEstado(e.target.value)}>
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="CONFIRMADA">Confirmada</option>
                            <option value="ENTREGADO">Entregado</option>
                            <option value="CANCELADA">Cancelada</option>
                        </select>
                        <button type="submit" className="btn-save">Actualizar</button>
                    </form>
                </div>

                {/* Columna 2: Productos Pedidos */}
                <div className="reserva-items-widget">
                    <h3>Productos en la Reserva</h3>
                    <ul className="items-list">
                        {detalles.map((item, index) => (
                            <li key={index} className="item-card">
                                <img src={item.imagen_url || 'https://via.placeholder.com/70'} alt={item.nombre} />
                                <div className="item-info">
                                    <span className="item-name">{item.nombre}</span>
                                    <span>{item.cantidad_reservada} x ${new Intl.NumberFormat('es-CL').format(item.precio_unitario)}</span>
                                </div>
                                <span className="item-total">
                                    ${new Intl.NumberFormat('es-CL').format(item.cantidad_reservada * item.precio_unitario)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminReservaDetailPage;