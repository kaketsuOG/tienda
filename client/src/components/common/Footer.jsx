import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section about">
                    <h3 className="footer-brand">MiTienda</h3>
                    <p>
                        Ofreciendo los mejores productos con el mejor servicio. 
                        Tu tienda de confianza en Requinoa.
                    </p>
                </div>
                <div className="footer-section links">
                    <h4>Navegación</h4>
                    <ul>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/#productos">Productos</Link></li>
                        <li><Link to="/registro">Registrarse</Link></li>
                    </ul>
                </div>
                <div className="footer-section contact">
                    <h4>Contacto</h4>
                    <p>📧 email@mitienda.com</p>
                    <p>📞 +56 9 1234 5678</p>
                    <p>📍 Requinoa, Chile</p>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} MiTienda | Todos los derechos reservados.
            </div>
        </footer>
    );
};

export default Footer;