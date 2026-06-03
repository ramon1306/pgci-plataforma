import React from 'react';

const ServicesPage = () => {
    const servicios = [
        { title: "Gestión Contable", desc: "Balances, auditorías y estados financieros precisos." },
        { title: "Asesoría Impositiva", desc: "Liquidación de impuestos y planificación fiscal estratégica." },
        { title: "Soporte Informático", desc: "Mantenimiento preventivo, redes y seguridad de la información." },
        { title: "Desarrollo de Software", desc: "Soluciones a medida para automatizar procesos internos." }
    ];

    return (
        <div style={{ padding: '40px', backgroundColor: '#f4f7f6' }}>
            <h2 style={{ textAlign: 'center', color: '#003366', marginBottom: '30px' }}>Nuestros Servicios</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {servicios.map((s, i) => (
                    <div key={i} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ color: '#003366' }}>{s.title}</h3>
                        <p style={{ color: '#555' }}>{s.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServicesPage;