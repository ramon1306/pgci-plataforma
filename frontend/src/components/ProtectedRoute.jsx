import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ adminOnly = false }) => {
    const token = sessionStorage.getItem('auth_token');
    const isStaff = sessionStorage.getItem('is_staff') === 'true';

    // 1. Si no hay token, fuera al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. Si la ruta requiere admin y el usuario no lo es, al select-company
    if (adminOnly && !isStaff) {
        return <Navigate to="/select-company" replace />;
    }

    // 3. Si todo está bien, renderiza las rutas hijas
    return <Outlet />;
};

export default ProtectedRoute;