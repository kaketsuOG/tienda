import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { cartItems } = useContext(CartContext);
    const { user, logout } = useContext(AuthContext);

    // Calculamos el número total de ítems en el carrito (sumando las cantidades)
    const totalItems = cartItems.reduce((total, item) => total + item.cantidad, 0);

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">MiTienda</Link>
            <div className="nav-links">
                {user ? (
                    <>
                        <span className="nav-user">Hola, {user.nombre || user.email}</span>
                        <button onClick={logout} className="nav-button">Cerrar Sesión</button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" className="nav-button">Iniciar Sesión</NavLink>
                        <NavLink to="/registro" className="nav-button-primary">Registrarse</NavLink>
                    </>
                )}
                <Link to="/reserva" className="nav-cart-link">
                    🛒
                    {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;