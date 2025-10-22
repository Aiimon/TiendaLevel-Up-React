export default function Especificaciones({ detalles }) {
  if (!detalles || Object.keys(detalles).length === 0)
    return <p className="text-secondary">No hay especificaciones disponibles.</p>;

  return (
    <table className="table table-dark table-striped custom-table">
      <tbody>
        {Object.entries(detalles).map(([key, val]) => (
          <tr key={key}>
            <th>{key}</th>
            <td>{val}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
