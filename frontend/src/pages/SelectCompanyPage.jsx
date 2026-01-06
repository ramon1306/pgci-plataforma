import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:8000/api/v1/empresas/';

const SelectCompanyPage = () => {
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('auth_token');

        if (!token) {
            navigate('/login');
            return;
        }

        const config = {
            headers: {
                'Authorization': `Token ${token}`
            }
        };

        axios.get(API_URL, config)
            .then(response => {
                console.log("Datos recibidos:", response.data);
                setEmpresas(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al obtener empresas:", err);
                setError("Error al cargar las empresas.");
                setLoading(false);
            });
    }, [navigate]);

    if (loading) return <div style={{ padding: '20px' }}>Cargando empresas...</div>;
    if (error) return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
            <h2 style={{ color: '#003366' }}>Seleccionar Empresa</h2>
            <p>Seleccione la empresa con la que desea trabajar:</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {empresas.map((vinculo) => (
                    <div
                        key={vinculo.empresa.id}
                        onClick={() => {
                            // Guardamos la empresa seleccionada para usarla en toda la app
                            localStorage.setItem('empresa_id', vinculo.empresa.id);
                            localStorage.setItem('empresa_nombre', vinculo.empresa.razon_social);
                            navigate('/app/dashboard'); // Cambia esto por tu ruta de destino
                        }}
                        style={{
                            padding: '20px',
                            border: '2px solid #003366',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            backgroundColor: '#f0f4f8',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {/* Acceso a los datos anidados del serializador */}
                        <h3 style={{ margin: '0 0 10px 0', color: '#003366' }}>
                            {vinculo.razon_social}
                        </h3>
                        <p style={{ margin: 0, color: '#666' }}>
                            <strong>Rol:</strong> {vinculo.rol}
                        </p>
                    </div>
                ))}
            </div>

            {empresas.length === 0 && <p>No hay empresas asociadas a su perfil.</p>}
        </div>
    );
};

export default SelectCompanyPage;