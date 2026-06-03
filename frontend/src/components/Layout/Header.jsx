import React from 'react';
import { Link } from 'react-router-dom';
import logoMini from '../../assets/logo.jpg'; // Importamos el logo

const Header = () => {
    const headerStyle = {
        backgroundColor: '#003366',
        padding: '10px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white'
    };

    const linkStyle = {
        color: 'white',
        textDecoration: 'none',
        marginLeft: '20px',
        fontWeight: '500'
    };

    const accesoBtnStyle = {
        ...linkStyle,
        color: '#FFD700', // Dorado
        border: '1px solid #FFD700',
        padding: '5px 15px',
        borderRadius: '5px',
        transition: '0.3s'
    };

    return (
        <header style={headerStyle}>
            {/* IZQUIERDA: LOGO Y NOMBRE */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '10px' }}>
                <img
                    src={logoMini}
                    alt="A&D Logo"
                    style={{ height: '40px', borderRadius: '4px', backgroundColor: 'white' }}
                />
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Asesoría Integral A&D
                </span>
            </Link>

            {/* DERECHA: NAVEGACIÓN */}
            <nav>
                <Link to="/" style={linkStyle}>Inicio</Link>
                <Link to="/servicios" style={linkStyle}>Servicios</Link>
                <Link to="/contacto" style={linkStyle}>Contacto</Link>
                <Link to="/login" style={accesoBtnStyle}>
                    ACCESO CLIENTES
                </Link>
            </nav>
        </header>
    );
};

export default Header;