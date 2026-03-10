import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SelectCompanyPage from './pages/SelectCompanyPage';
import DashboardPage from './pages/DashboardPage';
import AdminPanel from './pages/AdminPanel';

// Componentes
import ProtectedRoute from './components/ProtectedRoute'; // El que acabamos de crear
import Layout from './components/Layout/Layout';

function App() {
    return (
        <Router>
            <Routes>
                {/* --- RUTAS PRIVADAS (CLIENTES Y ADMIN) --- */}
                <Route element={<ProtectedRoute adminOnly={false} />}>
                    <Route path="/select-company" element={<SelectCompanyPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Route>

                {/* --- RUTAS SOLO PARA ADMIN --- */}
                <Route element={<ProtectedRoute adminOnly={true} />}>
                    <Route path="/admin" element={<AdminPanel />} />
                </Route>

                {/* --- RUTAS PÚBLICAS --- */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="login" element={<LoginPage />} />
                </Route>

                {/* Redirección por defecto */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;