import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom'; // useParams para leer el ID de la URL
import apiClient from '../services/apiClient';
import { CartContext } from '../context/CartContext';
import ProductList from '../components/products/ProductList';
import './ProductoDetailPage.css'; // Estilos para la página

const ProductoDetailPage = () => {
    const { id } = useParams(); // Obtiene el parámetro 'id' de la URL (ej: /productos/1)
    const [producto, setProducto] = useState(null);
    const [relacionados, setRelacionados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProducto = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await apiClient.get(`/productos/${id}`);
                setProducto(response.data.producto);
                setRelacionados(response.data.relacionados);
            } catch (err) {
                setError('No se pudo encontrar el producto.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducto();
    }, [id]); // Se ejecuta cada vez que el 'id' de la URL cambie

    const handleAddToCart = () => {
        if (producto) {
            addToCart(producto);
            alert(`${producto.nombre} ha sido agregado a tu reserva!`); // Feedback para el usuario
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!producto) return <p>Producto no disponible.</p>;

    const imageUrl = producto.imagen_url || 'https://via.placeholder.com/600x400';

    return (
        <div className="product-detail-container">
            <div className="product-detail-card">
                <div className="product-detail-image-container">
                     <img src={imageUrl} alt={producto.nombre} className="product-detail-image" />
                </div>
                <div className="product-detail-info">
                    <h1 className="product-detail-name">{producto.nombre}</h1>
                    <p className="product-detail-description">{producto.descripcion}</p>
                    <p className="product-detail-stock">Stock disponible: {producto.stock} unidades</p>
                    <p className="product-detail-price">${new Intl.NumberFormat('es-CL').format(producto.precio)}</p>
                    <button onClick={handleAddToCart} className="add-to-cart-button">
                        Agregar a la Reserva
                    </button>
                    <Link to="/" className="back-link">← Volver a todos los productos</Link>
                </div>
            </div>
                <div className="related-products-section">
                    <h2>También te podría interesar</h2>
                    <ProductList productos={relacionados} />
                </div>
        </div>
    );
};

export default ProductoDetailPage;