import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css'; // Importaremos los estilos en un momento

// Recibe un 'producto' como prop
const ProductCard = ({ producto }) => {
    // Un placeholder en caso de que un producto no tenga imagen
    const imageUrl = producto.imagen_url || 'https://via.placeholder.com/300x200';

    return (
        <div className="product-card">
            <img src={imageUrl} alt={producto.nombre} className="product-image" />
            <div className="product-info">
                <h3 className="product-name">{producto.nombre}</h3>
                <p className="product-price">${new Intl.NumberFormat('es-CL').format(producto.precio)}</p>
                <p className="product-stock">Stock: {producto.stock}</p>
            </div>
            <Link to={`/productos/${producto.id}`} className="product-button">
                Ver Detalles
            </Link>
        </div>
    );
};

export default ProductCard;