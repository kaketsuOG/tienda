import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import Slider from "react-slick";
import apiClient from '../services/apiClient';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/products/ProductCard';
import './ProductoDetailPage.css';

const ProductoDetailPage = () => {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [relacionados, setRelacionados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useContext(CartContext);
    
    // --- NUEVO ESTADO PARA LA PESTAÑA ACTIVA ---
    const [activeTab, setActiveTab] = useState('descripcion'); 
    // --- NUEVO ESTADO PARA LA IMAGEN SELECCIONADA (simulado) ---
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchProducto = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await apiClient.get(`/productos/${id}`);
                setProducto(response.data.producto);
                setRelacionados(response.data.relacionados);
                // Inicializa la imagen seleccionada con la imagen principal
                setSelectedImage(response.data.producto.imagen_url || 'https://via.placeholder.com/600x400'); 
            } catch (err) {
                setError('No se pudo encontrar el producto.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducto();
    }, [id]);

    const handleAddToCart = () => { 
        if (producto) {
        addToCart(producto);
        alert(`${producto.nombre} ha sido agregado a tu reserva!`); // Feedback para el usuario
        }
    
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!producto) return <p>Producto no disponible.</p>;

    const sliderSettings = {
        dots: false, // Oculta los puntos de navegación
        infinite: false, // No hace bucle al llegar al final
        speed: 500,
        slidesToShow: 4, // Muestra 4 productos a la vez
        slidesToScroll: 1,
        responsive: [ // Ajustes para pantallas más pequeñas
            {
                breakpoint: 1024,
                settings: { slidesToShow: 3 }
            },
            {
                breakpoint: 600,
                settings: { slidesToShow: 2 }
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 1 }
            }
        ]
    };

    // Simulamos una galería con la misma imagen
    const imageGallery = [
        producto.imagen_url || 'https://via.placeholder.com/100',
        producto.imagen_url || 'https://via.placeholder.com/100', // Repetimos para simular
        producto.imagen_url || 'https://via.placeholder.com/100'  // Repetimos para simular
    ];

    // Lógica de precios de oferta
    const enOferta = producto.precio_oferta && producto.precio_oferta < producto.precio;
    const precioActual = enOferta ? producto.precio_oferta : producto.precio;
    const precioAntiguo = enOferta ? producto.precio : null;

    return (
        <div className="product-detail-page">
            {/* --- SECCIÓN SUPERIOR: GALERÍA Y COMPRA --- */}
            <div className="product-main-section">
                {/* Columna Izquierda: Galería */}
                <div className="product-gallery">
                    <div className="main-image-container">
                        <img src={selectedImage} alt={producto.nombre} className="main-image" />
                    </div>
                    <div className="thumbnail-container">
                        {imageGallery.map((imgUrl, index) => (
                            <img 
                                key={index}
                                src={imgUrl} 
                                alt={`Thumbnail ${index + 1}`}
                                className={`thumbnail-image ${imgUrl === selectedImage ? 'active' : ''}`}
                                onClick={() => setSelectedImage(imgUrl)}
                            />
                        ))}
                    </div>
                </div>

                {/* Columna Derecha: Información y Compra */}
                <div className="product-purchase-info">
                    <span className="product-brand">Marca Ejemplo</span> {/* Placeholder */}
                    <h1>{producto.nombre}</h1>
                    {/* Aquí irían las estrellas/reviews si las tuviéramos */}
                    <div className="price-box">
                        {precioAntiguo && (
                            <span className="old-price-detail">
                                ${new Intl.NumberFormat('es-CL').format(precioAntiguo)}
                            </span>
                        )}
                        <span className="current-price-detail">
                            ${new Intl.NumberFormat('es-CL').format(precioActual)}
                        </span>
                        {enOferta && <span className="discount-tag">Oferta</span>}
                    </div>
                    <p className="stock-info">Stock disponible: {producto.stock} unidades</p>
                    <button onClick={handleAddToCart} className="add-to-cart-button-detail">
                        Agregar al Carrito
                    </button>
                    <Link to="/" className="back-link">← Volver a todos los productos</Link>
                </div>
            </div>

            {/* --- SECCIÓN INFERIOR: PESTAÑAS Y RELACIONADOS --- */}
            <div className="product-info-section">
                {/* Navegación de Pestañas */}
                <div className="tabs-nav">
                    <button 
                        className={`tab-button ${activeTab === 'descripcion' ? 'active' : ''}`}
                        onClick={() => setActiveTab('descripcion')}
                    >
                        Descripción
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'caracteristicas' ? 'active' : ''}`}
                        onClick={() => setActiveTab('caracteristicas')}
                    >
                        Características
                    </button>
                    {/* Añadir más botones aquí si tuvieras más datos */}
                </div>

                {/* Contenido de las Pestañas */}
                <div className="tab-content">
                    {activeTab === 'descripcion' && (
                        <div>
                            <h2>Descripción</h2>
                            <p>{producto.descripcion || 'No hay descripción disponible.'}</p>
                        </div>
                    )}
                    {activeTab === 'caracteristicas' && (
                        <div>
                            <h2>Características</h2>
                            {/* Datos de ejemplo, ya que no los tenemos */}
                            <ul>
                                <li><strong>Tipo:</strong> {producto.nombre}</li>
                                <li><strong>Categoría:</strong> (Necesitaríamos cargar el nombre)</li>
                                <li><strong>Origen:</strong> Chile (Ejemplo)</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* --- SECCIÓN PRODUCTOS RELACIONADOS --- */}
            {relacionados.length > 0 && (
                <div className="related-products-section">
                    <h2>También te podría interesar</h2>
                    {/* --- 3. REEMPLAZA ProductList CON Slider --- */}
                    <Slider {...sliderSettings}>
                        {relacionados.map(prodRelacionado => (
                            <div key={prodRelacionado.id} className="carousel-slide">
                                <ProductCard producto={prodRelacionado} />
                            </div>
                        ))}
                    </Slider>
                </div>
            )}
        </div>
    );
};

export default ProductoDetailPage;