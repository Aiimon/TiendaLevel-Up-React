// src/components/LoginForm.test.jsx

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginForm from "./LoginForm"; // Ajusta la ruta si es necesario
import { beforeEach, describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import CryptoJS from "crypto-js"; // Importamos para mockear
import { MemoryRouter, Route, Routes } from "react-router-dom"; // Para simular navigate

// --- Mocks de Librerías Externas (CORREGIDO) ---

// 1. Define las funciones y datos para que EL TEST los use
const mockEncrypt = (data, secret) => `encrypted(${data},${secret})`;
const mockDecrypt = (encryptedData, secret) => {
    const match = encryptedData.match(/^encrypted\((.+),(.+)\)$/);
    if (match && match[2] === secret) {
        return { toString: () => match[1] };
    }
    throw new Error("Decryption failed");
};
const mockUsuariosData = [
  { nombre: "Admin", apellido: "Sistema", rut: "12345678K", email: "admin@test.com", password: "adminPassword", rol: "admin" },
  { nombre: "User", apellido: "Test", rut: "87654321K", email: "user@test.com", password: "userPassword", rol: "usuario" },
];

// 2. Mockea los módulos. Estas funciones se "elevan" (hoist)
// Deben contener sus propias definiciones (copia de las de arriba)
vi.mock('crypto-js', () => ({
  default: {
    AES: {
      encrypt: vi.fn((data, secret) => `encrypted(${data},${secret})`), // Definición interna
      decrypt: vi.fn((encryptedData, secret) => { // Definición interna
          const match = encryptedData.match(/^encrypted\((.+),(.+)\)$/);
          if (match && match[2] === secret) {
              return { toString: () => match[1] };
          }
          throw new Error("Decryption failed");
      }),
    },
    enc: {
        Utf8: { 
            stringify: (wordArray) => wordArray.toString(), 
            parse: (str) => ({ toString: () => str }) 
        }
    }
  }
}));
vi.mock('../data/usuarios.json', () => ({ 
    default: [ // El JSON es un array, así que el mock devuelve un array
        { nombre: "Admin", apellido: "Sistema", rut: "12345678K", email: "admin@test.com", password: "adminPassword", rol: "admin" },
        { nombre: "User", apellido: "Test", rut: "87654321K", email: "user@test.com", password: "userPassword", rol: "usuario" },
    ] 
}));
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
  const claveSecreta = "miClaveFijaParaAES"; 

  // Función helper para renderizar con Router
  const renderComponent = () => {
     return render(
       <MemoryRouter>
            <LoginForm onClose={mockOnClose} onUsuarioChange={mockOnUsuarioChange} />
            <Routes>
                <Route path="/" element={<div>Página de Inicio</div>} />
            </Routes>
       </MemoryRouter>
     );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear(); 
    vi.useRealTimers(); 
  });

  // --- Caso de Prueba 1: Renderizado Inicial e Inicialización de localStorage ---
  it("CP-Login1: Renderiza inputs y botón, e inicializa localStorage si está vacío", async () => {
    expect(localStorageMock.getItem('usuarios')).toBeNull();
    renderComponent();

    expect(screen.getByPlaceholderText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();

    await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('usuarios', expect.any(String));
        // Usamos la variable local del test para la verificación
        expect(CryptoJS.AES.encrypt).toHaveBeenCalledTimes(mockUsuariosData.length * 2); 
        expect(CryptoJS.AES.encrypt).toHaveBeenCalledWith(mockUsuariosData[0].rut, claveSecreta);
        expect(CryptoJS.AES.encrypt).toHaveBeenCalledWith(mockUsuariosData[0].password, claveSecreta);
    });
  });

   // --- Caso de Prueba 2: No reinicializa localStorage si ya tiene datos ---
   it("CP-Login2: No llama a setItem si localStorage ya contiene 'usuarios'", async () => {
    localStorageMock.setItem('usuarios', JSON.stringify([{ email: 'preexistente@test.com' }]));
    renderComponent();
    await new Promise(resolve => setTimeout(resolve, 0));

    // Solo la llamada del pre-cargado
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
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

    fireEvent.change(emailInput, { target: { value: 'invalido' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/Por favor, ingresa un correo valido/i);
    });
    expect(CryptoJS.AES.decrypt).not.toHaveBeenCalled();
    expect(mockOnUsuarioChange).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // --- Caso de Prueba 5: Fallo al Enviar (Usuario No Encontrado) ---
  it("CP-Login5: Muestra alerta si el correo no está registrado", async () => {
     renderComponent(); 
     await waitFor(() => expect(localStorageMock.setItem).toHaveBeenCalled()); // Espera inicialización

     fireEvent.change(screen.getByPlaceholderText(/Correo electrónico/i), { target: { value: 'noexiste@test.com' } });
     fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: 'passwordValida' } });
     fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

     await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/Este correo no está registrado/i);
     });
     expect(CryptoJS.AES.decrypt).not.toHaveBeenCalled(); 
  });

  // --- Caso de Prueba 6: Fallo al Enviar (Contraseña Incorrecta) ---
  it("CP-Login6: Muestra alerta si la contraseña es incorrecta", async () => {
    renderComponent(); 
    await waitFor(() => expect(localStorageMock.setItem).toHaveBeenCalled()); // Espera inicialización

    fireEvent.change(screen.getByPlaceholderText(/Correo electrónico/i), { target: { value: 'admin@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: 'incorrecta' } });
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => {
        expect(CryptoJS.AES.decrypt).toHaveBeenCalledWith(mockEncrypt(mockUsuariosData[0].password, claveSecreta), claveSecreta);
        expect(screen.getByRole('alert')).toHaveTextContent(/Contraseña incorrecta/i);
    });
     expect(mockOnUsuarioChange).not.toHaveBeenCalled();
     expect(mockOnClose).not.toHaveBeenCalled();
     expect(mockNavigate).not.toHaveBeenCalled();
  });

  // --- Caso de Prueba 7: Envío Exitoso ---
  it("CP-Login7: Guarda usuario, llama props, muestra éxito y navega con credenciales correctas", async () => {
    vi.useFakeTimers(); 
    renderComponent(); 
    await waitFor(() => expect(localStorageMock.setItem).toHaveBeenCalled()); // Espera inicialización

    fireEvent.change(screen.getByPlaceholderText(/Correo electrónico/i), { target: { value: 'admin@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: 'adminPassword' } }); 
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => {
        expect(CryptoJS.AES.decrypt).toHaveBeenCalledWith(mockEncrypt(mockUsuariosData[0].password, claveSecreta), claveSecreta);
        expect(CryptoJS.AES.decrypt).toHaveBeenCalledWith(mockEncrypt(mockUsuariosData[0].rut, claveSecreta), claveSecreta);
        expect(localStorageMock.setItem).toHaveBeenCalledWith('usuario', expect.stringContaining('"rut":"12345678K"')); 
        expect(screen.getByRole('alert')).toHaveTextContent(/Bienvenido, Admin/i);
        expect(mockOnUsuarioChange).toHaveBeenCalledTimes(1);
    });

    vi.advanceTimersByTime(1100); 

    await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    vi.useRealTimers(); 
  });

   // --- Caso de Prueba 8: Alerta Desaparece ---
   it("CP-Login8: La alerta de error desaparece después de 4 segundos", async () => {
    vi.useFakeTimers();
    renderComponent();
    await waitFor(() => expect(localStorageMock.setItem).toHaveBeenCalled()); // Espera inicialización

    fireEvent.change(screen.getByPlaceholderText(/Correo electrónico/i), { target: { value: 'noexiste@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: 'passwordValida' } });
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    vi.advanceTimersByTime(4100); 

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    vi.useRealTimers();
  });

});