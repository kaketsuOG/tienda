import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import './AuthPage.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/auth/register', formData);
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Error en el registro.');
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Crear Cuenta</h2>
                <input type="text" name="nombre" onChange={handleChange} placeholder="Nombre" required />
                <input type="email" name="email" onChange={handleChange} placeholder="Correo Electrónico" required />
                <input type="password" name="password" onChange={handleChange} placeholder="Contraseña" required />
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Registrarse</button>
                <p className="auth-switch">¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link></p>
            </form>
        </div>
    );
};

export default RegisterPage;