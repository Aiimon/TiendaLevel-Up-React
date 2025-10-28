import { fireEvent, render, screen } from "@testing-library/react";
import AgregarCarrito from "./AgregarCarrito"; // Asegúrate que la ruta sea correcta
import { beforeEach, describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom"; // Para usar matchers como toBeInTheDocument

describe("Testing AgregarCarrito Component", () => {
  // --- Mocks y Datos de Prueba ---
  const mockOnAgregar = vi.fn();
  const mockUsuarioNormal = { esDuoc: false };
  const mockUsuarioDuoc = { esDuoc: true };
  const stockInicial = 10;
  const precioProducto = 5000;

  // Limpiar mocks antes de cada prueba
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Caso de Prueba 1: Renderizado Inicial Correcto ---
  it("CP-AgregarCarrito1: Muestra stock, precio normal y cantidad inicial correctamente", () => {
    render(
      <AgregarCarrito
        stockInicial={stockInicial}
        onAgregar={mockOnAgregar}
        usuario={mockUsuarioNormal}
        precio={precioProducto}
      />
    );

    // Verifica el stock inicial
    expect(screen.getByText(/10 unidades disponibles/i)).toBeInTheDocument();
    // Verifica el precio normal
    expect(screen.getByText(/Precio normal - \$5,000/i)).toBeInTheDocument();
    // Verifica que el input de cantidad inicie en 1
    const cantidadInput = screen.getByLabelText(/Cantidad:/i);
    expect(cantidadInput).toHaveValue(1);
    // Verifica que el botón esté habilitado
    expect(screen.getByRole("button", { name: /Agregar al carrito/i })).toBeEnabled();
  });

  // --- Caso de Prueba 2: Muestra Descuento Duoc ---
  it("CP-AgregarCarrito2: Muestra mensaje de descuento si el usuario es Duoc", () => {
    render(
      <AgregarCarrito
        stockInicial={stockInicial}
        onAgregar={mockOnAgregar}
        usuario={mockUsuarioDuoc} // Usuario Duoc
        precio={precioProducto}
      />
    );

    // Verifica el mensaje de descuento
    expect(screen.getByText(/¡Descuento aplicado! - \$5,000/i)).toBeInTheDocument();
  });

   // --- Caso de Prueba 3: Llama a onAgregar al hacer clic ---
  it("CP-AgregarCarrito3: Llama a onAgregar con la cantidad correcta al hacer clic", () => {
    render(
      <AgregarCarrito
        stockInicial={stockInicial}
        onAgregar={mockOnAgregar}
        usuario={mockUsuarioNormal}
        precio={precioProducto}
      />
    );

    const cantidadInput = screen.getByLabelText(/Cantidad:/i);
    const agregarButton = screen.getByRole("button", { name: /Agregar al carrito/i });

    // Cambiar la cantidad a 3
    fireEvent.change(cantidadInput, { target: { value: '3' } });
    expect(cantidadInput).toHaveValue(3); // Verifica que el input cambió

    // Hacer clic en agregar
    fireEvent.click(agregarButton);

    // Verifica que onAgregar fue llamado una vez con la cantidad 3
    expect(mockOnAgregar).toHaveBeenCalledTimes(1);
    expect(mockOnAgregar).toHaveBeenCalledWith(3);

    // Verifica que la cantidad se resetea a 1 y el stock se actualiza visualmente
    expect(cantidadInput).toHaveValue(1);
    expect(screen.getByText(/7 unidades disponibles/i)).toBeInTheDocument();
  });

  // --- Caso de Prueba 4: Estado Agotado ---
  it("CP-AgregarCarrito4: Muestra 'Agotado' y deshabilita controles si stockInicial es 0", () => {
    render(
      <AgregarCarrito
        stockInicial={0} // Stock Agotado
        onAgregar={mockOnAgregar}
        usuario={mockUsuarioNormal}
        precio={precioProducto}
      />
    );

    // Verifica mensaje "Agotado"
    expect(screen.getByText(/Agotado/i)).toBeInTheDocument();
    // Verifica que el input está deshabilitado
    expect(screen.getByLabelText(/Cantidad:/i)).toBeDisabled();
    // Verifica que el botón está deshabilitado
    expect(screen.getByRole("button", { name: /Agregar al carrito/i })).toBeDisabled();
  });

   // --- Caso de Prueba 5: Límite de Cantidad por Stock ---
  it("CP-AgregarCarrito5: No permite seleccionar cantidad mayor al stock disponible", () => {
    render(
      <AgregarCarrito
        stockInicial={3} // Stock bajo
        onAgregar={mockOnAgregar}
        usuario={mockUsuarioNormal}
        precio={precioProducto}
      />
    );

    const cantidadInput = screen.getByLabelText(/Cantidad:/i);

    // Intentar poner una cantidad mayor al stock
    fireEvent.change(cantidadInput, { target: { value: '5' } });

    // Verifica que el valor se limita al stock máximo (3)
    expect(cantidadInput).toHaveValue(3);
  });
});