import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SelectCompanyPage = () => {
    const [vinculos, setVinculos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Función para formatear el texto del Rol (ej: de GERENTE_FINANCIERO a Gerente Financiero)
    const formatRole = (role) => {
        if (!role) return 'Usuario';
        return role.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    useEffect(() => {
        const token = sessionStorage.getItem('auth_token');
        if (!token) {
            navigate('/login', { replace: true });
            return;
        }

        const fetchMisEmpresas = async () => {
            try {
                // Asegúrate de que este endpoint en Django use el ClienteEmpresaSerializer
                const res = await axios.get('http://127.0.0.1:8000/api/v1/mis-empresas/', {
                    headers: { 'Authorization': `Token ${token}` }
                });
                setVinculos(res.data);
            } catch (err) {
                console.error("Error cargando empresas:", err);
                if (err.response?.status === 401) {
                    sessionStorage.clear();
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchMisEmpresas();
    }, [navigate]);

    const handleSelect = (v) => {
        // Guardamos los datos en la sesión para que el resto de la app sepa qué empresa mirar
        sessionStorage.setItem('empresa_id', v.empresa); // El ID de la Empresa
        sessionStorage.setItem('empresa_nombre', v.razon_social);
        sessionStorage.setItem('rol_usuario', v.rol);
        sessionStorage.setItem('permiso_subida', v.permiso_subida);

        navigate('/dashboard');
    };

    if (loading) return (
        <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
            <h2 style={{ color: '#003366' }}>Cargando tus empresas...</h2>
        </div>
    );

    const isStaff = sessionStorage.getItem('is_staff') === 'true';

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Mis Empresas</h1>
                <p style={styles.subtitle}>Seleccione la entidad que desea gestionar</p>
            </header>

            <div style={styles.grid}>
                {vinculos.length > 0 ? (
                    vinculos.map(v => (
                        <div
                            key={v.id}
                            onClick={() => handleSelect(v)}
                            style={styles.card}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={styles.icon}>🏢</div>
                            <h3 style={styles.cardTitle}>{v.razon_social}</h3>
                            <div style={styles.badge}>
                                {formatRole(v.rol)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={styles.noData}>
                        <p>No tienes empresas vinculadas actualmente.</p>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>Contacta con el administrador para obtener acceso.</p>
                    </div>
                )}
            </div>

            <footer style={styles.footer}>
                {isStaff && (
                    <button
                        onClick={() => navigate('/admin-panel')}
                        style={styles.adminBtn}
                    >
                        ⚙️ Panel de Control
                    </button>
                )}
                <button
                    onClick={() => { sessionStorage.clear(); navigate('/login'); }}
                    style={styles.logoutBtn}
                >
                    Cerrar Sesión
                </button>
            </footer>
        </div>
    );
};

// --- Estilos Modernizados ---
const styles = {
    container: { padding: '60px 20px', backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'sans-serif' },
    header: { textAlign: 'center', marginBottom: '40px' },
    title: { color: '#003366', fontSize: '2.2rem', marginBottom: '10px' },
    subtitle: { color: '#555', fontSize: '1.1rem' },
    grid: { display: 'flex', gap: '25px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' },
    card: {
        padding: '30px',
        width: '260px',
        borderRadius: '16px',
        backgroundColor: 'white',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s ease',
        textAlign: 'center',
        border: '1px solid #eee'
    },
    icon: { fontSize: '2.5rem', marginBottom: '15px' },
    cardTitle: { margin: '0 0 15px 0', color: '#333', fontSize: '1.2rem', fontWeight: 'bold' },
    badge: {
        display: 'inline-block',
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        backgroundColor: '#eef2ff',
        color: '#4338ca',
        fontWeight: '600'
    },
    noData: { padding: '40px', background: '#fff', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
    footer: { marginTop: '50px', display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' },
    logoutBtn: { padding: '10px 20px', color: '#dc3545', background: 'none', border: '1px solid #dc3545', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
    adminBtn: { padding: '10px 20px', color: '#003366', background: 'white', border: '1px solid #003366', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }
};

export default SelectCompanyPage;