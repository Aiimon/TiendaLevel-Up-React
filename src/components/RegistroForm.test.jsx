import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import RegistroForm from "./RegistroForm"; // Ajusta la ruta si es necesario
import { beforeEach, describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import CryptoJS from "crypto-js"; // Importamos para mockear
import Swal from "sweetalert2"; // Importamos para mockear

// --- Mocks de Librerías Externas ---
// Mockear CryptoJS
vi.mock('crypto-js', () => ({
  default: { // Importante: usar 'default' si la importación es `import CryptoJS from ...`
    AES: {
      encrypt: vi.fn((data, secret) => ({ toString: () => `encrypted(${data},${secret})` })), // Simula la encriptación
      // Puedes añadir decrypt si lo usaras
    },
    // Puedes añadir otros métodos de CryptoJS si los usaras
  }
}));

// Mockear SweetAlert2
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(() => Promise.resolve({ isConfirmed: true })), // Simula la confirmación del Swal
  }
}));

// Mockear datos de regiones (simplificado para el test)
vi.mock('../data/regiones.json', () => ([
  { region: 'Metropolitana', comunas: ['Santiago', 'Providencia'] },
  { region: 'Valparaíso', comunas: ['Viña del Mar', 'Quilpué'] }
]));

// --- Mock de localStorage ---
// Necesitamos simular localStorage para verificar guardado y lectura
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


describe("Testing RegistroForm Component", () => {
  // --- Mocks de Props ---
  const mockOnClose = vi.fn();
  const mockOnUsuarioChange = vi.fn();
  const mockAbrirLogin = vi.fn();

  // Limpiar mocks y localStorage antes de cada prueba
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear(); // Limpia el localStorage simulado
  });

  // --- Caso de Prueba 1: Renderizado Inicial ---
  it("CP-Registro1: Renderiza todos los campos del formulario y el botón de registro", () => {
    render(<RegistroForm onClose={mockOnClose} onUsuarioChange={mockOnUsuarioChange} abrirLogin={mockAbrirLogin} />);

    // Verifica campos principales
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/RUT/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fecha de nacimiento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Región/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Comuna/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument();
    // Verifica botón
    expect(screen.getByRole('button', { name: /Registrarme/i })).toBeInTheDocument();
  });

  // --- Caso de Prueba 2: Validación en Tiempo Real (Ejemplo con Email y Edad) ---
  it("CP-Registro2: Muestra y oculta mensajes de error en tiempo real", async () => {
    render(<RegistroForm onClose={mockOnClose} onUsuarioChange={mockOnUsuarioChange} abrirLogin={mockAbrirLogin} />);
    const emailInput = screen.getByLabelText(/Correo/i);
    const fechaInput = screen.getByLabelText(/Fecha de nacimiento/i);

    // Email inválido
    fireEvent.change(emailInput, { target: { value: 'correo-invalido' } });
    // Espera a que aparezca el mensaje de error (puede haber un pequeño delay por el estado)
    expect(await screen.findByText(/Correo inválido/i)).toBeInTheDocument();

    // Email válido
    fireEvent.change(emailInput, { target: { value: 'correo@valido.com' } });
    // Espera a que el mensaje de error desaparezca
    await waitFor(() => {
      expect(screen.queryByText(/Correo inválido/i)).not.toBeInTheDocument();
    });

    // Fecha inválida (menor de edad)
    const fechaMenor = new Date();
    fechaMenor.setFullYear(fechaMenor.getFullYear() - 17); // Hace 17 años
    fireEvent.change(fechaInput, { target: { value: fechaMenor.toISOString().split('T')[0] } });
    expect(await screen.findByText(/Debes ser mayor de 18 años/i)).toBeInTheDocument();

    // Fecha válida (mayor de edad)
    const fechaMayor = new Date();
    fechaMayor.setFullYear(fechaMayor.getFullYear() - 20); // Hace 20 años
    fireEvent.change(fechaInput, { target: { value: fechaMayor.toISOString().split('T')[0] } });
    await waitFor(() => {
      expect(screen.queryByText(/Debes ser mayor de 18 años/i)).not.toBeInTheDocument();
    });
  });

  // --- Caso de Prueba 3: Actualización Dinámica de Comunas ---
  it("CP-Registro3: Actualiza las comunas disponibles al cambiar la región", async () => {
    render(<RegistroForm onClose={mockOnClose} onUsuarioChange={mockOnUsuarioChange} abrirLogin={mockAbrirLogin} />);
    const regionSelect = screen.getByLabelText(/Región/i);
    const comunaSelect = screen.getByLabelText(/Comuna/i);

    // Estado inicial (basado en el mock de regiones)
    expect(comunaSelect).toContainHTML('<option value="Santiago">Santiago</option>');
    expect(comunaSelect).toContainHTML('<option value="Providencia">Providencia</option>');
    expect(comunaSelect).not.toContainHTML('<option value="Viña del Mar">Viña del Mar</option>'); // Comuna de otra región

    // Cambiar a Valparaíso
    fireEvent.change(regionSelect, { target: { value: 'Valparaíso' } });

    // Esperar a que las comunas se actualicen
    await waitFor(() => {
        expect(comunaSelect).toContainHTML('<option value="Viña del Mar">Viña del Mar</option>');
        expect(comunaSelect).toContainHTML('<option value="Quilpué">Quilpué</option>');
        expect(comunaSelect).not.toContainHTML('<option value="Santiago">Santiago</option>'); // Ya no debe estar
    });
     // Verifica que la comuna seleccionada se resetea (o va a la primera de la lista)
     expect(comunaSelect).toHaveValue("Viña del Mar"); // Asumiendo que es la primera comuna
  });

  // --- Caso de Prueba 4: Envío Exitoso ---
  it("CP-Registro4: Envía el formulario correctamente con datos válidos", async () => {
    render(<RegistroForm onClose={mockOnClose} onUsuarioChange={mockOnUsuarioChange} abrirLogin={mockAbrirLogin} />);

    // Llenar formulario con datos válidos
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'Perez' } });
    fireEvent.change(screen.getByLabelText(/RUT/i), { target: { value: '12345678K' } }); // 9 caracteres
    fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: 'juan@test.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password123' } });
    const fechaValida = new Date();
    fechaValida.setFullYear(fechaValida.getFullYear() - 25);
    fireEvent.change(screen.getByLabelText(/Fecha de nacimiento/i), { target: { value: fechaValida.toISOString().split('T')[0] } });
    fireEvent.change(screen.getByLabelText(/Región/i), { target: { value: 'Metropolitana' } });
    // Esperar y seleccionar comuna
     await waitFor(() => fireEvent.change(screen.getByLabelText(/Comuna/i), { target: { value: 'Santiago' } }));
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '987654321' } }); // 9 dígitos

    // Enviar formulario
    const submitButton = screen.getByRole('button', { name: /Registrarme/i });
    fireEvent.click(submitButton);

    // Esperar a que se completen las operaciones asíncronas (Swal)
    await waitFor(() => {
        // Verifica que se llamó a la encriptación (con los datos correctos)
        expect(CryptoJS.AES.encrypt).toHaveBeenCalledWith('12345678K', 'miClaveFijaParaAES');
        expect(CryptoJS.AES.encrypt).toHaveBeenCalledWith('password123', 'miClaveFijaParaAES');

        // Verifica que se guardó en localStorage
        expect(localStorageMock.setItem).toHaveBeenCalledWith('usuarios', expect.any(String)); // Verifica que se llamó
        // Podríamos parsear el valor guardado para más detalle si fuera necesario
        expect(localStorageMock.setItem).toHaveBeenCalledWith('usuario', expect.any(String)); // Verifica el usuario actual

        // Verifica que se llamaron las props
        expect(mockOnUsuarioChange).toHaveBeenCalledTimes(1);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
        expect(mockAbrirLogin).toHaveBeenCalledTimes(1);

        // Verifica que Swal fue llamado
        expect(Swal.fire).toHaveBeenCalledTimes(1);
        expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'success' }));
    });

     // Verifica que los campos se limpiaron (ejemplo con nombre y email)
     expect(screen.getByLabelText(/Nombre/i)).toHaveValue("");
     expect(screen.getByLabelText(/Correo/i)).toHaveValue("");
  });

   // --- Caso de Prueba 5: Falla al Enviar (Correo Duplicado) ---
   it("CP-Registro5: Muestra error si el correo ya está registrado", async () => {
    // Pre-cargar un usuario en localStorage
    const usuarioExistente = [{ email: 'existente@test.com', /* otros datos */ }];
    localStorageMock.setItem('usuarios', JSON.stringify(usuarioExistente));

    render(<RegistroForm onClose={mockOnClose} onUsuarioChange={mockOnUsuarioChange} abrirLogin={mockAbrirLogin} />);

    // Llenar formulario con datos válidos, pero email duplicado
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'Gomez' } });
    fireEvent.change(screen.getByLabelText(/RUT/i), { target: { value: '11223344K' } });
    fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: 'existente@test.com' } }); // Email duplicado
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password456' } });
    const fechaValida = new Date();
    fechaValida.setFullYear(fechaValida.getFullYear() - 30);
    fireEvent.change(screen.getByLabelText(/Fecha de nacimiento/i), { target: { value: fechaValida.toISOString().split('T')[0] } });
    fireEvent.change(screen.getByLabelText(/Región/i), { target: { value: 'Metropolitana' } });
    await waitFor(() => fireEvent.change(screen.getByLabelText(/Comuna/i), { target: { value: 'Providencia' } }));
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '912345678' } });

    // Enviar formulario
    const submitButton = screen.getByRole('button', { name: /Registrarme/i });
    fireEvent.click(submitButton);

    // Esperar a que aparezca el mensaje de error de correo duplicado
    expect(await screen.findByText(/Este correo ya está registrado/i)).toBeInTheDocument();

    // Verifica que NO se guardó nada nuevo y NO se llamaron las props de éxito
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1); // Solo la carga inicial
    expect(mockOnUsuarioChange).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(mockAbrirLogin).not.toHaveBeenCalled();
    expect(Swal.fire).not.toHaveBeenCalled();
  });

});