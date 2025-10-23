import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('userToken'));
    
    // --- NUEVO ESTADO PARA EL MODAL ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalView, setModalView] = useState('login'); // 'login' o 'register'

    useEffect(() => {
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setUser(decodedUser);
            } catch (error) {
                console.error("Token inválido", error);
                logout();
            }
        }
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('userToken', newToken);
        setToken(newToken);
        closeAuthModal(); // Cierra el modal al iniciar sesión
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        setToken(null);
        setUser(null);
    };

    // --- NUEVAS FUNCIONES PARA CONTROLAR EL MODAL ---
    const openAuthModal = (view = 'login') => {
        setModalView(view);
        setIsModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsModalOpen(false);
    };

    const switchToRegister = () => setModalView('register');
    const switchToLogin = () => setModalView('login');

    const value = {
        user,
        token,
        login,
        logout,
        // Exportamos las nuevas funciones y estados
        isModalOpen,
        modalView,
        openAuthModal,
        closeAuthModal,
        switchToRegister,
        switchToLogin
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};