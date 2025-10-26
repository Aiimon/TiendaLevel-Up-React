// src/components/FormularioUsuarioNV.jsx

import React, { useState } from 'react'; // Eliminamos useEffect ya que no es necesario
import usuariosD from "../data/usuarios.json"; 
import regionesD from "../data/regiones.json"; // <--- Tu JSON de regiones/comunas (Ahora es el array directamente)

// --- Configuración Global ---
const LOCAL_STORAGE_KEY_USERS = 'usuarios_maestro';
const ROLES = ["admin", "usuario"]; 
const ALLOWED_DOMAINS = ['@duoc.cl', '@gmail.com', '@levelup.cl']; 
const MIN_PASSWORD_LENGTH = 6; 
const DUOC_DOMAIN = '@duoc.cl'; 

// Lógica de carga de usuarios (se mantiene igual)
const getMasterUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USERS));
    if (!storedUsers && usuariosD.usuarios) {
        localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(usuariosD.usuarios));
        return usuariosD.usuarios;
    }
    return storedUsers || [];
};

// --- FUNCIÓN DE GENERACIÓN DE ID (se mantiene igual) ---
const generateUserId = (existingUsers) => {
    const currentCount = existingUsers.length;
    const newNumber = currentCount + 1;
    const newNumberPadded = String(newNumber).padStart(3, '0');
    return `U${newNumberPadded}`; 
};
// --------------------------------------------------------


function FormularioUsuarioNV() {
    
    // 1. DATA: Corregimos la asignación para que lea el array directamente
    // Usamos 'regionesD' en lugar de 'regionesD.regiones'
    const regionesArray = Array.isArray(regionesD) ? regionesD : []; 
    
    // 2. INICIALIZACIÓN: Establecemos los defaults solo si hay data
    const initialRegion = regionesArray[0]?.region || ''; // Usamos 'region' en lugar de 'nombre'
    const initialComuna = regionesArray[0]?.comunas[0] || '';

    const [formData, setFormData] = useState({
        nombre: '', apellido: '', rut: '', email: '', fecha: '', 
        region: initialRegion, 
        comuna: initialComuna, 
        telefono: '', password: '', rol: ROLES[0],
    });

    const existingUsers = getMasterUsers();
    const currentGeneratedId = generateUserId(existingUsers);


    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'email') {
            const newValue = value.toLowerCase();
            setFormData(prev => ({ ...prev, [name]: newValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    // Manejar el cambio de región para actualizar las comunas disponibles
    const handleRegionChange = (e) => {
        const selectedRegionName = e.target.value;
        // Buscamos por la clave "region"
        const selectedRegion = regionesArray.find(r => r.region === selectedRegionName);
        
        setFormData(prev => ({
            ...prev,
            region: selectedRegionName,
            // Actualiza la comuna al primer valor de la nueva región seleccionada
            comuna: selectedRegion?.comunas[0] || '',
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        
        // --- VALIDACIONES DE DATOS (se mantienen igual) ---
        const rutSanitized = formData.rut.replace(/[^0-9kK]/g, "");
        const phoneRegex = /^\d{9,}$/;
        const emailLowerCase = formData.email.toLowerCase(); 
        const esDuocAutomatico = emailLowerCase.endsWith(DUOC_DOMAIN);

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
             alert("Error de validación: El RUT debe tener al menos 9 caracteres (sin contar puntos ni guión).");
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
        if (formData.password.length < MIN_PASSWORD_LENGTH) {
            alert(`Error de validación: La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
            return;
        }
        // -----------------------------

        // Obtener la lista más reciente y generar ID
        const finalUsers = getMasterUsers();
        const newId = generateUserId(finalUsers);

        // 3. Crear el objeto final
        const nuevoUsuario = {
            id: newId, nombre: formData.nombre, apellido: formData.apellido,
            rut: rutSanitized, email: emailLowerCase, fecha: formData.fecha,
            region: formData.region, comuna: formData.comuna, telefono: formData.telefono,
            password: formData.password, esDuoc: esDuocAutomatico, rol: formData.rol,
        };

        // 4. Verificar si el Email ya existe
        if (finalUsers.some(u => u.email === nuevoUsuario.email)) {
            alert(`Error: El correo electrónico "${nuevoUsuario.email}" ya está registrado.`);
            return;
        }

        // 5. Guardar en localStorage y limpiar
        finalUsers.push(nuevoUsuario);
        localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(finalUsers));

        alert(`Usuario ${nuevoUsuario.nombre} creado con ID ${newId}.`);
        
        // 6. Limpiar formulario
        setFormData({ 
            nombre: '', apellido: '', rut: '', email: '', fecha: '', 
            region: initialRegion, comuna: initialComuna, telefono: '', password: '', 
            rol: ROLES[0] 
        });
    };
    
    // Obtener las comunas de la región actualmente seleccionada para el <select>
    const currentRegion = regionesArray.find(r => r.region === formData.region);
    const comunasOptions = currentRegion ? currentRegion.comunas : [];

    return (
        <div className="p-4" style={{ backgroundColor: '#212529', borderRadius: '8px', color: 'white' }}>
            <form onSubmit={handleSubmit}>
                
                {/* Fila 1: ID, Nombre, Apellido */}
                <div className="row mb-3">
                    <div className="col-md-3 mb-3">
                        <label className="form-label">ID (Generado)</label>
                        <div className="form-control bg-secondary text-white border-secondary fw-bold">
                            {currentGeneratedId}
                        </div>
                    </div>
                    <div className="col-md-5 mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input type="text" className="form-control bg-dark text-white border-secondary" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4 mb-3">
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
                
                {/* Fila 3: Fecha, Región (JSON), Comuna (JSON) */}
                <div className="row mb-3">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="fecha" className="form-label">Fecha de Nacimiento</label>
                        <input type="date" className="form-control bg-dark text-white border-secondary" id="fecha" name="fecha" value={formData.fecha} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="region" className="form-label">Región</label>
                        <select className="form-select bg-dark text-white border-secondary" id="region" name="region" value={formData.region} onChange={handleRegionChange} required>
                            {/* RENDERIZADO DE REGIONES */}
                            {regionesArray.length === 0 ? (
                                <option value="" disabled>Cargando regiones...</option>
                            ) : (
                                regionesArray.map(r => (
                                    <option key={r.region} value={r.region}>{r.region}</option>
                                ))
                            )}
                        </select>
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="comuna" className="form-label">Comuna</label>
                        <select className="form-select bg-dark text-white border-secondary" id="comuna" name="comuna" value={formData.comuna} onChange={handleChange} required>
                             {/* RENDERIZADO DE COMUNAS DINÁMICO */}
                             {comunasOptions.length === 0 ? (
                                <option value="" disabled>Seleccione una región</option>
                            ) : (
                                comunasOptions.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))
                            )}
                        </select>
                    </div>
                </div>

                {/* Fila 4: Password, Rol */}
                <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input type="password" className="form-control bg-dark text-white border-secondary" id="password" name="password" value={formData.password} onChange={handleChange} required />
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

                {/* Botón de Envío */}
                <button type="submit" className="btn btn-primary w-100">
                    <i className="fas fa-user-plus me-2"></i> Registrar Nuevo Usuario
                </button>
                
            </form>
        </div>
    );
}

export default FormularioUsuarioNV;