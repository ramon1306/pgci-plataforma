// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importación de Páginas de la Fase 1
import SelectCompanyPage from './pages/SelectCompanyPage.jsx';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import BlogListPage from './pages/BlogListPage';
import DashboardPage from './pages/DashboardPage';

import ProtectedRoute from './components/ProtectedRoute';

// Componente para manejar el diseño general (Header/Footer)
import Layout from './components/Layout/Layout';

function App() {
    return (
        <Router>
            <Routes>
                {/* --- BLOQUE PROTEGIDO --- */}
                <Route element={<ProtectedRoute />}>
                    {/* Todo lo que esté aquí adentro requiere TOKEN */}
                    <Route path="app/select-company" element={<SelectCompanyPage />} />
                    <Route path="app/dashboard" element={<DashboardPage />} />
                </Route>
                {/* RUTAS PÚBLICAS (Fase 1: Fachada Digital) */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="servicios" element={<ServicesPage />} />
                    <Route path="contacto" element={<ContactPage />} />
                    <Route path="blog" element={<BlogListPage />} />
                    <Route path="login" element={<LoginPage />} />
                </Route>

                {/* FUTURAS RUTAS PRIVADAS (Fase 2: /app) */}
                {/* <Route path="app/*" element={<PrivateRouteLayout />} /> */}
            </Routes>
        </Router>
    );
}

export default App;