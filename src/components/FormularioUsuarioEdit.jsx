// src/components/FormularioUsuarioEdit.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usuariosD from "../data/usuarios.json"; 
import regionesD from "../data/regiones.json"; // <--- Tu JSON de regiones/comunas

// --- Configuración Global ---
const LOCAL_STORAGE_KEY_USERS = 'usuarios_maestro';
const ROLES = ["admin", "usuario"]; 
const ALLOWED_DOMAINS = ['@duoc.cl', '@gmail.com', '@levelup.cl']; 
const MIN_PASSWORD_LENGTH = 6; 
const DUOC_DOMAIN = '@duoc.cl'; 

// Carga de datos
const getMasterUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USERS));
    if (!storedUsers && usuariosD.usuarios) {
        localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(usuariosD.usuarios));
        return usuariosD.usuarios;
    }
    return storedUsers || [];
};

// Acceso directo al array de regiones (tu JSON es un array de objetos)
const regionesArray = Array.isArray(regionesD) ? regionesD : []; 


function FormularioUsuarioEdit({ userId }) {
    
    const navigate = useNavigate();

    // Estado local para los datos del usuario (inicialmente nulo para mostrar carga)
    const [formData, setFormData] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    // Estado para las comunas disponibles basado en la región actual
    const [comunasOptions, setComunasOptions] = useState([]);


    // --- Efecto para cargar los datos del usuario al inicio ---
    useEffect(() => {
        const users = getMasterUsers();
        const userToEdit = users.find(u => u.id === userId);

        if (userToEdit) {
            // 1. Inicializar el formData con los datos del usuario
            const initialData = {
                ...userToEdit,
                esDuoc: userToEdit.esDuoc ? 'true' : 'false',
                originalPassword: userToEdit.password, 
                password: '', // Dejar vacío por seguridad
            };
            setFormData(initialData);

            // 2. Cargar las comunas iniciales para el primer render
            const initialRegion = regionesArray.find(r => r.region === initialData.region);
            if (initialRegion) {
                setComunasOptions(initialRegion.comunas);
            }
        } else {
            alert("Usuario no encontrado.");
            navigate('/usuariosadmin');
        }
        setIsLoading(false);
    }, [userId, navigate]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // La lógica de detección automática de Duoc se maneja en el submit
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    // Función de manejo de cambio de Región
    const handleRegionChange = (e) => {
        const selectedRegionName = e.target.value;
        // 1. Encontrar la región seleccionada en el array maestro
        const selectedRegion = regionesArray.find(r => r.region === selectedRegionName);
        
        // 2. Actualizar el estado del formulario con la nueva región
        setFormData(prev => ({
            ...prev,
            region: selectedRegionName,
            // 3. Resetear la comuna al primer valor de la nueva región
            comuna: selectedRegion?.comunas[0] || '',
        }));

        // 4. Actualizar las opciones de comunas disponibles
        setComunasOptions(selectedRegion?.comunas || []);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData) return;

        // --- VALIDACIONES DE DATOS ---
        const rutSanitized = formData.rut.replace(/[^0-9kK]/g, "");
        const phoneRegex = /^\d{9,}$/;
        const emailLowerCase = formData.email.toLowerCase(); 

        // Validación de Edad (Mayor de 18)
        const birthDate = new Date(formData.fecha);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        
        if (age < 18) {
            alert("Error de validación: El usuario debe ser mayor de 18 años.");
            return;
        }

        // Validación de RUT, Teléfono y Email
        if (rutSanitized.length < 9) {
             alert("Error de validación: El RUT debe tener al menos 9 caracteres.");
            return;
        }
        if (!phoneRegex.test(formData.telefono)) {
            alert("Error de validación: El Teléfono debe tener al menos 9 dígitos numéricos.");
            return;
        }
        const domain = emailLowerCase.substring(emailLowerCase.lastIndexOf('@'));
        if (!ALLOWED_DOMAINS.includes(domain)) {
            alert(`Error de validación: El dominio del correo debe ser uno de: ${ALLOWED_DOMAINS.join(', ')}.`);
            return;
        }
        if (formData.password && formData.password.length < MIN_PASSWORD_LENGTH) {
            alert(`Error de validación: La nueva contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
            return;
        }
        // -----------------------------

        // 1. Determinar esDuoc y Contraseña final
        const esDuocAutomatico = emailLowerCase.endsWith(DUOC_DOMAIN);
        const finalPassword = formData.password || formData.originalPassword; // Usa la nueva o la original

        // 2. Crear el objeto actualizado
        const usuarioActualizado = {
            id: formData.id, // Mantenemos el ID
            nombre: formData.nombre,
            apellido: formData.apellido,
            rut: rutSanitized,
            email: emailLowerCase,
            fecha: formData.fecha,
            region: formData.region,
            comuna: formData.comuna,
            telefono: formData.telefono,
            password: finalPassword, 
            esDuoc: esDuocAutomatico, // Actualiza la afiliación Duoc
            rol: formData.rol,
        };

        // 3. Actualizar el array en localStorage
        const masterUsers = getMasterUsers();
        const updatedUsers = masterUsers.map(u => 
            u.id === userId ? usuarioActualizado : u
        );

        localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(updatedUsers));

        alert(`Usuario ${formData.nombre} (${userId}) actualizado correctamente.`);
        navigate('/usuariosadmin'); // Volver a la lista después de guardar
    };
    
    if (isLoading || !formData) {
        return <div className="text-light p-5 text-center">Cargando datos del usuario...</div>;
    }
    

    return (
        <div className="p-4" style={{ backgroundColor: '#212529', borderRadius: '8px', color: 'white' }}>
            <form onSubmit={handleSubmit}>
                
                {/* ID (Inmutable) */}
                <div className="row mb-3">
                    <div className="col-md-3 mb-3">
                        <label className="form-label">ID de Usuario</label>
                        <div className="form-control bg-dark text-warning border-secondary fw-bold">
                            {formData.id}
                        </div>
                    </div>
                </div>

                {/* Fila 1: Nombre, Apellido */}
                <div className="row mb-3">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input type="text" className="form-control bg-dark text-white border-secondary" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="apellido" className="form-label">Apellido</label>
                        <input type="text" className="form-control bg-dark text-white border-secondary" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />
                    </div>
                </div>

                {/* Fila 2: RUT, Email, Teléfono */}
                <div className="row mb-3">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="rut" className="form-label">RUT (sin puntos ni guión)</label>
                        <input type="text" className="form-control bg-dark text-white border-secondary" id="rut" name="rut" value={formData.rut} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control bg-dark text-white border-secondary" id="email" name="email" value={formData.email} onChange={handleChange} required />
                        <small className="text-warning">Duoc: {formData.email.endsWith(DUOC_DOMAIN) ? 'Detectado (Sí)' : 'No Detectado (No)'}</small>
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="telefono" className="form-label">Teléfono (Mín. 9 números)</label>
                        <input type="tel" className="form-control bg-dark text-white border-secondary" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required />
                    </div>
                </div>
                
                {/* Fila 3: Fecha, Región, Comuna */}
                <div className="row mb-3">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="fecha" className="form-label">Fecha de Nacimiento</label>
                        <input type="date" className="form-control bg-dark text-white border-secondary" id="fecha" name="fecha" value={formData.fecha} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="region" className="form-label">Región</label>
                        {/* Selector de Regiones */}
                        <select className="form-select bg-dark text-white border-secondary" id="region" name="region" value={formData.region} onChange={handleRegionChange} required>
                            {regionesArray.map(r => (
                                <option key={r.region} value={r.region}>{r.region}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="comuna" className="form-label">Comuna</label>
                        {/* Selector de Comunas (DINÁMICO) */}
                        <select className="form-select bg-dark text-white border-secondary" id="comuna" name="comuna" value={formData.comuna} onChange={handleChange} required>
                            {comunasOptions.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Fila 4: Contraseña, Rol */}
                <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="password" className="form-label">Nueva Contraseña (Dejar vacío para no cambiar)</label>
                        <input type="password" className="form-control bg-dark text-white border-secondary" id="password" name="password" value={formData.password} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="rol" className="form-label">Rol</label>
                        <select className="form-select bg-dark text-white border-secondary" id="rol" name="rol" value={formData.rol} onChange={handleChange} required>
                            {ROLES.map(rol => (
                                <option key={rol} value={rol}>{rol.charAt(0).toUpperCase() + rol.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Botones de Acción */}
                <button type="submit" className="btn btn-success me-3">
                    <i className="fas fa-save me-2"></i> Guardar Cambios
                </button>
                <button type="button" onClick={() => navigate('/usuariosadmin')} className="btn btn-secondary">
                    <i className="fas fa-times me-2"></i> Cancelar
                </button>
                
            </form>
        </div>
    );
}

export default FormularioUsuarioEdit;