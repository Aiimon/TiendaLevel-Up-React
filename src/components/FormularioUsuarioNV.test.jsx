import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import FormularioUsuarioNV from "./FormularioUsuarioNV"; // Ajusta la ruta si es necesario
import { beforeEach, describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

// --- Mock de datos JSON ---
// Mock de usuarios.json (para inicialización y conteo de ID)
const mockUsuariosD = {
  usuarios: [
    { id: "U001", nombre: "Admin", apellido: "Sistema", email: "admin@test.com", /* otros datos */ },
  ]
};
vi.mock('../data/usuarios.json', () => ({ default: mockUsuariosD }));

// Mock de regiones.json
const mockRegionesD = [
  { region: 'Metropolitana', comunas: ['Santiago', 'Providencia'] },
  { region: 'Valparaíso', comunas: ['Viña del Mar', 'Quilpué'] }
];
vi.mock('../data/regiones.json', () => ({ default: mockRegionesD }));
// ----------------------------

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

// --- Mock de window.alert ---
window.alert = vi.fn();
// ----------------------------

describe("Testing FormularioUsuarioNV Component", () => {

  const localStorageKey = 'usuarios_maestro';

  // Función helper para llenar campos válidos
  const fillValidForm = async () => {
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/RUT/i), { target: { value: '11223344K' } }); // Válido (9 chars)
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@gmail.com' } });
    const fechaValida = new Date();
    fechaValida.setFullYear(fechaValida.getFullYear() - 20); // Mayor de 18
    fireEvent.change(screen.getByLabelText(/Fecha de Nacimiento/i), { target: { value: fechaValida.toISOString().split('T')[0] } });
    fireEvent.change(screen.getByLabelText(/Región/i), { target: { value: 'Metropolitana' } });
    // Esperar a que las comunas se carguen antes de seleccionar
    await waitFor(() => expect(screen.getByLabelText(/Comuna/i)).toHaveValue('Santiago'));
    fireEvent.change(screen.getByLabelText(/Comuna/i), { target: { value: 'Santiago' } });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '912345678' } }); // Válido (9 digits)
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password123' } }); // Válido (>=6 chars)
    fireEvent.change(screen.getByLabelText(/Rol/i), { target: { value: 'usuario' } });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    // Pre-carga localStorage con datos iniciales para asegurar conteo de ID
    localStorageMock.setItem(localStorageKey, JSON.stringify(mockUsuariosD.usuarios || []));
  });

  // --- Caso de Prueba 1: Renderizado Inicial ---
  it("CP-FormUserNV1: Renderiza formulario con valores por defecto y ID generado", () => {
    render(<FormularioUsuarioNV />);

    // Verifica campos vacíos o con default
    expect(screen.getByLabelText(/Nombre/i)).toHaveValue('');
    expect(screen.getByLabelText(/Apellido/i)).toHaveValue('');
    expect(screen.getByLabelText(/RUT/i)).toHaveValue('');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('');
    expect(screen.getByLabelText(/Fecha de Nacimiento/i)).toHaveValue('');
    expect(screen.getByLabelText(/Región/i)).toHaveValue('Metropolitana'); // Default region
    expect(screen.getByLabelText(/Comuna/i)).toHaveValue('Santiago'); // Default comuna
    expect(screen.getByLabelText(/Teléfono/i)).toHaveValue('');
    expect(screen.getByLabelText(/Contraseña/i)).toHaveValue('');
    expect(screen.getByLabelText(/Rol/i)).toHaveValue('admin'); // Primer rol en la lista

    // Verifica ID generado (U + conteo + 1) -> U002 porque ya existe U001
    expect(screen.getByText('U002')).toBeInTheDocument();

    // Verifica botón
    expect(screen.getByRole('button', { name: /Registrar Nuevo Usuario/i })).toBeInTheDocument();
  });

  // --- Caso de Prueba 2: Cambios en Inputs y Comunas Dinámicas ---
  it("CP-FormUserNV2: Actualiza estado formData y comunas al cambiar campos", async () => {
    render(<FormularioUsuarioNV />);

    const nombreInput = screen.getByLabelText(/Nombre/i);
    const regionSelect = screen.getByLabelText(/Región/i);
    const comunaSelect = screen.getByLabelText(/Comuna/i);
    const emailInput = screen.getByLabelText(/Email/i);

    // Cambiar nombre
    fireEvent.change(nombreInput, { target: { value: 'Jane' } });
    expect(nombreInput).toHaveValue('Jane');

    // Cambiar email a Duoc (verifica texto informativo)
    fireEvent.change(emailInput, { target: { value: 'jane@duoc.cl' } });
    expect(emailInput).toHaveValue('jane@duoc.cl');
    expect(screen.getByText(/Detectado \(Sí\)/i)).toBeInTheDocument();

    // Cambiar región a Valparaíso
    fireEvent.change(regionSelect, { target: { value: 'Valparaíso' } });
    expect(regionSelect).toHaveValue('Valparaíso');

    // Esperar a que las comunas se actualicen
    await waitFor(() => {
        expect(comunaSelect).toContainHTML('<option value="Viña del Mar">Viña del Mar</option>');
        expect(comunaSelect).not.toContainHTML('<option value="Santiago">Santiago</option>');
        expect(comunaSelect).toHaveValue('Viña del Mar'); // Se resetea a la primera comuna
    });
  });

  // --- Caso de Prueba 3: Envío Exitoso ---
  it("CP-FormUserNV3: Guarda el nuevo usuario en localStorage y limpia el formulario", async () => {
    render(<FormularioUsuarioNV />);

    await fillValidForm(); // Llena con datos válidos

    const submitButton = screen.getByRole('button', { name: /Registrar Nuevo Usuario/i });
    fireEvent.click(submitButton);

    // Esperar a que se procese el submit
    await waitFor(() => {
        // Verifica que se llamó a setItem con la lista actualizada
        expect(localStorageMock.setItem).toHaveBeenCalledWith(localStorageKey, expect.any(String));
        const savedData = JSON.parse(localStorageMock.setItem.mock.calls[1][1]); // [1] por la carga inicial

        // Verifica que el nuevo usuario (U002) está en la lista guardada
        expect(savedData).toHaveLength(mockUsuariosD.usuarios.length + 1); // 1 inicial + 1 nuevo = 2
        const nuevoUsuarioGuardado = savedData.find(u => u.id === 'U002');
        expect(nuevoUsuarioGuardado).toBeDefined();
        expect(nuevoUsuarioGuardado.nombre).toBe('Test');
        expect(nuevoUsuarioGuardado.apellido).toBe('User');
        expect(nuevoUsuarioGuardado.rut).toBe('11223344K'); // Sanitizado
        expect(nuevoUsuarioGuardado.email).toBe('test@gmail.com');
        expect(nuevoUsuarioGuardado.esDuoc).toBe(false); // Automático
        expect(nuevoUsuarioGuardado.rol).toBe('usuario');
        expect(nuevoUsuarioGuardado.region).toBe('Metropolitana');
        expect(nuevoUsuarioGuardado.comuna).toBe('Santiago');
        expect(nuevoUsuarioGuardado.telefono).toBe('912345678');

        // Verifica alerta de éxito
        expect(window.alert).toHaveBeenCalledWith('Usuario Test creado con ID U002.');

        // Verifica que el formulario se limpió
        expect(screen.getByLabelText(/Nombre/i)).toHaveValue('');
        expect(screen.getByLabelText(/RUT/i)).toHaveValue('');
        // El ID generado debería recalcularse a U003
        expect(screen.getByText('U003')).toBeInTheDocument();
    });
  });

  // --- Caso de Prueba 4: Fallo de Validación (Edad) ---
  it("CP-FormUserNV4: Muestra alerta y no guarda si el usuario es menor de 18", async () => {
    render(<FormularioUsuarioNV />);
    await fillValidForm(); // Llena con datos válidos

    // Poner fecha inválida (menor de edad)
    const fechaMenor = new Date();
    fechaMenor.setFullYear(fechaMenor.getFullYear() - 17);
    fireEvent.change(screen.getByLabelText(/Fecha de Nacimiento/i), { target: { value: fechaMenor.toISOString().split('T')[0] } });

    const submitButton = screen.getByRole('button', { name: /Registrar Nuevo Usuario/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('mayor de 18 años'));
        // Solo la inicialización de localStorage
        expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    });
    // Verifica que el formulario NO se limpió
    expect(screen.getByLabelText(/Nombre/i)).toHaveValue('Test');
  });

  // --- Caso de Prueba 5: Fallo de Validación (Email Dominio Inválido) ---
   it("CP-FormUserNV5: Muestra alerta si el dominio del email no es permitido", async () => {
    render(<FormularioUsuarioNV />);
    await fillValidForm();

    // Poner email inválido
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@otrodominio.com' } });

    const submitButton = screen.getByRole('button', { name: /Registrar Nuevo Usuario/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('dominio del correo debe ser uno de'));
        expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    });
  });

  // --- Caso de Prueba 6: Fallo de Validación (Teléfono Corto) ---
  it("CP-FormUserNV6: Muestra alerta si el teléfono tiene menos de 9 dígitos", async () => {
    render(<FormularioUsuarioNV />);
    await fillValidForm();

    // Poner teléfono inválido
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '123456' } });

    const submitButton = screen.getByRole('button', { name: /Registrar Nuevo Usuario/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Teléfono debe tener al menos 9 dígitos'));
        expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    });
  });

   // --- Caso de Prueba 7: Fallo de Envío (Email Duplicado) ---
   it("CP-FormUserNV7: Muestra alerta si el email ya está registrado", async () => {
    // El usuario inicial U001 tiene email 'admin@test.com'
    render(<FormularioUsuarioNV />);
    await fillValidForm(); // Llena con datos válidos

    // Poner email duplicado
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'admin@test.com' } });

    const submitButton = screen.getByRole('button', { name: /Registrar Nuevo Usuario/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('ya está registrado'));
        expect(localStorageMock.setItem).toHaveBeenCalledTimes(1); // Solo inicialización
    });
  });

});