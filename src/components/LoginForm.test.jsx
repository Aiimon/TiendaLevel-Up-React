import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginForm from "./LoginForm"; // Ajusta la ruta si es necesario
import { beforeEach, describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import CryptoJS from "crypto-js"; // Importamos para mockear
import { MemoryRouter, Route, Routes } from "react-router-dom"; // Para simular navigate

// --- Mocks de Librerías Externas ---
// Mockear CryptoJS
// Simulamos encriptar/desencriptar de forma simple para el test
const mockEncrypt = (data, secret) => `encrypted(${data},${secret})`;
const mockDecrypt = (encryptedData, secret) => {
    // Simulamos la desencriptación extrayendo los datos originales
    const match = encryptedData.match(/^encrypted\((.+),(.+)\)$/);
    if (match && match[2] === secret) {
        // Devolvemos un objeto similar al de CryptoJS para llamar a toString
        return { toString: () => match[1] };
    }
    throw new Error("Decryption failed"); // Simula fallo si la clave no coincide
};

vi.mock('crypto-js', () => ({
  default: {
    AES: {
      encrypt: vi.fn(mockEncrypt),
      decrypt: vi.fn(mockDecrypt),
    },
    enc: {
        Utf8: { // Necesario para bytesPass.toString(CryptoJS.enc.Utf8)
            stringify: (wordArray) => wordArray.toString(), // Simulación simple
            parse: (str) => ({ toString: () => str }) // Simulación simple
        }
    }
  }
}));

// Mockear datos de usuarios.json (sin encriptar)
const mockUsuariosD = [
  { nombre: "Admin", apellido: "Sistema", rut: "12345678K", email: "admin@test.com", password: "adminPassword", rol: "admin" /* otros datos */ },
  { nombre: "User", apellido: "Test", rut: "87654321K", email: "user@test.com", password: "userPassword", rol: "usuario" /* otros datos */ },
];
vi.mock('../data/usuarios.json', () => ({ default: mockUsuariosD }));
// ------------------------------------

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

// --- Mock de react-router-dom (useNavigate) ---
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});
// --------------------------------------------

describe("Testing LoginForm Component", () => {
  // --- Mocks de Props ---
  const mockOnClose = vi.fn();
  const mockOnUsuarioChange = vi.fn();
  const claveSecreta = "miClaveFijaParaAES"; // Usar la misma clave que en el componente

  // Función helper para renderizar con Router
  const renderComponent = () => {
     return render(
       <MemoryRouter>
            <LoginForm onClose={mockOnClose} onUsuarioChange={mockOnUsuarioChange} />
            {/* Ruta destino para la navegación */}
            <Routes>
                <Route path="/" element={<div>Página de Inicio</div>} />
            </Routes>
       </MemoryRouter>
     );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear(); // Limpia localStorage antes de cada test
    vi.useRealTimers(); // Asegurar timers reales por defecto
  });

  // --- Caso de Prueba 1: Renderizado Inicial e Inicialización de localStorage ---
  it("CP-Login1: Renderiza inputs y botón, e inicializa localStorage si está vacío", async () => {
    // localStorage está vacío al inicio
    expect(localStorageMock.getItem('usuarios')).toBeNull();

    renderComponent();

    // Verifica inputs y botón
    expect(screen.getByPlaceholderText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();

    // Esperar a que el useEffect termine
    await waitFor(() => {
        // Verifica que se llamó a setItem para inicializar usuarios
        expect(localStorageMock.setItem).toHaveBeenCalledWith('usuarios', expect.any(String));
        // Verifica que se llamó a encrypt para la inicialización
        expect(CryptoJS.AES.encrypt).toHaveBeenCalledTimes(mockUsuariosD.length * 2); // RUT y Password por cada usuario
        expect(CryptoJS.AES.encrypt).toHaveBeenCalledWith(mockUsuariosD[0].rut, claveSecreta);
        expect(CryptoJS.AES.encrypt).toHaveBeenCalledWith(mockUsuariosD[0].password, claveSecreta);
    });
  });

   // --- Caso de Prueba 2: No reinicializa localStorage si ya tiene datos ---
   it("CP-Login2: No llama a setItem si localStorage ya contiene 'usuarios'", async () => {
    // Pre-cargar localStorage
    localStorageMock.setItem('usuarios', JSON.stringify([{ email: 'preexistente@test.com' }]));

    renderComponent();

    // Esperar un ciclo para asegurar que useEffect podría haberse ejecutado
    await new Promise(resolve => setTimeout(resolve, 0));

    // Verifica que setItem NO fue llamado de nuevo (solo 1 vez en el pre-cargado)
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    // Verifica que encrypt NO fue llamado
    expect(CryptoJS.AES.encrypt).not.toHaveBeenCalled();
  });

  // --- Caso de Prueba 3: Validación en Tiempo Real ---
  it("CP-Login3: Muestra errores de validación en tiempo real", async () => {
    renderComponent();
    const emailInput = screen.getByPlaceholderText(/Correo electrónico/i);
    const passwordInput = screen.getByPlaceholderText(/Contraseña/i);

    // Email inválido
    fireEvent.change(emailInput, { target: { value: 'correo-mal' } });
    expect(await screen.findByText(/Correo inválido/i)).toBeInTheDocument();
    expect(emailInput).toHaveClass('is-invalid');

    // Email válido
    fireEvent.change(emailInput, { target: { value: 'correo@valido.com' } });
    await waitFor(() => expect(screen.queryByText(/Correo inválido/i)).not.toBeInTheDocument());
    expect(emailInput).toHaveClass('is-valid');

    // Password inválida
    fireEvent.change(passwordInput, { target: { value: '123' } });
    expect(await screen.findByText(/La contraseña debe tener al menos 6 caracteres/i)).toBeInTheDocument();
    expect(passwordInput).toHaveClass('is-invalid');

    // Password válida
    fireEvent.change(passwordInput, { target: { value: 'passwordValida' } });
    await waitFor(() => expect(screen.queryByText(/La contraseña debe tener al menos 6 caracteres/i)).not.toBeInTheDocument());
    expect(passwordInput).toHaveClass('is-valid');
  });

  // --- Caso de Prueba 4: Fallo al Enviar (Campos Vacíos/Inválidos) ---
  it("CP-Login4: Muestra alerta de error y no intenta login si los campos son inválidos al enviar", async () => {
    renderComponent();
    const emailInput = screen.getByPlaceholderText(/Correo electrónico/i);
    const submitButton = screen.getByRole('button', { name: /Entrar/i });

    // Email inválido al momento del submit
    fireEvent.change(emailInput, { target: { value: 'invalido' } });
    fireEvent.click(submitButton);

    // Esperar alerta
    await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/Por favor, ingresa un correo valido/i);
    });
    // Verifica que decrypt no fue llamado (no se intentó login)
    expect(CryptoJS.AES.decrypt).not.toHaveBeenCalled();
    expect(mockOnUsuarioChange).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // --- Caso de Prueba 5: Fallo al Enviar (Usuario No Encontrado) ---
  it("CP-Login5: Muestra alerta si el correo no está registrado", async () => {
     renderComponent(); // localStorage se inicializa aquí

     // Ingresar datos válidos pero con correo inexistente
     fireEvent.change(screen.getByPlaceholderText(/Correo electrónico/i), { target: { value: 'noexiste@test.com' } });
     fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: 'passwordValida' } });
     fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

     await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/Este correo no está registrado/i);
     });
     expect(CryptoJS.AES.decrypt).not.toHaveBeenCalled(); // No debe intentar desencriptar si no encuentra usuario
  });

  // --- Caso de Prueba 6: Fallo al Enviar (Contraseña Incorrecta) ---
  it("CP-Login6: Muestra alerta si la contraseña es incorrecta", async () => {
    renderComponent(); // Inicializa localStorage con usuarios encriptados

    // Ingresar correo correcto (admin) pero contraseña incorrecta
    fireEvent.change(screen.getByPlaceholderText(/Correo electrónico/i), { target: { value: 'admin@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: 'incorrecta' } });
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => {
        // Verifica que decrypt fue llamado para la contraseña
        expect(CryptoJS.AES.decrypt).toHaveBeenCalledWith(mockEncrypt(mockUsuariosD[0].password, claveSecreta), claveSecreta);
        // Verifica alerta
        expect(screen.getByRole('alert')).toHaveTextContent(/Contraseña incorrecta/i);
    });
     // Verifica que no se llamó a las funciones de éxito
     expect(mockOnUsuarioChange).not.toHaveBeenCalled();
     expect(mockOnClose).not.toHaveBeenCalled();
     expect(mockNavigate).not.toHaveBeenCalled();
  });

  // --- Caso de Prueba 7: Envío Exitoso ---
  it("CP-Login7: Guarda usuario, llama props, muestra éxito y navega con credenciales correctas", async () => {
    vi.useFakeTimers(); // Usar timers falsos para controlar setTimeout
    renderComponent(); // Inicializa localStorage

    // Ingresar credenciales correctas (admin)
    fireEvent.change(screen.getByPlaceholderText(/Correo electrónico/i), { target: { value: 'admin@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: 'adminPassword' } }); // Contraseña original sin encriptar
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => {
        // Verifica desencriptación de contraseña y RUT
        expect(CryptoJS.AES.decrypt).toHaveBeenCalledWith(mockEncrypt(mockUsuariosD[0].password, claveSecreta), claveSecreta);
        expect(CryptoJS.AES.decrypt).toHaveBeenCalledWith(mockEncrypt(mockUsuariosD[0].rut, claveSecreta), claveSecreta);

        // Verifica que se guardó el usuario logueado en localStorage (con RUT desencriptado)
        expect(localStorageMock.setItem).toHaveBeenCalledWith('usuario', expect.stringContaining('"rut":"12345678K"')); // Verifica RUT desencriptado

        // Verifica alerta de éxito
        expect(screen.getByRole('alert')).toHaveTextContent(/Bienvenido, Admin/i);

        // Verifica llamada a prop
        expect(mockOnUsuarioChange).toHaveBeenCalledTimes(1);
    });

    // Avanzar timer para el onClose y navigate
    vi.advanceTimersByTime(1100); // Avanza 1.1 segundos

    await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    vi.useRealTimers(); // Restaurar timers reales
  });

   // --- Caso de Prueba 8: Alerta Desaparece ---
   it("CP-Login8: La alerta de error desaparece después de 4 segundos", async () => {
    vi.useFakeTimers();
    renderComponent();

    // Forzar un error (usuario no encontrado)
    fireEvent.change(screen.getByPlaceholderText(/Correo electrónico/i), { target: { value: 'noexiste@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: 'passwordValida' } });
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    // Esperar a que aparezca la alerta
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Avanzar el tiempo
    vi.advanceTimersByTime(4100); // Más de 4 segundos

    // Esperar a que desaparezca la alerta
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    vi.useRealTimers();
  });

});