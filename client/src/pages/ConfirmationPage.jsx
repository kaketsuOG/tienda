import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './ConfirmationPage.css';

const ConfirmationPage = () => {
    const location = useLocation();
    const { reservaId } = location.state || {}; // Obtenemos el ID de la reserva

    return (
        <div className="confirmation-container">
            <h2>¡Gracias por tu reserva!</h2>
            <p>Tu orden ha sido procesada exitosamente.</p>
            {reservaId && <p>Tu número de reserva es: <strong>{reservaId}</strong></p>}
            <Link to="/" className="btn-primary">
                Seguir comprando
            </Link>
        </div>
    );
};

export default ConfirmationPage;