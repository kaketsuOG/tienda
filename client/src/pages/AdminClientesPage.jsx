import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
// Usaremos los mismos estilos de la tabla de reservas para ser consistentes
import './AdminReservasPage.css'; 

const AdminClientesPage = () => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClientes = async () => {
            const token = localStorage.getItem('adminToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            try {
                const response = await apiClient.get('/clientes', config);
                setClientes(response.data);
            } catch (err) {
                setError('No se pudieron cargar los clientes.');
            } finally {
                setLoading(false);
            }
        };
        fetchClientes();
    }, []);

    if (loading) return <p>Cargando clientes...</p>;

    return (
        <div className="admin-reservas-container"> {/* Reutilizamos la clase contenedora */}
            <div className="reservas-table-widget"> {/* Reutilizamos el widget */}
                <div className="widget-header">
                    <h2>Gestionar Clientes</h2>
                </div>
                <div className="widget-content">
                    {error && <p className="error-message">{error}</p>}
                    <table className="reservas-table"> {/* Reutilizamos la clase de la tabla */}
                        <thead>
                            <tr>
                                <th>ID Cliente</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map(cliente => (
                                <tr key={cliente.id}>
                                    <td>{cliente.id}</td>
                                    <td>{cliente.nombre} {cliente.apellido}</td>
                                    <td>{cliente.email}</td>
                                    <td>{cliente.telefono || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminClientesPage;