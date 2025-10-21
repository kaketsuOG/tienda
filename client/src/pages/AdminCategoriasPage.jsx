import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import './AdminCategoriasPage.css'; // Usaremos el CSS actualizado

const AdminCategoriasPage = () => {
    const [categorias, setCategorias] = useState([]);
    const [nuevaCategoria, setNuevaCategoria] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategorias = async () => {
        // ... (la lógica de esta función no cambia)
        try {
            const response = await apiClient.get('/categorias');
            setCategorias(response.data);
        } catch (err) {
            setError('No se pudieron cargar las categorías.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nuevaCategoria.trim()) return;
        setError(null); // Limpiamos errores previos

        const token = localStorage.getItem('adminToken');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        try {
            await apiClient.post('/categorias', { nombre: nuevaCategoria }, config);
            setNuevaCategoria('');
            fetchCategorias();
        } catch (err) {
            setError('No se pudo crear la categoría. Es posible que ya exista.');
        }
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <div className="admin-categorias-container">
            <h1>Gestionar Categorías</h1>
            
            <div className="categorias-widget">
                <form onSubmit={handleSubmit} className="widget-header-form">
                    <h3>Agregar Nueva Categoría</h3>
                    <div className="form-row">
                        <input
                            type="text"
                            value={nuevaCategoria}
                            onChange={(e) => setNuevaCategoria(e.target.value)}
                            placeholder="Nombre de la categoría"
                            required
                        />
                        <button type="submit" className="btn-add">Agregar</button>
                    </div>
                </form>

                <div className="widget-content">
                    {error && <p className="error-message">{error}</p>}
                    <ul className="categorias-list">
                        {categorias.map(cat => (
                            <li key={cat.id}>
                                <span>{cat.nombre}</span>
                                {/* En el futuro, podríamos añadir botones de editar/eliminar aquí */}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminCategoriasPage;