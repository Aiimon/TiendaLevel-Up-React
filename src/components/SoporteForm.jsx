import { useState } from "react";

function SoporteForm({ usuario }) {
  const [tipo, setTipo] = useState("soporte");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [respuesta, setRespuesta] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!usuario) {
      setRespuesta("Debes iniciar sesión para enviar soporte.");
      return;
    }

    const email = usuario.email;

    let mensajesGlobal = JSON.parse(localStorage.getItem("mensajesSoporte")) || {};
    if (!mensajesGlobal[email]) mensajesGlobal[email] = [];

    mensajesGlobal[email].push({
      tipo,
      asunto,
      mensaje,
      fecha: new Date().toLocaleString(),
    });

    localStorage.setItem("mensajesSoporte", JSON.stringify(mensajesGlobal));

    setRespuesta("¡Tu mensaje ha sido enviado con éxito!");
    setAsunto("");
    setMensaje("");
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-dark p-4 rounded-3 border border-secondary-subtle mb-4"
      >
        <div className="mb-3">
          <label className="form-label">Tipo de Mensaje</label>
          <select
            className="form-select"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
          >
            <option value="soporte">Soporte Técnico</option>
            <option value="consulta">Consulta / Contacto General</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Asunto</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ej: Problema con producto o sugerencia"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mensaje</label>
          <textarea
            className="form-control"
            rows="5"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-accent">
          Enviar mensaje
        </button>
      </form>
      {respuesta && <div className="mt-3 text-success fw-bold">{respuesta}</div>}
    </>
  );
}

export default SoporteForm;