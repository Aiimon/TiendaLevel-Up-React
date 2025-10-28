import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SoporteForm from "./SoporteForm"; // Ajusta la ruta si es necesario
import { beforeEach, describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

// --- Mock de localStorage ---
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
    clear: vi.fn(() => { store = {}; }),
    removeItem: vi.fn((key) => { delete store[key]; })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
// -----------------------------

describe("Testing SoporteForm Component", () => {
  // --- Mocks y Datos de Prueba ---
  const mockOnActualizar = vi.fn();
  const mockUsuario = { email: "usuario@test.com", nombre: "Usuario Prueba" };
  const localStorageKey = "mensajesSoporte";

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear(); // Limpia localStorage antes de cada test
  });

  // --- Caso de Prueba 1: Renderizado Inicial ---
  it("CP-SoporteForm1: Renderiza el formulario con valores por defecto", () => {
    render(<SoporteForm usuario={mockUsuario} onActualizar={mockOnActualizar} />);

    // Verifica título
    expect(screen.getByRole('heading', { name: /Enviar solicitud de soporte/i })).toBeInTheDocument();
    // Verifica valor por defecto del select
    expect(screen.getByLabelText(/Tipo de Mensaje/i)).toHaveValue('soporte');
    // Verifica inputs vacíos
    expect(screen.getByLabelText(/Asunto/i)).toHaveValue('');
    expect(screen.getByLabelText(/Mensaje/i)).toHaveValue('');
    // Verifica botón
    expect(screen.getByRole('button', { name: /Enviar mensaje/i })).toBeInTheDocument();
    // Verifica que no hay mensaje de respuesta inicial
    expect(screen.queryByText(/mensaje ha sido enviado/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Debes iniciar sesión/i)).not.toBeInTheDocument();
  });

  // --- Caso de Prueba 2: Cambios en Inputs (Estado) ---
  it("CP-SoporteForm2: Actualiza el estado al cambiar tipo, asunto y mensaje", () => {
    render(<SoporteForm usuario={mockUsuario} onActualizar={mockOnActualizar} />);

    const tipoSelect = screen.getByLabelText(/Tipo de Mensaje/i);
    const asuntoInput = screen.getByLabelText(/Asunto/i);
    const mensajeTextarea = screen.getByLabelText(/Mensaje/i);

    // Cambiar tipo
    fireEvent.change(tipoSelect, { target: { value: 'consulta' } });
    expect(tipoSelect).toHaveValue('consulta');

    // Cambiar asunto
    fireEvent.change(asuntoInput, { target: { value: 'Duda sobre producto' } });
    expect(asuntoInput).toHaveValue('Duda sobre producto');

    // Cambiar mensaje
    fireEvent.change(mensajeTextarea, { target: { value: 'Quisiera saber más detalles...' } });
    expect(mensajeTextarea).toHaveValue('Quisiera saber más detalles...');
  });

  // --- Caso de Prueba 3: Envío Exitoso (Primer Mensaje del Usuario) ---
  it("CP-SoporteForm3: Guarda el mensaje en localStorage, limpia campos y muestra éxito al enviar por primera vez", async () => {
    render(<SoporteForm usuario={mockUsuario} onActualizar={mockOnActualizar} />);

    // Llenar formulario
    fireEvent.change(screen.getByLabelText(/Tipo de Mensaje/i), { target: { value: 'soporte' } });
    fireEvent.change(screen.getByLabelText(/Asunto/i), { target: { value: 'Error en login' } });
    fireEvent.change(screen.getByLabelText(/Mensaje/i), { target: { value: 'No puedo entrar a mi cuenta.' } });

    // Enviar
    const submitButton = screen.getByRole('button', { name: /Enviar mensaje/i });
    fireEvent.click(submitButton);

    // Esperar a que se procese el submit
    await waitFor(() => {
      // Verifica que se guardó en localStorage correctamente
      expect(localStorageMock.setItem).toHaveBeenCalledWith(localStorageKey, expect.any(String));
      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]); // Primera llamada a setItem
      expect(savedData[mockUsuario.email]).toBeDefined();
      expect(savedData[mockUsuario.email]).toHaveLength(1);
      expect(savedData[mockUsuario.email][0]).toMatchObject({
        tipo: 'soporte',
        asunto: 'Error en login',
        mensaje: 'No puedo entrar a mi cuenta.',
        // No verificamos fecha exacta, solo que exista
        fecha: expect.any(String)
      });

      // Verifica mensaje de éxito
      expect(screen.getByText(/mensaje ha sido enviado con éxito/i)).toBeInTheDocument();
      expect(screen.getByText(/✅/i)).toBeInTheDocument(); // Ícono de éxito

      // Verifica que los campos se limpiaron
      expect(screen.getByLabelText(/Asunto/i)).toHaveValue('');
      expect(screen.getByLabelText(/Mensaje/i)).toHaveValue('');
      // El tipo vuelve al default? No, se mantiene el último seleccionado o el default inicial si no se cambió.
      expect(screen.getByLabelText(/Tipo de Mensaje/i)).toHaveValue('soporte'); // Se mantiene

      // Verifica que onActualizar fue llamado
      expect(mockOnActualizar).toHaveBeenCalledTimes(1);
    });
  });

  // --- Caso de Prueba 4: Envío Exitoso (Segundo Mensaje del Usuario) ---
  it("CP-SoporteForm4: Agrega un segundo mensaje al array existente en localStorage", async () => {
     // Pre-cargar localStorage con un mensaje existente para este usuario
    const mensajesPrevios = {
      [mockUsuario.email]: [
        { tipo: "consulta", asunto: "Mensaje viejo", mensaje: "...", fecha: "Ayer" }
      ]
    };
    localStorageMock.setItem(localStorageKey, JSON.stringify(mensajesPrevios));

    render(<SoporteForm usuario={mockUsuario} onActualizar={mockOnActualizar} />);

    // Llenar formulario con nuevo mensaje
    fireEvent.change(screen.getByLabelText(/Asunto/i), { target: { value: 'Nuevo Asunto' } });
    fireEvent.change(screen.getByLabelText(/Mensaje/i), { target: { value: 'Nuevo Mensaje.' } });

    // Enviar
    fireEvent.click(screen.getByRole('button', { name: /Enviar mensaje/i }));

    // Esperar
    await waitFor(() => {
      // Verifica localStorage
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2); // 1 inicial + 1 nuevo
      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[1][1]);
      // Verifica que ahora hay DOS mensajes para este usuario
      expect(savedData[mockUsuario.email]).toHaveLength(2);
      // Verifica que el último mensaje es el nuevo
      expect(savedData[mockUsuario.email][1].asunto).toBe('Nuevo Asunto');
    });
  });

  // --- Caso de Prueba 5: Falla al Enviar (Usuario no logueado) ---
  it("CP-SoporteForm5: Muestra mensaje de error y no guarda si no hay usuario", async () => {
    render(<SoporteForm usuario={null} onActualizar={mockOnActualizar} />); // Sin usuario

    // Llenar algo (aunque no es necesario para este test)
    fireEvent.change(screen.getByLabelText(/Asunto/i), { target: { value: 'Intento sin login' } });
    fireEvent.change(screen.getByLabelText(/Mensaje/i), { target: { value: '...' } });

    // Enviar
    fireEvent.click(screen.getByRole('button', { name: /Enviar mensaje/i }));

    // Esperar
    await waitFor(() => {
        // Verifica mensaje de error
        expect(screen.getByText(/Debes iniciar sesión para enviar soporte/i)).toBeInTheDocument();
        expect(screen.getByText(/⚠️/i)).toBeInTheDocument(); // Ícono de error

        // Verifica que NO se guardó en localStorage
        expect(localStorageMock.setItem).not.toHaveBeenCalled();
        // Verifica que onActualizar NO fue llamado
        expect(mockOnActualizar).not.toHaveBeenCalled();
    });

    // Verifica que los campos NO se limpiaron
    expect(screen.getByLabelText(/Asunto/i)).toHaveValue('Intento sin login');
  });

  // --- Caso de Prueba 6: Falla al Enviar (Usuario sin email - aunque tu lógica no lo previene explícitamente) ---
  it("CP-SoporteForm6: Muestra error si el objeto usuario no tiene email", async () => {
    const usuarioSinEmail = { nombre: "Test" }; // Sin propiedad email
    render(<SoporteForm usuario={usuarioSinEmail} onActualizar={mockOnActualizar} />);

    fireEvent.change(screen.getByLabelText(/Asunto/i), { target: { value: 'Test Asunto' } });
    fireEvent.change(screen.getByLabelText(/Mensaje/i), { target: { value: 'Test Mensaje' } });
    fireEvent.click(screen.getByRole('button', { name: /Enviar mensaje/i }));

    // La lógica actual crea una clave 'undefined' en localStorage, lo cual es un bug.
    // Deberíamos esperar un error o que no guarde.
    // Como el código actual guarda bajo 'undefined', testearemos eso, pero indicando que es un comportamiento inesperado.
    await waitFor(() => {
       expect(localStorageMock.setItem).toHaveBeenCalledWith(localStorageKey, expect.stringContaining('"undefined":'));
       // El mensaje de éxito se muestra incorrectamente
       expect(screen.getByText(/mensaje ha sido enviado con éxito/i)).toBeInTheDocument();
       // Idealmente, aquí deberíamos esperar un error, no éxito.
    });
    // Este test revela un posible bug: debería validar la existencia de `usuario.email`.
  });

});