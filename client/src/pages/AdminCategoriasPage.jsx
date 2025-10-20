import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import './AdminCategoriasPage.css'; // Crearemos este archivo de estilos

const AdminCategoriasPage = () => {
    const [categorias, setCategorias] = useState([]);
    const [nuevaCategoria, setNuevaCategoria] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategorias = async () => {
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

        const token = localStorage.getItem('adminToken');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        try {
            await apiClient.post('/categorias', { nombre: nuevaCategoria }, config);
            setNuevaCategoria(''); // Limpiamos el input
            fetchCategorias();     // Recargamos la lista de categorías
        } catch (err) {
            setError('No se pudo crear la categoría. Es posible que ya exista.');
        }
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <div className="admin-categorias-container">
            <div className="categorias-header">
                <h1>Gestionar Categorías</h1>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="categorias-content">
                <div className="categorias-list">
                    <h3>Categorías Existentes</h3>
                    <ul>
                        {categorias.map(cat => (
                            <li key={cat.id}>
                                {cat.nombre}
                                {/* Aquí irían los botones de editar/eliminar en el futuro */}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="categorias-form">
                    <h3>Agregar Nueva Categoría</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={nuevaCategoria}
                            onChange={(e) => setNuevaCategoria(e.target.value)}
                            placeholder="Nombre de la categoría"
                            required
                        />
                        <button type="submit">Agregar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminCategoriasPage;