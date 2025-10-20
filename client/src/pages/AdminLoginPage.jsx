import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import './AdminLoginPage.css';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await apiClient.post('/admin/login', { email, password });

            // Guardamos el token en el localStorage del navegador
            localStorage.setItem('adminToken', response.data.token);

            // Aquí redirigiremos al panel de admin
            alert('¡Inicio de sesión exitoso!');
            navigate('/admin/dashboard');
            // window.location.href = '/admin/dashboard'; // Redirección simple por ahora

        } catch (err) {
            setError('Credenciales inválidas. Por favor, intenta de nuevo.');
            console.error(err);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Panel de Administrador</h2>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Iniciar Sesión</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default AdminLoginPage;