import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardPage = () => {
    const navigate = useNavigate();

    const [empresa, setEmpresa] = useState({
        nombre: 'Cargando...',
        id: '',
        rol: '',
        permiso_subida: false
    });
    const [documentos, setDocumentos] = useState([]);
    const [loadingDocs, setLoadingDocs] = useState(true);
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [subiendo, setSubiendo] = useState(false);
    const [progreso, setProgreso] = useState(0);

    const isStaff = sessionStorage.getItem('is_staff') === 'true';
    const rawRole = sessionStorage.getItem('rol_usuario') || '';
    const canAccessAdmin = isStaff || ['ADMIN', 'DUENO', 'ADMINISTRADOR'].includes(rawRole.toUpperCase());

    const fetchDocumentos = useCallback(async (empresaId, token) => {
        if (!empresaId || empresaId === "undefined") return;
        setLoadingDocs(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/v1/documentos/?empresa=${empresaId}`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            setDocumentos(response.data);
        } catch (err) {
            console.error("Error al cargar documentos:", err);
            if (err.response?.status === 404 || JSON.stringify(err.response?.data).includes("inválida")) {
                sessionStorage.removeItem('empresa_id');
                navigate('/select-company');
            }
        } finally {
            setLoadingDocs(false);
        }
    }, [navigate]);

    useEffect(() => {
        const token = sessionStorage.getItem('auth_token');
        let empresaId = sessionStorage.getItem('empresa_id');
        const empresaNombre = sessionStorage.getItem('empresa_nombre');

        if (!token) { navigate('/login'); return; }

        // REFUERZO: Si el ID viene como "[object Object]", lo limpiamos
        if (!empresaId || empresaId === "undefined" || empresaId.includes("Object")) {
            navigate('/select-company');
            return;
        }

        setEmpresa({
            nombre: empresaNombre || 'Empresa',
            id: empresaId,
            rol: rawRole,
            permiso_subida: sessionStorage.getItem('permiso_subida') === 'true'
        });

        fetchDocumentos(empresaId, token);
    }, [navigate, rawRole, fetchDocumentos]);

    const handleFileUpload = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('auth_token');
        const empresaIdSeguro = empresa.id; // Usamos el ID del estado que ya está validado

        if (!archivoSeleccionado) return alert("Por favor, selecciona un archivo.");

        const formData = new FormData();
        formData.append('nombre', archivoSeleccionado.name);
        formData.append('archivo', archivoSeleccionado);
        formData.append('empresa', empresaIdSeguro);

        setSubiendo(true);
        setProgreso(0);

        try {
            await axios.post('http://127.0.0.1:8000/api/v1/documentos/', formData, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const porc = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgreso(porc);
                }
            });
            alert("✅ Archivo subido con éxito");
            setArchivoSeleccionado(null);
            // Resetear el input file manualmente si es necesario
            e.target.reset();
            setProgreso(0);
            fetchDocumentos(empresaIdSeguro, token);
        } catch (err) {
            const errorMsg = JSON.stringify(err.response?.data || "Error de red");
            alert("❌ Error: " + errorMsg);
            if (errorMsg.includes("inválida")) {
                sessionStorage.removeItem('empresa_id');
                navigate('/select-company');
            }
        } finally {
            setSubiendo(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este documento?")) return;
        const token = sessionStorage.getItem('auth_token');
        try {
            await axios.delete(`http://127.0.0.1:8000/api/v1/documentos/${id}/`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            setDocumentos(prev => prev.filter(doc => doc.id !== id));
        } catch (err) {
            alert("❌ No se pudo eliminar el documento.");
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login', { replace: true });
    };

    return (
        <div style={styles.layout}>
            <aside style={styles.sidebar}>
                <div style={styles.logoSec}>
                    <h2 style={styles.brand}>A&D Sistema</h2>
                    <p style={styles.subBrand}>{empresa.nombre}</p>
                </div>
                <nav style={styles.nav}>
                    <div style={styles.navItemActive} onClick={() => navigate('/dashboard')}>📊 Dashboard</div>
                    <div style={styles.navItem} onClick={() => navigate('/select-company')}>🏢 Cambiar Empresa</div>
                    {canAccessAdmin && (
                        <div style={styles.adminNav} onClick={() => navigate('/admin')}>⚙️ Panel Admin</div>
                    )}
                </nav>
                <button onClick={handleLogout} style={styles.logout}>Cerrar Sesión</button>
            </aside>

            <main style={styles.main}>
                <header style={styles.header}>
                    <div>
                        <h1 style={styles.title}>Mis Documentos</h1>
                        <p style={{ color: '#666' }}>Mostrando archivos de: <strong>{empresa.nombre}</strong></p>
                    </div>
                    <div style={styles.badge}>
                        Rol: <strong>{empresa.rol.replace('_', ' ')}</strong>
                    </div>
                </header>

                <div style={styles.grid}>
                    <div style={styles.card}>
                        <h3>Repositorio Digital</h3>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Nombre del Archivo</th>
                                    <th style={styles.th}>Subido el</th>
                                    <th style={styles.th}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documentos.length > 0 ? (
                                    documentos.map(doc => (
                                        <tr key={doc.id} style={styles.row}>
                                            <td style={styles.td}>{doc.nombre}</td>
                                            <td style={styles.td}>{new Date(doc.fecha_subida).toLocaleDateString()}</td>
                                            <td style={{ ...styles.td, display: 'flex', gap: '8px' }}>
                                                <a href={doc.archivo_url || doc.archivo} target="_blank" rel="noreferrer" style={styles.btnView}>Ver</a>
                                                {(isStaff || empresa.permiso_subida) && (
                                                    <button onClick={() => handleDelete(doc.id)} style={styles.btnDelete}>Borrar</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" style={styles.empty}>
                                            {loadingDocs ? 'Cargando documentos...' : 'No se encontraron archivos.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {(isStaff || empresa.permiso_subida) && (
                            <div style={{ ...styles.card, border: '2px dashed #37c778' }}>
                                <h3 style={{ color: '#1e7e4a', fontSize: '1rem' }}>📤 Subir Documento</h3>
                                <form onSubmit={handleFileUpload} style={styles.form}>
                                    <input type="file" onChange={(e) => setArchivoSeleccionado(e.target.files[0])} style={{ fontSize: '0.8rem' }} />
                                    <button type="submit" disabled={subiendo} style={styles.btnUpload}>
                                        {subiendo ? 'Enviando...' : 'Subir Ahora'}
                                    </button>
                                </form>
                                {subiendo && (
                                    <div style={styles.progressBg}>
                                        <div style={{ ...styles.progressBar, width: `${progreso}%` }}></div>
                                        <span style={styles.progressText}>{progreso}%</span>
                                    </div>
                                )}
                            </div>
                        )}
                        <div style={styles.card}>
                            <h3 style={{ marginTop: 0, fontSize: '0.9rem' }}>Estado</h3>
                            <div style={styles.alertItem}>🔒 Conexión Segura</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- Objeto de Estilos ---
const styles = {
    layout: { display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'Segoe UI, sans-serif' },
    sidebar: { width: '250px', backgroundColor: '#001f3f', color: 'white', padding: '25px', display: 'flex', flexDirection: 'column' },
    logoSec: { borderBottom: '1px solid #ffffff22', marginBottom: '25px', paddingBottom: '15px' },
    brand: { margin: 0, fontSize: '1.2rem' },
    subBrand: { color: '#37c778', fontSize: '0.75rem', margin: '5px 0', fontWeight: 'bold' },
    nav: { flex: 1 },
    navItem: { padding: '12px', cursor: 'pointer', borderRadius: '8px', marginBottom: '8px', opacity: 0.8 },
    navItemActive: { padding: '12px', cursor: 'pointer', borderRadius: '8px', backgroundColor: '#ffffff15', fontWeight: 'bold' },
    adminNav: { padding: '12px', cursor: 'pointer', color: '#ffcc00', border: '1px dashed #ffcc00', borderRadius: '8px', marginTop: '15px' },
    logout: { backgroundColor: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    main: { flex: 1, padding: '40px', overflowY: 'auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
    title: { margin: 0, color: '#003366', fontSize: '1.8rem' },
    badge: { backgroundColor: 'white', padding: '10px 20px', borderRadius: '30px', boxShadow: '0 4px 10px #00000008' },
    grid: { display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '30px' },
    card: { backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 8px 25px #00000005' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #f4f7f6', color: '#999', fontSize: '0.75rem', textTransform: 'uppercase' },
    td: { padding: '15px 12px', borderBottom: '1px solid #f8f9fa', fontSize: '0.9rem' },
    row: { transition: '0.2s' },
    btnView: { backgroundColor: '#37c778', color: 'white', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold' },
    btnDelete: { backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' },
    empty: { textAlign: 'center', padding: '50px', color: '#bbb' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    btnUpload: { backgroundColor: '#37c778', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    progressBg: { width: '100%', height: '18px', backgroundColor: '#eee', borderRadius: '9px', marginTop: '12px', overflow: 'hidden', position: 'relative' },
    progressBar: { height: '100%', backgroundColor: '#37c778', transition: 'width 0.4s ease' },
    progressText: { position: 'absolute', width: '100%', textAlign: 'center', top: '1px', fontSize: '0.7rem', fontWeight: 'bold', color: '#333' },
    alertItem: { backgroundColor: '#e8f7ef', padding: '10px', borderRadius: '8px', color: '#1e7e4a', fontSize: '0.75rem', textAlign: 'center', fontWeight: 'bold' }
};

export default DashboardPage;