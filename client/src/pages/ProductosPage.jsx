import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import ProductList from '../components/products/ProductList';
import './ProductosPage.css'; // Crearemos este archivo para los estilos de los filtros

const ProductosPage = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null); // Estado para la categoría seleccionada
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect para cargar las categorías una sola vez
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await apiClient.get('/categorias');
                setCategorias(response.data);
            } catch (err) {
                console.error('No se pudieron cargar las categorías', err);
            }
        };
        fetchCategorias();
    }, []);

    // useEffect para cargar los productos. Se ejecutará cada vez que cambie la categoría seleccionada
    useEffect(() => {
        const fetchProductos = async () => {
            setLoading(true); // Mostramos el loader al cambiar de categoría
            try {
                // Construimos la URL: si hay una categoría seleccionada, la añadimos como parámetro
                const url = selectedCategory ? `/productos?categoria=${selectedCategory}` : '/productos';
                const response = await apiClient.get(url);
                setProductos(response.data);
            } catch (err) {
                setError('No se pudieron cargar los productos.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProductos();
    }, [selectedCategory]); // El hook depende de 'selectedCategory'

    if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

    return (
        <div>
            <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Nuestros Productos</h1>

            {/* --- FILTROS DE CATEGORÍA --- */}
            <div className="category-filters">
                <button 
                    onClick={() => setSelectedCategory(null)}
                    className={!selectedCategory ? 'active' : ''}
                >
                    Todos
                </button>
                {categorias.map(cat => (
                    <button 
                        key={cat.id} 
                        onClick={() => setSelectedCategory(cat.id)}
                        className={selectedCategory === cat.id ? 'active' : ''}
                    >
                        {cat.nombre}
                    </button>
                ))}
            </div>

            {/* --- LISTA DE PRODUCTOS --- */}
            {loading ? (
                <p style={{ textAlign: 'center' }}>Cargando productos...</p>
            ) : productos.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No hay productos disponibles en esta categoría.</p>
            ) : (
                <ProductList productos={productos} />
            )}
        </div>
    );
};

export default ProductosPage;