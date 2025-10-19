import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const { cartItems } = useContext(CartContext);

    // Calculamos el número total de ítems en el carrito (sumando las cantidades)
    const totalItems = cartItems.reduce((total, item) => total + item.cantidad, 0);

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">MiTienda</Link>
            <Link to="/reserva" className="nav-cart-link">
                🛒
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>
        </nav>
    );
};

export default Navbar;