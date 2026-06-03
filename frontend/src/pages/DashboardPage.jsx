import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const [documentos, setDocumentos] = useState([]);
    const [novedades, setNovedades] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para la nueva novedad (Staff)
    const [nuevaNovedad, setNuevaNovedad] = useState({ titulo: '', contenido: '' });
    const [enviandoNovedad, setEnviandoNovedad] = useState(false);

    const navigate = useNavigate();

    // Recuperamos la info del contexto actual
    const empresaId = sessionStorage.getItem('empresa_id');
    const empresaNombre = sessionStorage.getItem('empresa_nombre') || "Empresa";
    const rolUsuario = sessionStorage.getItem('rol_usuario');
    const puedeSubir = sessionStorage.getItem('permiso_subida') === 'true';
    const isStaff = sessionStorage.getItem('is_staff') === 'true';

    // Definimos la base de la API desde el entorno
    // const API_BASE_URL = process.env.REACT_APP_API_URL;
    const API_BASE_URL = "http://104.236.113.179:8000/api";

    // --- CARGA DE DOCUMENTOS FILTRADOS ---
    const fetchDocumentos = useCallback(async () => {
        const token = sessionStorage.getItem('auth_token');
        if (!token || !empresaId) {
            navigate('/select-company');
            return;
        }
        try {
            const res = await axios.get(`${API_BASE_URL}/documentos/?empresa=${empresaId}`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            setDocumentos(res.data);
        } catch (err) {
            console.error("Error cargando documentos:", err);
        }
    }, [empresaId, navigate, API_BASE_URL]);

    // --- CARGA DE NOVEDADES FILTRADAS ---
    const fetchNovedades = useCallback(async () => {
        const token = sessionStorage.getItem('auth_token');
        if (!token || !empresaId) return;

        try {
            const res = await axios.get(`${API_BASE_URL}/novedades/?empresa=${empresaId}`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            setNovedades(res.data);
        } catch (err) {
            console.error("Error cargando novedades:", err);
        } finally {
            // Aseguramos que el loader desaparezca al terminar las cargas principales
            setLoading(false);
        }
    }, [empresaId, API_BASE_URL]);

    // --- PUBLICAR NOVEDAD (SOLO STAFF) ---
    const handleCreateNovedad = async (e) => {
        e.preventDefault();
        if (!nuevaNovedad.titulo || !nuevaNovedad.contenido) {
            alert("Por favor completa el título y el contenido");
            return;
        }

        const token = sessionStorage.getItem('auth_token');
        setEnviandoNovedad(true);

        try {
            await axios.post(`${API_BASE_URL}/novedades/`, {
                titulo: nuevaNovedad.titulo,
                contenido: nuevaNovedad.contenido,
                empresa: parseInt(empresaId) // Forzamos número entero
            }, {
                headers: { 'Authorization': `Token ${token}` }
            });

            setNuevaNovedad({ titulo: '', contenido: '' });
            fetchNovedades();
            alert("✅ Aviso publicado con éxito");
        } catch (err) {
            // CAMBIO 2: Aquí es donde pegas lo que te pasé para ver el error real
            console.error("Detalles del error de Django:", err.response?.data);

            // Si el error es porque el ID de empresa no existe o no se envió
            const errorMsg = err.response?.data
                ? JSON.stringify(err.response.data)
                : "Error de conexión con el servidor";

            alert(`❌ Error al publicar: ${errorMsg}`);
        } finally {
            setEnviandoNovedad(false);
        }
    };

    // --- ELIMINAR NOVEDAD (SOLO STAFF) ---
    const handleDeleteNovedad = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este aviso?")) return;
        const token = sessionStorage.getItem('auth_token');
        try {
            await axios.delete(`${API_BASE_URL}/novedades/${id}/`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            setNovedades(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            alert("No se pudo eliminar la novedad.");
        }
    };

    useEffect(() => {
        // Ejecutar ambas cargas al montar o cambiar de empresa
        const loadDashboard = async () => {
            await Promise.all([fetchDocumentos(), fetchNovedades()]);
        };
        loadDashboard();
    }, [fetchDocumentos, fetchNovedades]);

    // --- LÓGICA DE SUBIDA DE ARCHIVOS ---
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const token = sessionStorage.getItem('auth_token');
        const formData = new FormData();
        formData.append('archivo', file);
        formData.append('nombre', file.name);
        formData.append('empresa', empresaId);

        try {
            await axios.post(`${API_BASE_URL}/documentos/`, formData, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert("✅ Archivo subido con éxito");
            fetchDocumentos();
        } catch (err) {
            alert("❌ Error al subir el archivo");
        }
    };

    if (loading) return <div style={styles.loader}>Cargando panel de {empresaNombre}...</div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div>
                    <h1 style={styles.title}>{empresaNombre}</h1>
                    <span style={styles.roleBadge}>{rolUsuario?.replace('_', ' ')}</span>
                </div>
                <div style={styles.btnGroup}>
                    <button onClick={() => navigate('/select-company')} style={styles.secondaryBtn}>Cambiar Empresa</button>
                    <button onClick={() => { sessionStorage.clear(); navigate('/login'); }} style={styles.logoutBtn}>Salir</button>
                </div>
            </header>

            <section style={styles.novedadesSection}>
                <h3 style={{ color: '#003366', marginTop: 0 }}>📢 Novedades y Avisos</h3>

                {isStaff && (
                    <form onSubmit={handleCreateNovedad} style={styles.novedadForm}>
                        <input
                            style={styles.formInput}
                            placeholder="Título del aviso..."
                            value={nuevaNovedad.titulo}
                            onChange={(e) => setNuevaNovedad({ ...nuevaNovedad, titulo: e.target.value })}
                        />
                        <textarea
                            style={styles.formTextarea}
                            placeholder="Contenido del mensaje..."
                            value={nuevaNovedad.contenido}
                            onChange={(e) => setNuevaNovedad({ ...nuevaNovedad, contenido: e.target.value })}
                        />
                        <button type="submit" disabled={enviandoNovedad} style={styles.formBtn}>
                            {enviandoNovedad ? 'Publicando...' : 'Publicar Aviso'}
                        </button>
                    </form>
                )}

                <div style={styles.novedadesGrid}>
                    {novedades.length > 0 ? (
                        novedades.map(n => (
                            <div key={n.id} style={styles.novedadCard}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <small style={styles.novedadFecha}>
                                        {n.fecha ? new Date(n.fecha).toLocaleDateString() : 'Cargando...'}
                                    </small>
                                    {isStaff && (
                                        <button onClick={() => handleDeleteNovedad(n.id)} style={styles.deleteNovedadBtn}>✕</button>
                                    )}
                                </div>
                                <h4 style={{ margin: '5px 0' }}>{n.titulo}</h4>
                                <p style={{ fontSize: '0.85rem', color: '#444' }}>{n.contenido}</p>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: '#999', fontSize: '0.9rem' }}>No hay comunicados para esta empresa.</p>
                    )}
                </div>
            </section>

            <main style={styles.main}>
                <div style={styles.sectionHeader}>
                    <h2>📂 Repositorio de Documentos</h2>
                    {puedeSubir && (
                        <div>
                            <button
                                style={styles.uploadBtn}
                                onClick={() => document.getElementById('quick-upload').click()}
                            >
                                + Subir Documento
                            </button>
                            <input
                                id="quick-upload"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                            />
                        </div>
                    )}
                </div>

                <div style={styles.grid}>
                    {documentos.length > 0 ? (
                        documentos.map(doc => (
                            <div key={doc.id} style={styles.card}>
                                <div style={styles.fileIcon}>📄</div>
                                <div style={styles.fileInfo}>
                                    <h4 style={styles.fileName}>{doc.nombre}</h4>
                                    <p style={styles.fileDate}>Fecha: {new Date(doc.fecha_subida).toLocaleDateString()}</p>
                                </div>
                                <a href={doc.archivo_url || doc.archivo} target="_blank" rel="noreferrer" style={styles.downloadLink}>Ver/Descargar</a>
                            </div>
                        ))
                    ) : (
                        <div style={styles.emptyState}>
                            <p>Esta empresa no posee documentos cargados actualmente.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

// ... (estilos se mantienen igual que tu versión anterior)
const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'sans-serif' },
    header: { backgroundColor: '#003366', color: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { margin: 0, fontSize: '1.4rem' },
    roleBadge: { fontSize: '0.75rem', backgroundColor: '#004a99', padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase' },
    btnGroup: { display: 'flex', gap: '10px' },
    secondaryBtn: { background: 'transparent', border: '1px solid white', color: 'white', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' },
    logoutBtn: { background: '#cc0000', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' },
    novedadesSection: { padding: '20px 40px', backgroundColor: '#fff', borderBottom: '1px solid #ddd' },
    novedadForm: { display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '500px', marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' },
    formInput: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
    formTextarea: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px', resize: 'vertical' },
    formBtn: { backgroundColor: '#003366', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' },
    novedadesGrid: { display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' },
    novedadCard: { minWidth: '250px', maxWidth: '300px', backgroundColor: '#fffdf0', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #ffcc00', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'relative' },
    novedadFecha: { color: '#888', fontSize: '0.7rem' },
    deleteNovedadBtn: { background: 'none', border: 'none', color: '#cc0000', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', padding: '0 5px' },
    main: { padding: '30px 40px' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    uploadBtn: { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    card: { backgroundColor: 'white', padding: '15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    fileIcon: { fontSize: '1.8rem' },
    fileInfo: { flex: 1 },
    fileName: { margin: '0', fontSize: '0.95rem', color: '#333' },
    fileDate: { margin: 0, fontSize: '0.75rem', color: '#999' },
    downloadLink: { color: '#003366', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem' },
    emptyState: { textAlign: 'center', gridColumn: '1/-1', padding: '40px', color: '#888' },
    loader: { textAlign: 'center', marginTop: '50px', fontSize: '1.1rem' }
};

export default DashboardPage;