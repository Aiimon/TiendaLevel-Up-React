// src/components/ReseniaForm.test.jsx

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ReseniaForm from "./ReseniaForm"; // Ajusta la ruta si es necesario
import { beforeEach, describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

describe("Testing ReseniaForm Component", () => {
  // --- Mocks y Datos de Prueba ---
  const mockOnAgregarReseña = vi.fn();
  const mockUsuarioLogueado = { nombre: "Juan Test", email: "juan@test.com" };
  const mockUsuarioSinNombre = { email: "anon@test.com" };

  // Limpiar mocks antes de cada prueba
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers(); // Asegurar timers reales por defecto
  });

  // --- Caso de Prueba 1: Renderizado Inicial (Usuario Logueado) ---
  it("CP-ReseniaForm1: Renderiza formulario habilitado con datos de usuario y rating por defecto", () => {
    render(<ReseniaForm usuario={mockUsuarioLogueado} onAgregarReseña={mockOnAgregarReseña} />);

    // Verifica nombre de usuario en input deshabilitado (CORREGIDO: usa getByDisplayValue)
    expect(screen.getByDisplayValue(mockUsuarioLogueado.nombre)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUsuarioLogueado.nombre)).toBeDisabled();

    // Verifica placeholder del textarea para usuario logueado
    expect(screen.getByPlaceholderText(/Escribe tu reseña/i)).toBeInTheDocument();
    // Verifica que el textarea esté habilitado
    expect(screen.getByPlaceholderText(/Escribe tu reseña/i)).toBeEnabled();
    // Verifica rating inicial (5 estrellas seleccionadas)
    const estrellas = screen.getAllByRole('button', { name: /★/ });
    expect(estrellas).toHaveLength(5);
    estrellas.forEach(estrella => {
      // Usamos expresión regular para ignorar espacios extra en el string de color
      expect(estrella).toHaveStyle(/color:\s*rgb\(255,\s*215,\s*0\)/); // #FFD700
    });
    // Verifica que el botón Enviar esté habilitado
    expect(screen.getByRole('button', { name: /Enviar reseña/i })).toBeEnabled();
  });

  // --- Caso de Prueba 2: Renderizado Inicial (Usuario NO Logueado) ---
  it("CP-ReseniaForm2: Renderiza formulario deshabilitado si no hay usuario", () => {
    render(<ReseniaForm usuario={null} onAgregarReseña={mockOnAgregarReseña} />);

    // Verifica placeholders indicando que se necesita iniciar sesión
    expect(screen.getByPlaceholderText(/Debes iniciar sesión/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Debes iniciar sesión/i)).toBeDisabled();
    expect(screen.getByPlaceholderText(/Inicia sesión para escribir una reseña/i)).toBeInTheDocument();

    // Verifica que el botón Enviar esté deshabilitado
    expect(screen.getByRole('button', { name: /Enviar reseña/i })).toBeDisabled();
    // Verifica que las estrellas no tengan cursor pointer
    const estrellas = screen.getAllByRole('button', { name: /★/ });
    expect(estrellas[0]).toHaveStyle('cursor: not-allowed');
  });

  // --- Caso de Prueba 3: Escribir en Textarea (Estado) ---
  it("CP-ReseniaForm3: Actualiza el estado 'texto' al escribir en el textarea", () => {
    render(<ReseniaForm usuario={mockUsuarioLogueado} onAgregarReseña={mockOnAgregarReseña} />);
    const textarea = screen.getByPlaceholderText(/Escribe tu reseña/i);

    fireEvent.change(textarea, { target: { value: '¡Excelente producto!' } });
    expect(textarea).toHaveValue('¡Excelente producto!');
  });

  // --- Caso de Prueba 4: Selección de Rating (Estado y Eventos) ---
  it("CP-ReseniaForm4: Actualiza el estado 'rating' y 'hover' al interactuar con las estrellas", () => {
    render(<ReseniaForm usuario={mockUsuarioLogueado} onAgregarReseña={mockOnAgregarReseña} />);
    const estrellas = screen.getAllByRole('button', { name: /★/ });

    // Simular hover sobre la 3ra estrella
    fireEvent.mouseEnter(estrellas[2]);
    expect(estrellas[0]).toHaveStyle(/color:\s*rgb\(255,\s*215,\s*0\)/);
    expect(estrellas[1]).toHaveStyle(/color:\s*rgb\(255,\s*215,\s*0\)/);
    expect(estrellas[2]).toHaveStyle(/color:\s*rgb\(255,\s*215,\s*0\)/);
    expect(estrellas[3]).toHaveStyle(/color:\s*rgb\(85,\s*85,\s*85\)/); // #555
    expect(estrellas[4]).toHaveStyle(/color:\s*rgb\(85,\s*85,\s*85\)/);

    // Simular quitar el hover
    fireEvent.mouseLeave(estrellas[2]);
    // Todas deberían volver al estado inicial (5 estrellas)
    estrellas.forEach(estrella => {
      expect(estrella).toHaveStyle(/color:\s*rgb\(255,\s*215,\s*0\)/);
    });

    // Simular clic en la 2da estrella
    fireEvent.click(estrellas[1]);
    expect(estrellas[0]).toHaveStyle(/color:\s*rgb\(255,\s*215,\s*0\)/);
    expect(estrellas[1]).toHaveStyle(/color:\s*rgb\(255,\s*215,\s*0\)/);
    expect(estrellas[2]).toHaveStyle(/color:\s*rgb\(85,\s*85,\s*85\)/);
    expect(estrellas[3]).toHaveStyle(/color:\s*rgb\(85,\s*85,\s*85\)/);
    expect(estrellas[4]).toHaveStyle(/color:\s*rgb\(85,\s*85,\s*85\)/);
  });

  // --- Caso de Prueba 5: Envío Exitoso ---
  it("CP-ReseniaForm5: Llama a onAgregarReseña, limpia el formulario y muestra mensaje de éxito al enviar", async () => {
    vi.useFakeTimers();
    render(<ReseniaForm usuario={mockUsuarioLogueado} onAgregarReseña={mockOnAgregarReseña} />);
    const textarea = screen.getByPlaceholderText(/Escribe tu reseña/i);
    const estrellas = screen.getAllByRole('button', { name: /★/ });
    const submitButton = screen.getByRole('button', { name: /Enviar reseña/i });

    fireEvent.change(textarea, { target: { value: 'Buena reseña' } });
    fireEvent.click(estrellas[3]); // 4 estrellas

    fireEvent.click(submitButton);

    // Esperar a que se procese el submit Y APAREZCA el mensaje
    await screen.findByText(/Reseña enviada correctamente/i);

    // Verifica que onAgregarReseña fue llamado
    expect(mockOnAgregarReseña).toHaveBeenCalledTimes(1);
    expect(mockOnAgregarReseña).toHaveBeenCalledWith({
      nombre: mockUsuarioLogueado.nombre,
      email: mockUsuarioLogueado.email,
      texto: 'Buena reseña',
      rating: 4,
    });

    // Verifica limpieza del formulario
    expect(textarea).toHaveValue('');
    estrellas.forEach(estrella => {
      expect(estrella).toHaveStyle(/color:\s*rgb\(255,\s*215,\s*0\)/); // Vuelve a 5
    });
    expect(screen.getByText(/✅/i)).toBeInTheDocument();

    // Avanzar el tiempo para que el mensaje desaparezca
    vi.advanceTimersByTime(4000);

    // Esperar a que el mensaje DESAPAREZCA
    await waitFor(() => {
      expect(screen.queryByText(/Reseña enviada correctamente/i)).not.toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  // --- Caso de Prueba 6: Fallo Envío (No Logueado) ---
  it("CP-ReseniaForm6: Muestra error y no llama a onAgregarReseña si el usuario no está logueado", async () => {
    vi.useFakeTimers();
    render(<ReseniaForm usuario={null} onAgregarReseña={mockOnAgregarReseña} />);
    const submitButton = screen.getByRole('button', { name: /Enviar reseña/i });

    // Intentar enviar
    fireEvent.click(submitButton);

    // Esperar mensaje de error
    await screen.findByText(/Debes iniciar sesión para enviar una reseña/i);
    expect(screen.getByText(/⚠️/i)).toBeInTheDocument();

    // Verifica que onAgregarReseña NO fue llamado
    expect(mockOnAgregarReseña).not.toHaveBeenCalled();

    // Avanzar el tiempo y verificar que el mensaje desaparece
    vi.advanceTimersByTime(4000);
    await waitFor(() => {
      expect(screen.queryByText(/Debes iniciar sesión/i)).not.toBeInTheDocument();
    });
    vi.useRealTimers();
  });

  // --- Caso de Prueba 7: Fallo Envío (Texto Vacío) ---
  it("CP-ReseniaForm7: Muestra error y no llama a onAgregarReseña si el texto está vacío", async () => {
    vi.useFakeTimers();
    render(<ReseniaForm usuario={mockUsuarioLogueado} onAgregarReseña={mockOnAgregarReseña} />);
    const submitButton = screen.getByRole('button', { name: /Enviar reseña/i });
    const textarea = screen.getByPlaceholderText(/Escribe tu reseña/i);

    expect(textarea).toHaveValue(''); // Asegura que está vacío
    fireEvent.click(submitButton);

    // Esperar mensaje de error
    await screen.findByText(/Escribe algo antes de enviar tu reseña/i);

    // Verifica que onAgregarReseña NO fue llamado
    expect(mockOnAgregarReseña).not.toHaveBeenCalled();

    // Avanzar tiempo y verificar desaparición del mensaje
    vi.advanceTimersByTime(4000);
     await waitFor(() => {
       expect(screen.queryByText(/Escribe algo antes/i)).not.toBeInTheDocument();
     });
    vi.useRealTimers();
  });

  // --- Caso de Prueba 8: Usa email como nombre si el nombre falta ---
  it("CP-ReseniaForm8: Usa el email del usuario como nombre si la propiedad 'nombre' no existe", async () => {
     render(<ReseniaForm usuario={mockUsuarioSinNombre} onAgregarReseña={mockOnAgregarReseña} />);
     const textarea = screen.getByPlaceholderText(/Escribe tu reseña/i);
     const submitButton = screen.getByRole('button', { name: /Enviar reseña/i });

     fireEvent.change(textarea, { target: { value: 'Reseña anónima' } });
     fireEvent.click(submitButton);

     await waitFor(() => {
        // Verifica que onAgregarReseña fue llamado usando el email como nombre
        expect(mockOnAgregarReseña).toHaveBeenCalledWith(expect.objectContaining({
          nombre: mockUsuarioSinNombre.email, // Debe usar el email
          email: mockUsuarioSinNombre.email,
          texto: 'Reseña anónima',
          rating: 5, // Rating por defecto
        }));
     });
  });

});