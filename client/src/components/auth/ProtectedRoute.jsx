import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('adminToken');

    // Si no hay token, redirige a la página de login.
    // El 'replace' evita que el usuario pueda volver atrás en el historial del navegador.
    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    // Si hay token, renderiza el componente hijo (la página que se quiere visitar).
    // Outlet es el marcador de posición para los componentes de las rutas anidadas.
    return <Outlet />;
};

export default ProtectedRoute;