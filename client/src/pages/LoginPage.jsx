import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import './AuthPage.css'; // Usaremos un CSS compartido

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            login(response.data.token);
            navigate('/'); // Redirige a la página principal
        } catch (err) {
            setError('Email o contraseña incorrectos.');
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Iniciar Sesión</h2>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo Electrónico" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Ingresar</button>
                <p className="auth-switch">¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
            </form>
        </div>
    );
};

export default LoginPage;