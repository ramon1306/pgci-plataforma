// frontend/src/components/Layout/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
    return (
        <div>
            <Header />
            <main>
                <Outlet /> {/* Aquí se renderizará el componente de página actual (HomePage, LoginPage, etc.) */}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;