import React from 'react';
import ProductCard from './ProductCard';
import './ProductList.css'; // Estilos para la cuadrícula

const ProductList = ({ productos }) => {
    return (
        <div className="product-list">
            {productos.map(producto => (
                <ProductCard key={producto.id} producto={producto} />
            ))}
        </div>
    );
};

export default ProductList;