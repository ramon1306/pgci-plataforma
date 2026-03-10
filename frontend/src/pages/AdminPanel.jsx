import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('listado');

    // --- ESTADOS DE DATOS ---
    const [usuarios, setUsuarios] = useState([]); // Realmente son los perfiles de Cliente
    const [empresas, setEmpresas] = useState([]);
    const [documentos, setDocumentos] = useState([]);
    const [vinculos, setVinculos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // --- ESTADOS DE FORMULARIOS ---
    const [nuevoUsuario, setNuevoUsuario] = useState({ username: '', password: '', email: '', is_staff: false });
    // const [nuevaEmpresa, setNuevaEmpresa] = useState({ razon_social: '', identificacion_fiscal: '', domicilio: '' });

    // Coincide con tu modelo ClienteEmpresa
    const [formData, setFormData] = useState({ cliente: '', empresa: '', rol: 'OTRO', permiso_subida: false });
    // const [docData, setDocData] = useState({ nombre: '', empresa: '', archivo: null });

    const handleLogout = useCallback((mensaje = null) => {
        sessionStorage.clear();
        if (mensaje) alert(mensaje);
        navigate('/login', { replace: true });
    }, [navigate]);

    // --- CARGA DE DATOS ---
    const fetchData = useCallback(async () => {
        const token = sessionStorage.getItem('auth_token');
        if (!token) return;

        const headers = { Authorization: `Token ${token}` };

        try {
            // Nota: El endpoint de usuarios debería devolver el ID del perfil 'Cliente' para vincular correctamente
            const [resUsers, resEmpresas, resDocs, resVinculos] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/v1/usuarios/', { headers }),
                axios.get('http://127.0.0.1:8000/api/v1/empresas/', { headers }),
                axios.get('http://127.0.0.1:8000/api/v1/documentos/', { headers }),
                axios.get('http://127.0.0.1:8000/api/v1/vinculos/', { headers })
            ]);

            setUsuarios(resUsers.data);
            setEmpresas(resEmpresas.data);
            setDocumentos(resDocs.data);
            setVinculos(resLinksFix(resVinculos.data));
        } catch (err) {
            console.error("Error cargando datos:", err);
            if (err.response?.status === 401) handleLogout("Sesión expirada");
        }
    }, [handleLogout]);

    const resLinksFix = (links) => {
        return links.map(l => ({
            ...l,
            usuario_display: l.cliente_nombre || `Cliente ID: ${l.cliente}`,
            empresa_display: l.razon_social || `Empresa ID: ${l.empresa}`
        }));
    };

    useEffect(() => { fetchData(); }, [fetchData]);

    // --- MANEJADORES DE ACCIONES ---
    const handleSubmitUsuario = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/v1/usuarios/', nuevoUsuario, {
                headers: { Authorization: `Token ${sessionStorage.getItem('auth_token')}` }
            });
            alert("✅ Usuario y Perfil Creados");
            setNuevoUsuario({ username: '', password: '', email: '', is_staff: false });
            fetchData();
        } catch (err) { alert("❌ Error al crear usuario"); }
    };

    const handleSubmitRelacion = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                cliente: parseInt(formData.cliente),
                empresa: parseInt(formData.empresa),
                rol: formData.rol,
                permiso_subida: formData.permiso_subida
            };
            await axios.post('http://127.0.0.1:8000/api/v1/vinculos/', payload, {
                headers: { Authorization: `Token ${sessionStorage.getItem('auth_token')}` }
            });
            alert("✅ Vínculo creado");
            setFormData({ cliente: '', empresa: '', rol: 'OTRO', permiso_subida: false });
            fetchData();
        } catch (err) {
            alert("❌ Error: Posible duplicado o ID inválido");
        }
    };

    const handleDeleteVinculo = async (id) => {
        if (!window.confirm("¿Eliminar este acceso?")) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/v1/vinculos/${id}/`, {
                headers: { Authorization: `Token ${sessionStorage.getItem('auth_token')}` }
            });
            fetchData();
        } catch (err) { alert("❌ Error al eliminar"); }
    };

    return (
        <div style={styles.adminContainer}>
            <div style={styles.headerRow}>
                <h2 style={{ color: '#003366' }}>🛡️ Gestión Administrativa A&D</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => navigate('/dashboard')} style={styles.dashboardBtn}>Dashboard</button>
                    <button onClick={() => handleLogout()} style={styles.backBtn}>Cerrar Sesión</button>
                </div>
            </div>

            <div style={styles.tabBar}>
                <button onClick={() => setActiveTab('listado')} style={activeTab === 'listado' ? styles.activeTabBtn : styles.tabBtn}>🏢 Empresas</button>
                <button onClick={() => setActiveTab('usuarios')} style={activeTab === 'usuarios' ? styles.activeTabBtn : styles.tabBtn}>👥 Accesos</button>
                <button onClick={() => setActiveTab('config')} style={activeTab === 'config' ? styles.activeTabBtn : styles.tabBtn}>➕ Altas / Cargas</button>
            </div>

            <div style={styles.mainGrid}>
                {activeTab === 'listado' && (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <input type="text" placeholder="Filtrar empresa..." style={styles.searchInput} onChange={(e) => setSearchTerm(e.target.value)} />
                        <div style={styles.listGrid}>
                            {empresas.filter(e => e.razon_social.toLowerCase().includes(searchTerm.toLowerCase())).map(emp => (
                                <div key={emp.id} style={styles.empCard}>
                                    <strong style={{ color: '#003366' }}>{emp.razon_social}</strong>
                                    <p style={{ fontSize: '0.8rem', color: '#666' }}>CUIT: {emp.identificacion_fiscal}</p>
                                    <div style={styles.docMiniList}>
                                        {documentos.filter(d => d.empresa === emp.id).map(doc => (
                                            <div key={doc.id} style={styles.docItemStyle}>
                                                <span>{doc.nombre}</span>
                                                <a href={doc.archivo_url || doc.archivo} target="_blank" rel="noreferrer" style={styles.viewLink}>Ver</a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'usuarios' && (
                    <div style={styles.tableCard}>
                        <h3>👥 Control de Accesos (Cliente-Empresa)</h3>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.thRow}>
                                    <th>Usuario</th>
                                    <th>Empresa</th>
                                    <th>Rol</th>
                                    <th>Subida</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vinculos.map(v => (
                                    <tr key={v.id} style={styles.tr}>
                                        <td>{v.usuario_display}</td>
                                        <td>{v.empresa_display}</td>
                                        <td>{v.rol}</td>
                                        <td>{v.permiso_subida ? '✅ Sí' : '❌ No'}</td>
                                        <td>
                                            <button onClick={() => handleDeleteVinculo(v.id)} style={styles.deleteBtnSmall}>Quitar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'config' && (
                    <div style={styles.configGrid}>
                        <div style={styles.cardStyle}>
                            <h3>👤 Nuevo Usuario</h3>
                            <form onSubmit={handleSubmitUsuario} style={styles.formGrid}>
                                <input type="text" placeholder="Username" value={nuevoUsuario.username} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, username: e.target.value })} style={styles.inputStyle} required />
                                <input type="password" placeholder="Password" value={nuevoUsuario.password} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })} style={styles.inputStyle} required />
                                <button type="submit" style={{ ...styles.submitBtn, background: '#6f42c1' }}>Crear</button>
                            </form>
                        </div>

                        <div style={styles.cardStyle}>
                            <h3>🔗 Vincular (Nexo)</h3>
                            <form onSubmit={handleSubmitRelacion} style={styles.formGrid}>
                                <select value={formData.cliente} onChange={(e) => setFormData({ ...formData, cliente: e.target.value })} style={styles.selectStyle} required>
                                    <option value="">Seleccionar Cliente...</option>
                                    {usuarios.map(u => <option key={u.id} value={u.id}>{u.username || u.user_display}</option>)}
                                </select>
                                <select value={formData.empresa} onChange={(e) => setFormData({ ...formData, empresa: e.target.value })} style={styles.selectStyle} required>
                                    <option value="">Seleccionar Empresa...</option>
                                    {empresas.map(e => <option key={e.id} value={e.id}>{e.razon_social}</option>)}
                                </select>
                                <select value={formData.rol} onChange={(e) => setFormData({ ...formData, rol: e.target.value })} style={styles.selectStyle}>
                                    <option value="ADMINISTRADOR">Administrador</option>
                                    <option value="DUENO">Dueño</option>
                                    <option value="RRHH">RRHH</option>
                                    <option value="GERENTE_FINANCIERO">Gerente Financiero</option>
                                    <option value="OTRO">Otro</option>
                                </select>
                                <label style={{ fontSize: '0.8rem' }}>
                                    <input type="checkbox" checked={formData.permiso_subida} onChange={(e) => setFormData({ ...formData, permiso_subida: e.target.checked })} /> Permitir subir archivos
                                </label>
                                <button type="submit" style={{ ...styles.submitBtn, background: '#003366' }}>Vincular</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- (Estilos se mantienen igual que tu versión anterior) ---
const styles = {
    adminContainer: { padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'sans-serif' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    backBtn: { padding: '10px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    dashboardBtn: { padding: '10px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    tabBar: { display: 'flex', gap: '10px', marginBottom: '25px' },
    tabBtn: { padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'white', fontWeight: 'bold' },
    activeTabBtn: { padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: '#003366', color: 'white', fontWeight: 'bold' },
    mainGrid: { display: 'grid', gridTemplateColumns: '1fr', gap: '20px' },
    configGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
    cardStyle: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
    tableCard: { background: 'white', padding: '20px', borderRadius: '12px', overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    thRow: { textAlign: 'left', borderBottom: '2px solid #eee', color: '#666', fontSize: '0.9rem' },
    tr: { borderBottom: '1px solid #f0f0f0' },
    inputStyle: { padding: '12px', border: '1px solid #ddd', borderRadius: '6px', width: '100%', boxSizing: 'border-box' },
    selectStyle: { padding: '12px', border: '1px solid #ddd', borderRadius: '6px', width: '100%', background: 'white' },
    submitBtn: { padding: '12px', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    formGrid: { display: 'flex', flexDirection: 'column', gap: '12px' },
    searchInput: { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' },
    listGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
    empCard: { background: 'white', padding: '15px', borderRadius: '10px', borderTop: '4px solid #ffcc00', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    docMiniList: { marginTop: '10px', padding: '8px', background: '#f8f9fa', borderRadius: '5px' },
    deleteBtnSmall: { background: '#fff0f0', color: '#d9534f', border: '1px solid #d9534f', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' },
    docItemStyle: { display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed #eee' },
    viewLink: { fontSize: '0.7rem', color: '#007bff', textDecoration: 'none', background: '#e7f3ff', padding: '2px 6px', borderRadius: '4px' }
};

export default AdminPanel;