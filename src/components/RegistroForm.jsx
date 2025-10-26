import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import regionesData from "../data/regiones.json";

const claveSecreta = "miClaveFijaParaAES";

export default function RegistroForm({ onClose }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fecha, setFecha] = useState("");
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");
  const [telefono, setTelefono] = useState("");
  const [comunasDisponibles, setComunasDisponibles] = useState([]);

  // --- errores ---
  const [errores, setErrores] = useState({});

  // --- Actualizar comunas según región ---
  useEffect(() => {
    if (region) {
      const regionObj = regionesData.find(r => r.region === region);
      setComunasDisponibles(regionObj ? regionObj.comunas : []);
      setComuna("");
    }
  }, [region]);

  // --- Validaciones individuales ---
  const validarCampo = {
    nombre: val => val.trim() !== "" || "Debes ingresar tu nombre",
    apellido: val => val.trim() !== "" || "Debes ingresar tu apellido",
    rut: val => /^[0-9]{8}[0-9Kk]$/.test(val) || "RUT inválido (9 caracteres)",
    email: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || "Correo inválido",
    password: val => val.length >= 6 || "La contraseña debe tener al menos 6 caracteres",
    fecha: val => {
      if(!val) return "Debes ingresar tu fecha de nacimiento";
      const nacimiento = new Date(val);
      const hoy = new Date();
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
      return edad >= 18 || "Debes ser mayor de 18 años";
    },
    region: val => val !== "" || "Debes seleccionar una región",
    comuna: val => val !== "" || "Debes seleccionar una comuna",
    telefono: val => val.trim() !== "" || "Debes ingresar tu teléfono",
  };

  // --- Validación en tiempo real ---
  const handleChange = (campo, valor) => {
    const valid = validarCampo[campo](valor);
    setErrores(prev => ({ ...prev, [campo]: valid === true ? "" : valid }));

    // Actualizar estado
    switch(campo){
      case "nombre": setNombre(valor); break;
      case "apellido": setApellido(valor); break;
      case "rut": setRut(valor); break;
      case "email": setEmail(valor); break;
      case "password": setPassword(valor); break;
      case "fecha": setFecha(valor); break;
      case "region": setRegion(valor); break;
      case "comuna": setComuna(valor); break;
      case "telefono": setTelefono(valor); break;
    }
  };

  // --- Submit ---
  const handleSubmit = (e) => {
    e.preventDefault();

    let hayError = false;
    let nuevoErrores = {};
    Object.keys(validarCampo).forEach(campo => {
      const valor = { nombre, apellido, rut, email, password, fecha, region, comuna, telefono }[campo];
      const valid = validarCampo[campo](valor);
      if (valid !== true) {
        nuevoErrores[campo] = valid;
        hayError = true;
      }
    });
    if(hayError){
      setErrores(nuevoErrores);
      return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    if(usuarios.some(u => u.email === email)){
      setErrores(prev => ({ ...prev, email: "Este correo ya está registrado" }));
      return;
    }

    // Encriptar
    const rutEncriptado = CryptoJS.AES.encrypt(rut, claveSecreta).toString();
    const passwordEncriptada = CryptoJS.AES.encrypt(password, claveSecreta).toString();

    const nuevoUsuario = { nombre, apellido, rut: rutEncriptado, email, password: passwordEncriptada, fecha, region, comuna, telefono, esDuoc: email.endsWith("@duoc.cl"), rol: "usuario" };
    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Registro exitoso!");
    // reset
    setNombre(""); setApellido(""); setRut(""); setEmail(""); setPassword(""); setFecha(""); setRegion(""); setComuna(""); setTelefono("");
    setErrores({});
    onClose();
  };

  // --- Render ---
  return (
    <form onSubmit={handleSubmit} className="row g-3">

      {/** NOMBRE **/}
      <div className="col-md-6">
        <label className="form-label">Nombre</label>
        <input type="text" className={`form-control ${errores.nombre ? "is-invalid" : (nombre ? "is-valid" : "")}`} value={nombre} onChange={e => handleChange("nombre", e.target.value)} />
        {errores.nombre && <div className="text-danger">{errores.nombre}</div>}
      </div>

      {/** APELLIDO **/}
      <div className="col-md-6">
        <label className="form-label">Apellido</label>
        <input type="text" className={`form-control ${errores.apellido ? "is-invalid" : (apellido ? "is-valid" : "")}`} value={apellido} onChange={e => handleChange("apellido", e.target.value)} />
        {errores.apellido && <div className="text-danger">{errores.apellido}</div>}
      </div>

      {/** RUT **/}
      <div className="col-md-6">
        <label className="form-label">RUT</label>
        <input type="text" className={`form-control ${errores.rut ? "is-invalid" : (rut ? "is-valid" : "")}`} value={rut} onChange={e => handleChange("rut", e.target.value)} />
        {errores.rut && <div className="text-danger">{errores.rut}</div>}
      </div>

      {/** EMAIL **/}
      <div className="col-md-6">
        <label className="form-label">Correo</label>
        <input
          type="email"
          className={`form-control ${errores.email ? "is-invalid" : (email ? "is-valid" : "")}`}
          value={email}
          onChange={e => handleChange("email", e.target.value)}
        />
        {errores.email && <div className="text-danger">{errores.email}</div>}

        {/* Mensaje promocional debajo del correo */}
        <span className="form-hint">
          <i className="bi bi-gift-fill me-1"></i>Usa un correo <strong>@duoc.cl</strong> y obtén 20% de descuento.
        </span>
      </div>

      {/** REGIÓN **/}
      <div className="col-md-6">
        <label className="form-label">Región</label>
        <select className={`form-select ${errores.region ? "is-invalid" : (region ? "is-valid" : "")}`} value={region} onChange={e => handleChange("region", e.target.value)}>
          <option value="">Selecciona Región</option>
          {regionesData.map(r => <option key={r.region} value={r.region}>{r.region}</option>)}
        </select>
        {errores.region && <div className="text-danger">{errores.region}</div>}
      </div>

      {/** COMUNA **/}
      <div className="col-md-6">
        <label className="form-label">Comuna</label>
        <select className={`form-select ${errores.comuna ? "is-invalid" : (comuna ? "is-valid" : "")}`} value={comuna} onChange={e => handleChange("comuna", e.target.value)}>
          <option value="">Selecciona Comuna</option>
          {comunasDisponibles.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {errores.comuna && <div className="text-danger">{errores.comuna}</div>}
      </div>

      {/** TELEFONO **/}
      <div className="col-md-6">
        <label className="form-label">Teléfono</label>
        <input type="tel" className={`form-control ${errores.telefono ? "is-invalid" : (telefono ? "is-valid" : "")}`} value={telefono} onChange={e => handleChange("telefono", e.target.value)} />
        {errores.telefono && <div className="text-danger">{errores.telefono}</div>}
      </div>

      {/** PASSWORD **/}
      <div className="col-md-6">
        <label className="form-label">Contraseña</label>
        <input type="password" className={`form-control ${errores.password ? "is-invalid" : (password ? "is-valid" : "")}`} value={password} onChange={e => handleChange("password", e.target.value)} />
        {errores.password && <div className="text-danger">{errores.password}</div>}
      </div>

      {/** FECHA **/}
      <div className="col-md-6">
        <label className="form-label">Fecha de nacimiento</label>
        <input type="date" className={`form-control ${errores.fecha ? "is-invalid" : (fecha ? "is-valid" : "")}`} value={fecha} onChange={e => handleChange("fecha", e.target.value)} />
        {errores.fecha && <div className="text-danger">{errores.fecha}</div>}
      </div>

      <div className="col-12">
        <button type="submit" className="btn btn-accent w-100">Registrarme</button>
      </div>
    </form>
  );
}
