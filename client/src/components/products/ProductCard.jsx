import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import './ProductCard.css'; // Usaremos el CSS actualizado

const ProductCard = ({ producto }) => {
    const { addToCart } = useContext(CartContext);

    const imageUrl = producto.imagen_url || 'https://via.placeholder.com/300';
    
    const enOferta = producto.precio_oferta && producto.precio_oferta < producto.precio;
    const precioActual = enOferta ? producto.precio_oferta : producto.precio;
    const precioAntiguo = enOferta ? producto.precio : null;

    // Simulación del precio por unidad/kg (necesitaría datos reales)
    const precioPorUnidad = (precioActual / 1000).toFixed(1); // Ejemplo: $2.690 / 1000g -> $2.7 x kg

    const handleAddToCart = (e) => {
        e.preventDefault(); // Evita que el Link se active al hacer clic en el botón
        addToCart(producto);
    };

    return (
        <div className="product-card-jumbo">
            {/* Etiqueta de Oferta (si aplica) */}
            {enOferta && <div className="offer-tag-jumbo">Oferta</div>}

            <Link to={`/productos/${producto.id}`} className="product-image-link">
                <div className="product-image-container">
                    <img src={imageUrl} alt={producto.nombre} className="product-image" />
                </div>
            </Link>

            <div className="product-info-jumbo">
                {/* Marca (Placeholder) */}
                <span className="product-brand-jumbo">Marca Ejemplo</span> 
                
                <Link to={`/productos/${producto.id}`} className="product-name-link">
                    <h3 className="product-name">{producto.nombre}</h3>
                </Link>

                {/* Sección de Precios */}
                <div className="price-section-jumbo">
                    {precioAntiguo && (
                        <span className="old-price-jumbo">
                            ${new Intl.NumberFormat('es-CL').format(precioAntiguo)}
                        </span>
                    )}
                    <span className="current-price-jumbo">
                        ${new Intl.NumberFormat('es-CL').format(precioActual)}
                    </span>
                    <span className="unit-price-jumbo">
                        ${new Intl.NumberFormat('es-CL').format(precioPorUnidad)} x kg {/* O por unidad */}
                    </span>
                </div>
                
                {/* Botón de Agregar */}
                <button onClick={handleAddToCart} className="product-button-add-jumbo">
                    Agregar
                </button>
            </div>
        </div>
    );
};

export default ProductCard;