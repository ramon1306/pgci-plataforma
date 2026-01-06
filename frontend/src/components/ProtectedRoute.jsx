import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Verificamos si existe el token en el localStorage
    const token = localStorage.getItem('auth_token');

    // Si no hay token, redirigimos al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si hay token, permitimos el acceso a la ruta solicitada (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;