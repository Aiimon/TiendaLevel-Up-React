import { useState } from "react";

export default function ReseñaForm({ usuario, onAgregarReseña }) {
  const [texto, setTexto] = useState("");
  const [rating, setRating] = useState(5);

  const enviarReseña = () => {
    if (!usuario) return alert("Debes iniciar sesión");
    if (!texto.trim()) return alert("Escribe algo");

    const nueva = { nombre: usuario.nombre, email: usuario.email, texto, rating, fecha: new Date() };
    onAgregarReseña(nueva);
    setTexto("");
    setRating(5);
  };

  return (
    <div className="card bg-dark p-3 rounded mb-4">
      <h5 className="orbitron mb-3">Escribe tu reseña</h5>
      <input className="form-control mb-2" value={usuario?.nombre || ""} disabled />
      <textarea
        className="form-control mb-2"
        rows="3"
        placeholder="Escribe tu reseña"
        value={texto}
        onChange={e => setTexto(e.target.value)}
      />
      <div className="mb-2 d-flex align-items-center gap-2">
        <label className="text-secondary mb-0">Puntaje:</label>
        <span
          className="text-warning"
          style={{ cursor: "pointer", userSelect: "none" }}
          onClick={e => {
            const width = e.currentTarget.clientWidth / 5;
            const nuevoRating = Math.ceil(e.nativeEvent.offsetX / width);
            setRating(nuevoRating);
          }}
        >
          {"★".repeat(rating) + "☆".repeat(5 - rating)}
        </span>
      </div>
      <button className="btn btn-accent w-100" onClick={enviarReseña}>
        Enviar reseña
      </button>
    </div>
  );
}
