import { useState } from "react";

function ReseniaForm({ usuario, onAgregarReseña }) {
  const [texto, setTexto] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);

  const enviarReseña = () => {
    if (!usuario) return alert("Debes iniciar sesión");
    if (!texto.trim()) return alert("Escribe algo");

    const nueva = { nombre: usuario.nombre, email: usuario.email, texto, rating, fecha: new Date() };
    onAgregarReseña(nueva);

    setTexto("");
    setRating(5);
    setHover(0);
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
        <div style={{ fontSize: 20 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              style={{ cursor: "pointer", color: n <= (hover || rating) ? "#FFD700" : "#555" }}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(n)}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <button className="btn btn-accent w-100" onClick={enviarReseña}>
        Enviar reseña
      </button>
    </div>
  );
}

export default ReseniaForm;
