// src/pages/AdminProductsPage.jsx
import React, { useState, useEffect } from 'react';

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
    const handleSave = async (productoData, imageFile) => {
        console.log('--- PASO 1: Inicia la función handleSave ---');

    const token = localStorage.getItem('adminToken');
    if (!token) {
        console.error('Error: No se encontró token de administrador.');
        setError("Sesión expirada. Por favor, inicia sesión de nuevo.");
        return;
    }
    console.log('--- PASO 2: Token encontrado ---');

    // Hacemos una copia de los datos del producto para poder modificarla de forma segura
    let finalProductData = { ...productoData };
    
    // Mantenemos el modal abierto mientras se procesa
    setIsModalOpen(true); 

    try {
        // --- PASO 3: Verifica si se seleccionó un archivo de imagen ---
        if (imageFile) {
            console.log('--- PASO 4: Se detectó un archivo de imagen. Intentando subir... ---', imageFile);
            
            const formData = new FormData();
            formData.append('image', imageFile);

            const configUpload = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            };

            const uploadResponse = await apiClient.post('/upload', formData, configUpload);
            
            console.log('--- PASO 5: Imagen subida con éxito. URL recibida: ---', uploadResponse.data.imageUrl);
            finalProductData.imagen_url = uploadResponse.data.imageUrl;
        } else {
            console.log('--- PASO 4: No se detectó un nuevo archivo de imagen. Saltando la subida. ---');
        }

        // --- PASO 6: Intentando guardar los datos del producto en la base de datos ---
        const configSave = { headers: { 'Authorization': `Bearer ${token}` } };

        if (productToEdit) {
            console.log('Actualizando producto existente con ID:', productToEdit.id);
            await apiClient.put(`/productos/${productToEdit.id}`, finalProductData, configSave);
        } else {
            console.log('Creando nuevo producto.');
            await apiClient.post('/productos', finalProductData, configSave);
        }

        console.log('--- PASO 7: Producto guardado con éxito. Cerrando modal y refrescando. ---');
        setIsModalOpen(false);
        fetchProductos();
        setProductToEdit(null);

    } catch (err) {
        console.error('Error al guardar el producto:', err);
        // Mostramos un error más específico si es posible
        const errorMsg = err.response?.data?.message || 'No se pudo guardar el producto.';
        setError(errorMsg);
        // No cerramos el modal si hay un error, para que el usuario pueda intentarlo de nuevo.
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