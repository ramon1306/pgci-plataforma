import React, { useState } from 'react';

const ContactPage = () => {
    // 1. Estado para capturar los datos del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
    });

    // 2. Estado para mostrar el mensaje de éxito
    const [enviado, setEnviado] = useState(false);

    // Manejador de cambios en los inputs
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 3. FUNCIÓN DE CONEXIÓN CON EL BACKEND
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Reemplaza con tu IP si es necesario, pero 127.0.0.1 es el estándar local
            const response = await fetch('http://127.0.0.1:8000/api/v1/contacto/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Si Django guarda con éxito
                setEnviado(true);
                setFormData({ nombre: '', email: '', asunto: '', mensaje: '' }); // Limpiar campos

                // Ocultar mensaje de éxito después de 5 segundos
                setTimeout(() => setEnviado(false), 5000);
            } else {
                alert("Error en el servidor. Por favor, revisa los datos.");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar con el servidor. Verifica que el Backend esté corriendo.");
        }
    };

    // Estilos reutilizables
    const inputStyle = {
        padding: '12px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        width: '100%',
        boxSizing: 'border-box'
    };

    return (
        <div style={{
            padding: '60px 20px',
            maxWidth: '900px',
            margin: '0 auto',
            minHeight: '70vh'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ color: '#003366', fontSize: '2.5rem' }}>Contáctenos</h2>
                <p style={{ color: '#666' }}>Estamos aquí para asesorarlo. Envíenos su consulta y nos comunicaremos a la brevedad.</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.2fr',
                gap: '40px',
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
                {/* Columna de Datos de Contacto (Tus datos reales) */}
                <div style={{ borderRight: '1px solid #eee', paddingRight: '20px' }}>
                    <h3 style={{ color: '#003366', marginBottom: '20px' }}>Información de Contacto</h3>
                    <p style={{ margin: '15px 0' }}>📍 <strong>Dirección:</strong><br /> Saavedra 248, Formosa, Capital</p>
                    <p style={{ margin: '15px 0' }}>📞 <strong>Teléfono:</strong><br /> +54 370 4537437</p>
                    <p style={{ margin: '15px 0' }}>✉️ <strong>Email:</strong><br /> asesoriaintegralayd@gmail.com</p>
                    <p style={{ margin: '15px 0' }}>⏰ <strong>Horarios:</strong><br />
                        Mañana: Lun a Vie 7:30 - 12:30<br />
                        Tarde: Lun, Mar y Jue 14:30 - 18:30
                    </p>
                </div>

                {/* Columna del Formulario */}
                <div>
                    {enviado ? (
                        <div style={{
                            backgroundColor: '#d4edda',
                            color: '#155724',
                            padding: '30px',
                            borderRadius: '10px',
                            textAlign: 'center',
                            fontWeight: 'bold'
                        }}>
                            ✅ ¡Mensaje enviado con éxito!<br />
                            Nos contactaremos pronto con usted.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                placeholder="Nombre completo"
                                style={inputStyle}
                                required
                                onChange={handleChange}
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                placeholder="Correo electrónico"
                                style={inputStyle}
                                required
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="asunto"
                                value={formData.asunto}
                                placeholder="Asunto de la consulta"
                                style={inputStyle}
                                required
                                onChange={handleChange}
                            />
                            <textarea
                                name="mensaje"
                                value={formData.mensaje}
                                placeholder="¿En qué podemos ayudarle?"
                                rows="5"
                                style={inputStyle}
                                required
                                onChange={handleChange}
                            ></textarea>
                            <button
                                type="submit"
                                style={{
                                    padding: '15px',
                                    backgroundColor: '#003366',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    transition: 'background-color 0.3s'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#004a94'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#003366'}
                            >
                                Enviar Consulta
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;