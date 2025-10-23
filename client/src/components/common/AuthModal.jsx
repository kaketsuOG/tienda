import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import apiClient from '../../services/apiClient';
import './AuthModal.css'; // Crearemos este CSS
import { FaTimes } from 'react-icons/fa'; // Icono para cerrar

// --- Componente interno para el Login ---
const LoginForm = ({ switchToRegister, closeAuthModal }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            login(response.data.token);
            // closeAuthModal() se llama automáticamente desde el context
        } catch (err) {
            setError('Email o contraseña incorrectos.');
        }
    };

    return (
        <div className="auth-modal-content">
            <h3>Inicia sesión</h3>
            <p>Disfruta de lo mejor de tu tienda.</p>
            <button className="google-btn">Continuar con Google</button>
            <span className="form-divider">O inicia con tu correo</span>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ingresa tu correo electrónico" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Ingresa tu contraseña" required />
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="submit-btn">Iniciar Sesión</button>
            </form>
            <p className="auth-switch">¿No tienes cuenta? <span onClick={switchToRegister}>Crear cuenta</span></p>
        </div>
    );
};

// --- Componente interno para el Registro ---
const RegisterForm = ({ switchToLogin }) => {
    const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/auth/register', formData);
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            switchToLogin(); // Cambia a la vista de login
        } catch (err) {
            setError(err.response?.data?.message || 'Error en el registro.');
        }
    };

    return (
        <div className="auth-modal-content">
            <h3>Crea tu cuenta</h3>
            <p>Es rápido y fácil.</p>
            <form onSubmit={handleSubmit}>
                <input type="text" name="nombre" onChange={handleChange} placeholder="Nombre" required />
                <input type="email" name="email" onChange={handleChange} placeholder="Correo Electrónico" required />
                <input type="password" name="password" onChange={handleChange} placeholder="Contraseña (mín. 6 caracteres)" required />
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="submit-btn">Registrarse</button>
            </form>
            <p className="auth-switch">¿Ya tienes cuenta? <span onClick={switchToLogin}>Iniciar Sesión</span></p>
        </div>
    );
};

// --- Componente Principal del Modal ---
const AuthModal = () => {
    const { isModalOpen, modalView, closeAuthModal, switchToRegister, switchToLogin } = useContext(AuthContext);

    if (!isModalOpen) return null;

    return (
        <div className="auth-modal-backdrop" onClick={closeAuthModal}>
            <div className="auth-modal-container" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={closeAuthModal}><FaTimes /></button>
                {modalView === 'login' ? (
                    <LoginForm switchToRegister={switchToRegister} closeAuthModal={closeAuthModal} />
                ) : (
                    <RegisterForm switchToLogin={switchToLogin} />
                )}
            </div>
        </div>
    );
};

export default AuthModal;