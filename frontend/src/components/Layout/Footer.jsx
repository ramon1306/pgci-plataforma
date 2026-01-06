import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            textAlign: 'center',
            padding: '30px',
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #dee2e6',
            marginTop: '50px'
        }}>
            <p style={{ margin: 0, color: '#6c757d' }}>
                &copy; {new Date().getFullYear()} Asesoría Integral A&D. Todos los derechos reservados.
            </p>
        </footer>
    );
};

export default Footer;