import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const HomePage = () => {
    return (
        <div style={containerStyle}>
            {/* 1. SECCIÓN PRINCIPAL */}
            <div style={heroSection}>
                <div style={logoContainerStyle}>
                    <img src={logo} alt="Asesoría Integral A&D" style={logoImgStyle} />
                </div>

                <h1 style={titleStyle}>
                    Expertos en Contabilidad y Soluciones Informáticas
                </h1>

                <p style={subtitleStyle}>
                    Brindamos asesoramiento integral para potenciar su negocio a través
                    de la transparencia contable y la innovación tecnológica.
                </p>

                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <Link to="/servicios" style={secondaryBtn}>Nuestros Servicios</Link>
                    <Link to="/contacto" style={secondaryBtn}>Contactar</Link>
                </div>
            </div>

            {/* 2. ACCESO STAFF DISCRETO */}
            <footer style={discreetFooter}>
                <div style={smallDivider}></div>
                <Link to="/login?mode=admin" style={staffLink}>
                    Acceso Administrativo
                </Link>
            </footer>
        </div>
    );
};

// --- ESTILOS ---

const containerStyle = {
    padding: '40px 20px',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    minHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between'
};

const heroSection = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
};

const logoContainerStyle = { marginBottom: '30px' };
const logoImgStyle = { width: '280px', height: 'auto', display: 'block' };

const titleStyle = {
    fontSize: '2.8rem',
    color: '#003366',
    fontWeight: 'bold',
    marginBottom: '20px',
    maxWidth: '900px'
};

const subtitleStyle = {
    fontSize: '1.2rem',
    color: '#555',
    maxWidth: '700px',
    lineHeight: '1.6',
    marginBottom: '40px'
};

const secondaryBtn = {
    padding: '12px 30px',
    border: '2px solid #003366',
    color: '#003366',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 'bold'
};

const discreetFooter = {
    padding: '40px 20px',
    width: '100%'
};

const smallDivider = {
    height: '1px',
    backgroundColor: '#f0f0f0',
    width: '60px',
    margin: '0 auto 15px auto'
};

const staffLink = {
    fontSize: '0.8rem',
    color: '#cccccc', // Gris muy claro para que sea casi invisible si no se busca
    textDecoration: 'none',
    fontWeight: '400',
    letterSpacing: '0.5px',
    transition: 'color 0.3s'
};

export default HomePage;