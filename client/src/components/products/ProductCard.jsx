// src/components/products/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ producto }) => {
    const imageUrl = producto.imagen_url || 'https://via.placeholder.com/300';

    return (
        <div className="product-card">
            {/* Nuevo contenedor para la imagen */}
            <div className="product-image-container">
                <img src={imageUrl} alt={producto.nombre} className="product-image" />
            </div>

            <div className="product-info">
                <h3 className="product-name">{producto.nombre}</h3>
                <p className="product-price">${new Intl.NumberFormat('es-CL').format(producto.precio)}</p>
                <p className="product-stock">Quedan: {producto.stock} unidades</p>
                
                <Link to={`/productos/${producto.id}`} className="product-button">
                    Ver Detalles
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;