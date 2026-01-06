import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const navigate = useNavigate();

    // Recuperamos los datos guardados en el paso anterior
    const empresaNombre = localStorage.getItem('empresa_nombre');
    const empresaId = localStorage.getItem('empresa_id');

    const handleLogout = () => {
        localStorage.clear(); // Limpiamos todo al salir
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
            {/* Sidebar Lateral */}
            <div style={{ width: '250px', backgroundColor: '#003366', color: 'white', padding: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem', letterSpacing: '1px' }}>
                    Plataforma
                </h2>
                <span style={{
                    fontSize: '1.3rem',
                    marginTop: '5px',
                    color: '#37c778ff', // Un toque dorado para resaltar el nombre
                    textAlign: 'center',
                    fontWeight: 'bold'
                }}>
                    {empresaNombre}
                </span>

                <hr style={{ opacity: 0.3 }} />
                <nav>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ padding: '10px 0', cursor: 'pointer' }}>📊 Resumen</li>
                        <li style={{ padding: '10px 0', cursor: 'pointer' }}>📂 Mis Documentos</li>
                        <li style={{ padding: '10px 0', cursor: 'pointer' }}>⚙️ Configuración</li>
                    </ul>
                </nav>
                <button
                    onClick={handleLogout}
                    style={{ marginTop: '50px', backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
                >
                    Cerrar Sesión
                </button>
            </div>

            {/* Contenido Principal */}
            <div style={{ flex: 1, padding: '40px', backgroundColor: '#f4f7f6' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>Panel de Control</h1>
                    <div style={{ backgroundColor: 'white', padding: '10px 20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <strong>🏢 Empresa actual:</strong> {empresaNombre} (ID: {empresaId})
                    </div>
                </header>

                <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #eee' }}>
                        <h3>Documentos Recientes</h3>
                        <p>No hay documentos cargados aún para {empresaNombre}.</p>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #eee' }}>
                        <h3>Notificaciones</h3>
                        <p>Todo está al día.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;