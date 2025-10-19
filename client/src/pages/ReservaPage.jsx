import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './ReservaPage.css'; // <-- Importaremos los estilos

const ReservaPage = () => {
    // Obtenemos las nuevas funciones del contexto
    const { cartItems, removeItem, updateItemQuantity } = useContext(CartContext);

    const totalReserva = cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0);

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                <h1>Tu reserva está vacía</h1>
                <Link to="/" className="btn-primary">Ver productos</Link>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h1>Resumen de tu Reserva</h1>
            <div className="cart-items-list">
                {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                        <div className="cart-item-details">
                            <img src={item.imagen_url || 'https://via.placeholder.com/100'} alt={item.nombre} />
                            <div>
                                <h3>{item.nombre}</h3>
                                <p>${new Intl.NumberFormat('es-CL').format(item.precio)} c/u</p>
                            </div>
                        </div>
                        <div className="cart-item-actions">
                            <div className="quantity-control">
                                <button onClick={() => updateItemQuantity(item.id, item.cantidad - 1)}>-</button>
                                <span>{item.cantidad}</span>
                                <button onClick={() => updateItemQuantity(item.id, item.cantidad + 1)}>+</button>
                            </div>
                            <p className="cart-item-total">
                                ${new Intl.NumberFormat('es-CL').format(item.precio * item.cantidad)}
                            </p>
                            <button onClick={() => removeItem(item.id)} className="remove-button">
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <h2>Total: ${new Intl.NumberFormat('es-CL').format(totalReserva)}</h2>
                <Link to="/checkout" className='btn-primary'>
                    Ir a Pagar
                </Link>
            </div>
        </div>
    );
};

export default ReservaPage;