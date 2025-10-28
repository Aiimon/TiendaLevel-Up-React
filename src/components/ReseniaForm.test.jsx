import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ReseniaForm from "./ReseniaForm"; // Ajusta la ruta si es necesario
import { beforeEach, describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

describe("Testing ReseniaForm Component", () => {
  // --- Mocks y Datos de Prueba ---
  const mockOnAgregarReseña = vi.fn();
  const mockUsuarioLogueado = { nombre: "Juan Test", email: "juan@test.com" };
  const mockUsuarioSinNombre = { email: "anon@test.com" }; // Para probar fallback de nombre

  // Limpiar mocks antes de cada prueba
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers(); // Asegurar timers reales por defecto
  });

  // --- Caso de Prueba 1: Renderizado Inicial (Usuario Logueado) ---
  it("CP-ReseniaForm1: Renderiza formulario habilitado con datos de usuario y rating por defecto", () => {
    render(<ReseniaForm usuario={mockUsuarioLogueado} onAgregarReseña={mockOnAgregarReseña} />);

    // Verifica nombre de usuario en input deshabilitado
    expect(screen.getByPlaceholderText(mockUsuarioLogueado.nombre)).toBeDisabled();
    // Verifica placeholder del textarea para usuario logueado
    expect(screen.getByPlaceholderText(/Escribe tu reseña/i)).toBeInTheDocument();
    // Verifica que el textarea esté habilitado
    expect(screen.getByPlaceholderText(/Escribe tu reseña/i)).toBeEnabled();
    // Verifica rating inicial (5 estrellas seleccionadas)
    const estrellas = screen.getAllByRole('button', { name: /★/ }); // Busca spans con role="button"
    expect(estrellas).toHaveLength(5);
    estrellas.forEach(estrella => {
      expect(estrella).toHaveStyle('color: rgb(255, 215, 0)'); // #FFD700
    });
    // Verifica que el botón Enviar esté habilitado
    expect(screen.getByRole('button', { name: /Enviar reseña/i })).toBeEnabled();
  });

  // --- Caso de Prueba 2: Renderizado Inicial (Usuario NO Logueado) ---
  it("CP-ReseniaForm2: Renderiza formulario deshabilitado si no hay usuario", () => {
    render(<ReseniaForm usuario={null} onAgregarReseña={mockOnAgregarReseña} />);

    // Verifica placeholders indicando que se necesita iniciar sesión
    expect(screen.getByPlaceholderText(/Debes iniciar sesión/i)).toBeDisabled();
    expect(screen.getByPlaceholderText(/Inicia sesión para escribir una reseña/i)).toBeInTheDocument();
    // Verifica que el textarea esté deshabilitado (o no exista, dependiendo de tu lógica)
    // En este caso, el textarea existe pero podría estar deshabilitado o solo tener placeholder
    // Vamos a verificar que el botón Enviar esté deshabilitado
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
    const estrellas = screen.getAllByRole('button', { name: /★/ }); // Son spans con role button

    // Simular hover sobre la 3ra estrella
    fireEvent.mouseEnter(estrellas[2]); // Índice 2 es la 3ra estrella
    // Las primeras 3 deberían estar amarillas, las últimas 2 grises
    expect(estrellas[0]).toHaveStyle('color: rgb(255, 215, 0)');
    expect(estrellas[1]).toHaveStyle('color: rgb(255, 215, 0)');
    expect(estrellas[2]).toHaveStyle('color: rgb(255, 215, 0)');
    expect(estrellas[3]).toHaveStyle('color: rgb(85, 85, 85)'); // #555
    expect(estrellas[4]).toHaveStyle('color: rgb(85, 85, 85)');

    // Simular quitar el hover
    fireEvent.mouseLeave(estrellas[2]);
    // Todas deberían volver al estado inicial (5 estrellas, porque no hicimos clic)
    estrellas.forEach(estrella => {
      expect(estrella).toHaveStyle('color: rgb(255, 215, 0)');
    });

    // Simular clic en la 2da estrella
    fireEvent.click(estrellas[1]); // Índice 1 es la 2da estrella
    // Las primeras 2 deberían estar amarillas, las últimas 3 grises
    expect(estrellas[0]).toHaveStyle('color: rgb(255, 215, 0)');
    expect(estrellas[1]).toHaveStyle('color: rgb(255, 215, 0)');
    expect(estrellas[2]).toHaveStyle('color: rgb(85, 85, 85)');
    expect(estrellas[3]).toHaveStyle('color: rgb(85, 85, 85)');
    expect(estrellas[4]).toHaveStyle('color: rgb(85, 85, 85)');
  });

  // --- Caso de Prueba 5: Envío Exitoso ---
  it("CP-ReseniaForm5: Llama a onAgregarReseña, limpia el formulario y muestra mensaje de éxito al enviar", async () => {
    vi.useFakeTimers(); // Usar timers falsos para controlar setTimeout
    render(<ReseniaForm usuario={mockUsuarioLogueado} onAgregarReseña={mockOnAgregarReseña} />);
    const textarea = screen.getByPlaceholderText(/Escribe tu reseña/i);
    const estrellas = screen.getAllByRole('button', { name: /★/ });
    const submitButton = screen.getByRole('button', { name: /Enviar reseña/i });

    // Llenar datos
    fireEvent.change(textarea, { target: { value: 'Buena reseña' } });
    fireEvent.click(estrellas[3]); // Selecciona 4 estrellas

    // Enviar
    fireEvent.click(submitButton);

    // Esperar a que se procese el submit
    await waitFor(() => {
        // Verifica que onAgregarReseña fue llamado con los datos correctos
        expect(mockOnAgregarReseña).toHaveBeenCalledTimes(1);
        expect(mockOnAgregarReseña).toHaveBeenCalledWith({
          nombre: mockUsuarioLogueado.nombre,
          email: mockUsuarioLogueado.email,
          texto: 'Buena reseña',
          rating: 4, // El rating que seleccionamos
        });

        // Verifica que el formulario se limpió
        expect(textarea).toHaveValue('');
        // Verifica que el rating volvió a 5 estrellas
        estrellas.forEach(estrella => {
          expect(estrella).toHaveStyle('color: rgb(255, 215, 0)');
        });

        // Verifica que se muestra el mensaje de éxito
        expect(screen.getByText(/Reseña enviada correctamente/i)).toBeInTheDocument();
        expect(screen.getByText(/✅/i)).toBeInTheDocument(); // Verifica icono
    });

    // Avanzar el tiempo para que el mensaje desaparezca
    vi.advanceTimersByTime(4000); // Avanza 4 segundos (más de los 3500ms del timeout)

    await waitFor(() => {
        // Verifica que el mensaje ya no está visible
        expect(screen.queryByText(/Reseña enviada correctamente/i)).not.toBeInTheDocument();
    });

    vi.useRealTimers(); // Restaurar timers reales
  });

  // --- Caso de Prueba 6: Fallo Envío (No Logueado) ---
  it("CP-ReseniaForm6: Muestra error y no llama a onAgregarReseña si el usuario no está logueado", async () => {
    vi.useFakeTimers();
    render(<ReseniaForm usuario={null} onAgregarReseña={mockOnAgregarReseña} />);
    const submitButton = screen.getByRole('button', { name: /Enviar reseña/i });

    // Intentar enviar (aunque el botón está deshabilitado, probamos el handler por si acaso)
    fireEvent.click(submitButton);

    // Esperar a que aparezca el mensaje de error
    await waitFor(() => {
        expect(screen.getByText(/Debes iniciar sesión para enviar una reseña/i)).toBeInTheDocument();
        expect(screen.getByText(/⚠️/i)).toBeInTheDocument();
    });

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

    // Asegurarse que el textarea está vacío
    expect(textarea).toHaveValue('');

    // Intentar enviar
    fireEvent.click(submitButton);

    // Esperar mensaje de error
    await waitFor(() => {
        expect(screen.getByText(/Escribe algo antes de enviar tu reseña/i)).toBeInTheDocument();
    });

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

     // Llenar texto
     fireEvent.change(textarea, { target: { value: 'Reseña anónima' } });
     // Enviar
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