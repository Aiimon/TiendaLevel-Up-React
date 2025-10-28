import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import FormularioProductoNV from "./FormularioProductoNV"; // Ajusta la ruta si es necesario
import { beforeEach, describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

// --- Mock de datos JSON ---
// Simulamos la estructura necesaria para obtener categorías y productos iniciales
const mockProductosD = {
  categorias: ["Juegos de Mesa", "Accesorios"],
  productos: [
    { id: "JM001", categoria: "Juegos de Mesa", nombre: "Catan", /* ...otros datos... */ stock: 10 },
    { id: "AC001", categoria: "Accesorios", nombre: "Mando", /* ...otros datos... */ stock: 5 },
  ]
};
vi.mock('../data/productos.json', () => ({ default: mockProductosD }));
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


describe("Testing FormularioProductoNV Component", () => {

  const localStorageKey = 'productos_maestro';

  // Función helper para llenar campos comunes del formulario
  const fillForm = () => {
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Nuevo Juego' } });
    fireEvent.change(screen.getByLabelText(/Categoría/i), { target: { value: 'Juegos de Mesa' } });
    fireEvent.change(screen.getByLabelText(/Precio/i), { target: { value: '15000' } });
    fireEvent.change(screen.getByLabelText(/Stock Inicial/i), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText(/Stock Crítico/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Detalles \(Formato JSON/i), { target: { value: '{"Editorial":"Devir"}' } });
    // Otros campos opcionales pueden dejarse vacíos o llenarse según el test
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    // Asegura que localStorage se inicialice con datos mock para cada test
    // Esto es importante para la generación de ID
    localStorageMock.setItem(localStorageKey, JSON.stringify(mockProductosD.productos));
  });

  // --- Caso de Prueba 1: Renderizado Inicial ---
  it("CP-FormProdNV1: Renderiza el formulario con valores iniciales y el ID generado", () => {
    render(<FormularioProductoNV />);

    // Verifica campos principales vacíos o con default
    expect(screen.getByLabelText(/Nombre/i)).toHaveValue('');
    expect(screen.getByLabelText(/Categoría/i)).toHaveValue('Juegos de Mesa'); // Default category
    expect(screen.getByLabelText(/Precio/i)).toHaveValue(null);
    expect(screen.getByLabelText(/Stock Inicial/i)).toHaveValue(null);
    expect(screen.getByLabelText(/Stock Crítico/i)).toHaveValue(5); // Default stockCritico
    expect(screen.getByLabelText(/Detalles \(Formato JSON/i)).toHaveValue('{}'); // Default detalles

    // Verifica que el ID generado se muestre (basado en categoría default y conteo inicial)
    // JM (Juegos de Mesa) ya tiene 1 producto (JM001), así que el siguiente debe ser JM002
    expect(screen.getByText('JM002')).toBeInTheDocument();

    // Verifica botón de envío
    expect(screen.getByRole('button', { name: /Crear Nuevo Producto/i })).toBeInTheDocument();
  });

  // --- Caso de Prueba 2: Cambios en Inputs y Actualización de Estado/ID ---
  it("CP-FormProdNV2: Actualiza el estado formData y el ID generado al cambiar la categoría y otros campos", () => {
    render(<FormularioProductoNV />);

    const nombreInput = screen.getByLabelText(/Nombre/i);
    const categoriaSelect = screen.getByLabelText(/Categoría/i);
    const stockInput = screen.getByLabelText(/Stock Inicial/i);

    // Cambiar nombre
    fireEvent.change(nombreInput, { target: { value: 'Nuevo Accesorio' } });
    expect(nombreInput).toHaveValue('Nuevo Accesorio');

    // Cambiar categoría a "Accesorios"
    fireEvent.change(categoriaSelect, { target: { value: 'Accesorios' } });
    expect(categoriaSelect).toHaveValue('Accesorios');

    // Cambiar stock (esto NO debería cambiar el ID mostrado, solo el conteo interno al guardar)
    fireEvent.change(stockInput, { target: { value: '50' } });
    expect(stockInput).toHaveValue(50);

    // Verifica que el ID generado se actualizó basado en la nueva categoría "Accesorios"
    // Accesorios (AC) ya tiene 1 producto (AC001), el siguiente debe ser AC002
    expect(screen.getByText('AC002')).toBeInTheDocument();
  });

  // --- Caso de Prueba 3: Envío Exitoso ---
  it("CP-FormProdNV3: Guarda el nuevo producto en localStorage y limpia el formulario al enviar con datos válidos", async () => {
    render(<FormularioProductoNV />);

    fillForm(); // Llena el formulario con datos válidos

    const submitButton = screen.getByRole('button', { name: /Crear Nuevo Producto/i });
    fireEvent.click(submitButton);

    // Esperar a que se procese el submit
    await waitFor(() => {
        // Verifica que se llamó a setItem con la lista actualizada
        expect(localStorageMock.setItem).toHaveBeenCalledWith(localStorageKey, expect.any(String));
        const savedData = JSON.parse(localStorageMock.setItem.mock.calls[1][1]); // [1] porque el primero es la inicialización
        // Verifica que el nuevo producto (JM002) está en la lista guardada
        expect(savedData).toHaveLength(mockProductosD.productos.length + 1); // 2 iniciales + 1 nuevo = 3
        const nuevoProductoGuardado = savedData.find(p => p.id === 'JM002');
        expect(nuevoProductoGuardado).toBeDefined();
        expect(nuevoProductoGuardado.nombre).toBe('Nuevo Juego');
        expect(nuevoProductoGuardado.precio).toBe(15000);
        expect(nuevoProductoGuardado.stock).toBe(25);
        expect(nuevoProductoGuardado.stockCritico).toBe(10);
        expect(nuevoProductoGuardado.detalles).toEqual({ Editorial: "Devir" });

        // Verifica alerta de éxito
        expect(window.alert).toHaveBeenCalledWith('Producto "Nuevo Juego" (ID: JM002) creado y guardado.');

        // Verifica que el formulario se limpió
        expect(screen.getByLabelText(/Nombre/i)).toHaveValue('');
        expect(screen.getByLabelText(/Precio/i)).toHaveValue(null);
        expect(screen.getByLabelText(/Stock Inicial/i)).toHaveValue(null);
        // La categoría vuelve al default
        expect(screen.getByLabelText(/Categoría/i)).toHaveValue('Juegos de Mesa');
        // El ID generado debería recalcularse basado en el estado limpio
        expect(screen.getByText('JM003')).toBeInTheDocument(); // Ahora JM003 porque JM002 ya existe
    });
  });

  // --- Caso de Prueba 4: Fallo de Validación (Precio Inválido) ---
  it("CP-FormProdNV4: Muestra alerta y no guarda si el precio es inválido (cero o negativo)", async () => {
    render(<FormularioProductoNV />);

    fillForm(); // Llena con datos válidos primero
    // Poner precio inválido
    fireEvent.change(screen.getByLabelText(/Precio/i), { target: { value: '0' } });

    // Enviar formulario
    const submitButton = screen.getByRole('button', { name: /Crear Nuevo Producto/i });
    fireEvent.click(submitButton);

    // Esperar (no debería haber cambios asíncronos grandes)
    await waitFor(() => {
        // Verifica alerta de validación
        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Precio debe ser un número positivo mayor a cero'));
        // Verifica que NO se llamó a setItem por segunda vez (solo en la inicialización)
        expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    });
    // Verifica que el formulario NO se limpió
    expect(screen.getByLabelText(/Nombre/i)).toHaveValue('Nuevo Juego');
  });

  // --- Caso de Prueba 5: Fallo de Validación (JSON Inválido) ---
   it("CP-FormProdNV5: Muestra alerta y no guarda si el JSON de detalles es inválido", async () => {
    render(<FormularioProductoNV />);

    fillForm(); // Llena con datos válidos primero
    // Poner JSON inválido
    fireEvent.change(screen.getByLabelText(/Detalles \(Formato JSON/i), { target: { value: '{"Marca":"Roto"' } }); // Falta llave

    // Enviar formulario
    const submitButton = screen.getByRole('button', { name: /Crear Nuevo Producto/i });
    fireEvent.click(submitButton);

    // Esperar
    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Detalles (JSON)\' no tiene un formato JSON válido'));
        expect(localStorageMock.setItem).toHaveBeenCalledTimes(1); // Solo inicialización
    });
     // Verifica que el formulario NO se limpió
     expect(screen.getByLabelText(/Nombre/i)).toHaveValue('Nuevo Juego');
  });

   // --- Caso de Prueba 6: Fallo de Envío (ID Duplicado - aunque poco probable) ---
   it("CP-FormProdNV6: Muestra alerta si el ID generado ya existe", async () => {
    // Forzamos que el ID JM002 ya exista (además del JM001 inicial)
    const productosConDuplicado = [
        ...mockProductosD.productos,
        { id: "JM002", categoria: "Juegos de Mesa", nombre: "Otro Juego", stock: 5 }
    ];
    localStorageMock.setItem(localStorageKey, JSON.stringify(productosConDuplicado));

    render(<FormularioProductoNV />);

    // Llenamos el formulario para que genere JM002 de nuevo
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Juego Repetido' } });
    fireEvent.change(screen.getByLabelText(/Categoría/i), { target: { value: 'Juegos de Mesa' } });
    fireEvent.change(screen.getByLabelText(/Precio/i), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText(/Stock Inicial/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Stock Crítico/i), { target: { value: '1' } });

    // Enviar formulario
    const submitButton = screen.getByRole('button', { name: /Crear Nuevo Producto/i });
    fireEvent.click(submitButton);

    // Esperar
    await waitFor(() => {
        // Verifica alerta de ID duplicado
        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('ID generado ("JM002") ya existe'));
        // Verifica que no se guardó nada nuevo (setItem solo se llamó una vez al inicio)
        expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    });
     // Verifica que el formulario NO se limpió
     expect(screen.getByLabelText(/Nombre/i)).toHaveValue('Juego Repetido');
  });

});