import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Estado para el botón de carga
    const navigate = useNavigate();

    useEffect(() => {
        // Al montar, verificamos si ya hay sesión activa
        const token = sessionStorage.getItem('auth_token');
        const isStaff = sessionStorage.getItem('is_staff') === 'true';

        if (token) {
            // Redirigir según el rol guardado
            navigate(isStaff ? '/admin' : '/select-company', { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Llamada al endpoint que configuramos en apps/core/views.py (CustomLoginView)
            const res = await axios.post('http://127.0.0.1:8000/api/v1/login/', credentials);

            // Guardamos los datos recibidos (token, is_staff, username)
            sessionStorage.setItem('auth_token', res.data.token);
            // Convertimos a string para sessionStorage de forma segura
            sessionStorage.setItem('is_staff', String(res.data.is_staff));
            sessionStorage.setItem('username', res.data.username);

            // Redirección lógica inmediata
            if (res.data.is_staff) {
                navigate('/admin', { replace: true });
            } else {
                navigate('/select-company', { replace: true });
            }
        } catch (err) {
            console.error("Error en login:", err.response?.data);
            if (err.response?.status === 400) {
                setError('Usuario o contraseña incorrectos.');
            } else {
                setError('Error de conexión con el servidor.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h2 style={titleStyle}>🛡️ Acceso A&D</h2>
                <hr style={dividerStyle} />

                {error && <div style={errorStyle}>{error}</div>}

                <div style={inputGroup}>
                    <label style={labelStyle}>Usuario</label>
                    <input
                        type="text"
                        placeholder="Ingresa tu usuario"
                        autoComplete="username"
                        style={inputStyle}
                        required
                        onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                    />
                </div>

                <div style={inputGroup}>
                    <label style={labelStyle}>Contraseña</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        style={inputStyle}
                        required
                        onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        ...buttonStyle,
                        backgroundColor: loading ? '#ccc' : '#003366',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Verificando...' : 'Entrar al Sistema'}
                </button>
            </form>
        </div>
    );
};

// --- ESTILOS MEJORADOS ---
const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f7f6'
};

const formStyle = {
    width: '350px',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
};

const titleStyle = { textAlign: 'center', color: '#003366', marginBottom: '10px' };
const dividerStyle = { border: '0', height: '1px', background: '#eee', marginBottom: '20px' };
const errorStyle = { color: 'white', backgroundColor: '#d9534f', padding: '10px', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '15px', textAlign: 'center' };
const inputGroup = { marginBottom: '15px' };
const labelStyle = { display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '5px', marginLeft: '2px' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box', outlineColor: '#003366' };
const buttonStyle = { width: '100%', padding: '12px', color: 'white', border: 'none', borderRadius: '6px', transition: '0.3s', fontWeight: 'bold' };

export default LoginPage;