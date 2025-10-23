import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
// Usaremos iconos más específicos
import { FaSearch, FaRegUserCircle, FaShoppingCart } from 'react-icons/fa'; 
import './Navbar.css';

const Navbar = () => {
    const { cartItems } = useContext(CartContext);
    const { user, logout, openAuthModal } = useContext(AuthContext);

    const totalItems = cartItems.reduce((total, item) => total + item.cantidad, 0);

    return (
        <nav className="navbar-redesign">
            <div className="nav-content">
                <Link to="/" className="nav-brand">
                    MiTienda
                </Link>

                <div className="nav-search">
                    <input type="text" placeholder="¿Qué estás buscando?" />
                    <button className="search-button">
                        <FaSearch />
                    </button>
                </div>

                <div className="nav-actions">
                    {/* Botón de Login/Usuario con nuevo icono */}
                    <div className="nav-user-action">
                        <FaRegUserCircle className="user-icon" /> 
                        {user ? (
                            <div className="user-info">
                                <span>Hola, {user.nombre || user.email.split('@')[0]}</span>
                                <button onClick={logout} className="logout-link">Cerrar Sesión</button>
                            </div>
                        ) : (
                            <div className="user-info">
                                <span>Hola, inicia sesión</span>
                                {/* Usamos un div clickeable en lugar de botón para mejor estilo */}
                                <div onClick={() => openAuthModal('login')} className="login-link"> 
                                    Ingresa / Regístrate
                                </div>
                            </div>
                        )}
                        {/* Podríamos añadir un pequeño dropdown aquí en el futuro */}
                    </div>

                    <Link to="/reserva" className="nav-cart-link">
                        <FaShoppingCart className="cart-icon" />
                        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;