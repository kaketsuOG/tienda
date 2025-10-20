// src/pages/AdminProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import ProductFormModal from '../components/admin/ProductFormModal'; // Importamos el modal
import './AdminProductsPage.css';

const AdminProductsPage = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Estados para controlar el modal ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

    // Función para obtener los productos del backend
    const fetchProductos = async () => {
        try {
            const response = await apiClient.get('/productos');
            setProductos(response.data);
        } catch (err) {
            setError('No se pudieron cargar los productos.');
        } finally {
            setLoading(false);
        }
    };

    // Obtenemos los productos al cargar la página
    useEffect(() => {
        fetchProductos();
    }, []);

    // Función para abrir el modal para un nuevo producto
    const handleAddNew = () => {
        setProductToEdit(null); // Nos aseguramos que no haya un producto a editar
        setIsModalOpen(true);
    };

    // Función para abrir el modal para editar un producto existente
    const handleEdit = (producto) => {
        setProductToEdit(producto);
        setIsModalOpen(true);
    };

    // Función para guardar (crear o actualizar) un producto
    const handleSave = async (productoData) => {
        const token = localStorage.getItem('adminToken');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        try {
            if (productToEdit) {
                // --- Lógica de Actualización (PUT) ---
                await apiClient.put(`/productos/${productToEdit.id}`, productoData, config);
            } else {
                // --- Lógica de Creación (POST) ---
                await apiClient.post('/productos', productoData, config);
            }
            setIsModalOpen(false); // Cierra el modal
            fetchProductos();     // Refresca la lista de productos
        } catch (err) {
            console.error('Error al guardar el producto:', err);
            setError('No se pudo guardar el producto.');
        }
    };

    // Función para eliminar un producto
    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            try {
                // --- Lógica de Eliminación (DELETE) ---
                await apiClient.delete(`/productos/${id}`, config);
                fetchProductos(); // Refresca la lista de productos
            } catch (err) {
                console.error('Error al eliminar el producto:', err);
                setError('No se pudo eliminar el producto.');
            }
        }
    };

    if (loading) return <p>Cargando productos...</p>;

    return (
        <div className="admin-products-container">
            {/* Si hay un error, lo mostramos */}
            {error && <p className="error-message">{error}</p>}
            
            <div className="admin-header">
                <h1>Gestionar Productos</h1>
                <button onClick={handleAddNew} className="btn-add">Agregar Nuevo Producto</button>
            </div>
            
            {/* ... (código de la tabla sin cambios) ... */}
            <table className="products-table">
                {/* ... thead ... */}
                <tbody>
                {productos.map(producto => (
                    <tr key={producto.id}>
                        <td>
                            <img 
                                src={producto.imagen_url || 'https://via.placeholder.com/70'} 
                                alt={producto.nombre} 
                                className="product-table-image"
                            />
                        </td>
                        <td>{producto.nombre}</td>
                        <td>${new Intl.NumberFormat('es-CL').format(producto.precio)}</td>
                        <td>{producto.stock}</td>
                        <td>
                            <button onClick={() => handleEdit(producto)} className="btn-edit">Editar</button>
                            <button onClick={() => handleDelete(producto.id)} className="btn-delete">Eliminar</button>
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
            
            <Link to="/admin/dashboard" className="back-link">← Volver al Dashboard</Link>

            {/* --- Renderizado condicional del modal --- */}
            {isModalOpen && (
                <ProductFormModal 
                    onClose={() => setIsModalOpen(false)} 
                    onSave={handleSave}
                    productToEdit={productToEdit}
                />
            )}
        </div>
    );
};

export default AdminProductsPage;