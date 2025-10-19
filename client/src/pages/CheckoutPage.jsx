import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import apiClient from '../services/apiClient';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const { cartItems, clearCart } = useContext(CartContext);
    const [cliente, setCliente] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: ''
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCliente(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            let clienteResponse = await apiClient.post('/clientes', cliente);
            const clienteId = clienteResponse.data.id;

            const reservaData = {
                cliente_id: clienteId,
                productos: cartItems.map(item => ({ id: item.id, cantidad: item.cantidad }))
            };
            
            const reservaResponse = await apiClient.post('/reservas', reservaData);
            
            clearCart();
            navigate('/confirmacion', { state: { reservaId: reservaResponse.data.reserva_id } });

        } catch (err) {
            console.error('Error al finalizar la reserva:', err);
            // Capturamos el error de email duplicado del backend
            if (err.response && err.response.data.message === 'El email ya está registrado.') {
                 setError('El email ya está registrado. Por favor, utiliza otro.');
            } else {
                 setError(err.message || 'Ocurrió un error. Por favor, intenta de nuevo.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const totalReserva = cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0);

    return (
        <div className="checkout-container">
            <div className="checkout-form-section">
                <h2>Datos del Cliente</h2>
                {/* 👇 ESTA ES LA PARTE QUE PROBABLEMENTE FALTA */}
                <form onSubmit={handleSubmit} className="checkout-form">
                    <input type="text" name="nombre" placeholder="Nombre" onChange={handleInputChange} required />
                    <input type="text" name="apellido" placeholder="Apellido" onChange={handleInputChange} />
                    <input type="email" name="email" placeholder="Email" onChange={handleInputChange} required />
                    <input type="tel" name="telefono" placeholder="Teléfono" onChange={handleInputChange} />
                    <textarea name="direccion" placeholder="Dirección" onChange={handleInputChange}></textarea>
                    
                    <button type="submit" className="btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Procesando...' : 'Finalizar Reserva'}
                    </button>
                    {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                </form>
            </div>

            <div className="checkout-summary-section">
                <h2>Resumen de la Reserva</h2>
                {/* 👇 Y ESTA OTRA PARTE TAMBIÉN */}
                {cartItems.map(item => (
                    <div key={item.id} className="summary-item">
                        <span>{item.nombre} (x{item.cantidad})</span>
                        <span>${new Intl.NumberFormat('es-CL').format(item.precio * item.cantidad)}</span>
                    </div>
                ))}
                <hr />
                <div className="summary-total">
                    <strong>Total</strong>
                    <strong>${new Intl.NumberFormat('es-CL').format(totalReserva)}</strong>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;