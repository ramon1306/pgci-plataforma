import React from 'react';
import { Link } from 'react-router-dom';
// Importamos la imagen desde la carpeta de assets
import logo from '../assets/logo.jpg';

const HomePage = () => {
    return (
        <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {/* Contenedor del Logo */}
            <div style={{ marginBottom: '30px' }}>
                <img
                    src={logo}
                    alt="Asesoría Integral A&D"
                    style={{
                        width: '280px', // Ajusta el tamaño según necesites
                        height: 'auto',
                        display: 'block'
                    }}
                />
            </div>

            {/* Texto Principal */}
            <h1 style={{
                fontSize: '2.8rem',
                color: '#003366',
                fontWeight: 'bold',
                marginBottom: '20px',
                maxWidth: '900px'
            }}>
                Expertos en Contabilidad y Soluciones Informáticas
            </h1>

            <p style={{
                fontSize: '1.2rem',
                color: '#555',
                maxWidth: '700px',
                lineHeight: '1.6',
                marginBottom: '40px'
            }}>
                Brindamos asesoramiento integral para potenciar su negocio a través
                de la transparencia contable y la innovación tecnológica.
            </p>

            {/* Botones de Acción */}
            <div style={{ display: 'flex', gap: '20px' }}>
                <Link
                    to="/servicios"
                    style={{
                        padding: '12px 30px',
                        backgroundColor: '#0055a4',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        transition: '0.3s'
                    }}
                >
                    Ver Servicios
                </Link>

                <Link
                    to="/contacto"
                    style={{
                        padding: '12px 30px',
                        border: '2px solid #0055a4',
                        color: '#0055a4',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        transition: '0.3s'
                    }}
                >
                    Contactar
                </Link>
            </div>
        </div>
    );
};

export default HomePage;