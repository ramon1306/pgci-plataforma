// frontend/src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react'; // <-- IMPORTAR useEffect
import axios from 'axios'; // Importar Axios para peticiones HTTP
import { useNavigate } from 'react-router-dom'; // Para redirigir

// URL base de tu API de Django (ajusta el puerto si es necesario)
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const LoginPage = () => {
    // DRF obtain_auth_token usa 'username' y 'password'.
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // ===================================================================
    // ¡NUEVA LÓGICA DE PROTECCIÓN!
    // ===================================================================
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            // Si el token existe, el usuario ya está autenticado.
            // Redirigir al siguiente paso.
            navigate('/app/select-company', { replace: true });
        }
    }, [navigate]);
    // ===================================================================

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Limpiar errores previos

        try {
            // Llama al endpoint de login de Django REST Framework
            // Endpoint: http://127.0.0.1:8000/api/v1/auth/login/
            const response = await axios.post(`${API_BASE_URL}/auth/login/`, credentials);

            const token = response.data.token;
            console.log('Login exitoso. Token recibido:', token);

            // 1. Almacenar el Token de autenticación (CRUCIAL para futuras peticiones)
            localStorage.setItem('auth_token', token);

            // 2. Redirigir al siguiente paso de la Fase 1 (Selección de Empresa)
            // Esta ruta deberá estar definida en tu App.js para funcionar
            navigate('/app/select-company');

        } catch (err) {
            console.error('Error de autenticación:', err.response || err);

            if (err.response && err.response.status === 400) {
                setError('Credenciales inválidas. Verifique su usuario y contraseña.');
            } else {
                setError('Error al conectar con el servidor. Intente más tarde.');
            }
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
            <form onSubmit={handleSubmit} style={{ width: '400px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <h2>Acceso de Clientes</h2>

                {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="username">Usuario/Email</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>

                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#003366', color: 'white', border: 'none' }}>
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
};

export default LoginPage;