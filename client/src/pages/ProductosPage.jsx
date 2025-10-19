import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import ProductList from '../components/products/ProductList'; // Importamos ProductList

const ProductosPage = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await apiClient.get('/productos');
                setProductos(response.data);
            } catch (err) {
                setError('No se pudieron cargar los productos.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProductos();
    }, []);

    if (loading) return <p style={{textAlign: 'center', marginTop: '20px'}}>Cargando productos...</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</p>;

    return (
        <div>
            <h1 style={{textAlign: 'center', margin: '20px 0'}}>Nuestros Productos</h1>
            {productos.length === 0 ? (
                <p>No hay productos disponibles.</p>
            ) : (
                // Renderizamos el componente ProductList y le pasamos los productos
                <ProductList productos={productos} />
            )}
        </div>
    );
};

export default ProductosPage;