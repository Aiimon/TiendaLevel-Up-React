import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import CategoriasContent from "./CategoriaContent"; // Ajusta la ruta si es necesario
import { beforeEach, describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

// --- Mock de datos de productos.json ---
// Simulamos la estructura necesaria para obtener categorías
const mockProductosD = {
  categorias: ["Juegos de Mesa", "Accesorios"], // Categorías iniciales del JSON
  productos: [
    { id: "P1", categoria: "Consolas", nombre: "Consola X" },
    { id: "P2", categoria: "Accesorios", nombre: "Mando Y" }, // Categoría repetida
    { id: "P3", categoria: "Teclados", nombre: "Teclado Z" }, // Categoría nueva (no en la lista inicial)
  ]
};
vi.mock('../data/productos.json', () => ({
  default: mockProductosD
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

// --- Mock de window.prompt y window.confirm ---
// Guardamos las implementaciones originales
const originalPrompt = window.prompt;
const originalConfirm = window.confirm;

beforeEach(() => {
  // Reseteamos mocks antes de cada test
  vi.clearAllMocks();
  localStorageMock.clear();
  // Restauramos mocks de prompt/confirm por defecto
  window.prompt = vi.fn();
  window.confirm = vi.fn(() => true); // Por defecto, simula 'Aceptar'
});

afterAll(() => {
  // Restauramos las funciones originales después de todos los tests
  window.prompt = originalPrompt;
  window.confirm = originalConfirm;
});
// --------------------------------------------

// --- Mock del componente Footer ---
// Si Footer es simple, podemos ignorarlo o hacer un mock básico
vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer-mock">Footer</div>
}));
// ---------------------------------

describe("Testing CategoriasContent Component", () => {

  // --- Caso de Prueba 1: Renderizado Inicial con Categorías ---
  it("CP-Categoria1: Renderiza títulos, botón y tabla con categorías iniciales", () => {
    // Simulamos que localStorage está vacío para que use el JSON
    localStorageMock.getItem.mockReturnValueOnce(null);
    render(<CategoriasContent />);

    // Verifica títulos
    expect(screen.getByRole('heading', { name: /Gestión de Categorías/i })).toBeInTheDocument();
    expect(screen.getByText(/Listado de categorías extraídas/i)).toBeInTheDocument();

    // Verifica botón "Nueva Categoría"
    expect(screen.getByRole('button', { name: /Nueva Categoría/i })).toBeInTheDocument();

    // Verifica que la tabla contenga las categorías únicas del JSON y los productos
    expect(screen.getByText("Juegos de Mesa")).toBeInTheDocument();
    expect(screen.getByText("Accesorios")).toBeInTheDocument();
    expect(screen.getByText("Consolas")).toBeInTheDocument();
    expect(screen.getByText("Teclados")).toBeInTheDocument();

    // Verifica que haya botones de Editar y Borrar para cada categoría
    const rows = screen.getAllByRole('row');
    // Hay 1 fila de encabezado + 4 filas de categorías = 5 filas
    expect(rows).toHaveLength(5);
    // Verificamos botones en la primera fila de datos (Juegos de Mesa)
    const firstDataRow = rows[1]; // Índice 1 porque 0 es el header
    expect(within(firstDataRow).getByRole('button', { name: /Editar/i })).toBeInTheDocument();
    expect(within(firstDataRow).getByRole('button', { name: /Eliminar/i })).toBeInTheDocument(); // Asumiendo que el nombre title se usa
  });

  // --- Caso de Prueba 2: Renderizado sin Categorías ---
  it("CP-Categoria2: Muestra mensaje 'No se encontraron categorías' si no hay datos", () => {
    // Simulamos que tanto el JSON como localStorage están vacíos
    vi.mock('../data/productos.json', () => ({ default: { categorias: [], productos: [] } }));
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([])); // localStorage con array vacío

    render(<CategoriasContent />);

    // Verifica el mensaje de tabla vacía
    expect(screen.getByText(/No se encontraron categorías/i)).toBeInTheDocument();

    // Verifica que no hay filas de datos en el tbody
    const tbody = screen.getByRole('table').querySelector('tbody');
    expect(tbody.querySelectorAll('tr').length).toBe(1); // Solo la fila del mensaje
  });

  // --- Caso de Prueba 3: Crear Nueva Categoría (Simulado) ---
  it("CP-Categoria3: Añade una nueva categoría a la tabla al usar 'Nueva Categoría'", async () => {
    // Simulamos la respuesta del prompt
    window.prompt = vi.fn(() => "Nueva Cat Test");

    render(<CategoriasContent />);
    const botonNuevo = screen.getByRole('button', { name: /Nueva Categoría/i });

    // Verifica que la nueva categoría no existe inicialmente
    expect(screen.queryByText("Nueva Cat Test")).not.toBeInTheDocument();

    // Clic en el botón
    fireEvent.click(botonNuevo);

    // Espera a que el estado se actualice y la tabla se re-renderice
    await waitFor(() => {
      expect(screen.getByText("Nueva Cat Test")).toBeInTheDocument();
    });

    // Verifica que prompt fue llamado
    expect(window.prompt).toHaveBeenCalledTimes(1);
    // Verifica que alert fue llamado (asumiendo que alert está disponible o mockeado globalmente si es necesario)
    // expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('agregada'));
  });

  // --- Caso de Prueba 4: Editar Categoría (Simulado) ---
  it("CP-Categoria4: Actualiza el nombre de una categoría en la tabla al usar 'Editar'", async () => {
    // Simulamos la respuesta del prompt de edición
    window.prompt = vi.fn(() => "Accesorios Editado");

    render(<CategoriasContent />);

    // Encuentra la fila de "Accesorios" y su botón Editar
    const categoriaRow = screen.getByText("Accesorios").closest('tr');
    const botonEditar = within(categoriaRow).getByRole('button', { name: /Editar/i });

    // Clic en editar
    fireEvent.click(botonEditar);

    // Espera a que el estado se actualice
    await waitFor(() => {
        // Verifica que el nombre antiguo ya no está
        expect(screen.queryByText("Accesorios")).not.toBeInTheDocument();
        // Verifica que el nuevo nombre SÍ está
        expect(screen.getByText("Accesorios Editado")).toBeInTheDocument();
    });

    // Verifica que prompt fue llamado con los argumentos correctos
    expect(window.prompt).toHaveBeenCalledWith(expect.stringContaining('Editar categoría: Accesorios'), 'Accesorios');
  });

  // --- Caso de Prueba 5: Borrar Categoría (Simulado) ---
  it("CP-Categoria5: Elimina una categoría de la tabla al usar 'Borrar'", async () => {
    // Simulamos que el usuario confirma la eliminación
    window.confirm = vi.fn(() => true);

    render(<CategoriasContent />);

    // Encuentra la fila de "Consolas" y su botón Borrar
    const categoriaRow = screen.getByText("Consolas").closest('tr');
    const botonBorrar = within(categoriaRow).getByRole('button', { name: /Eliminar/i });

    // Verifica que la categoría existe antes de borrar
    expect(screen.getByText("Consolas")).toBeInTheDocument();

    // Clic en borrar
    fireEvent.click(botonBorrar);

    // Espera a que el estado se actualice y la categoría desaparezca
    await waitFor(() => {
        expect(screen.queryByText("Consolas")).not.toBeInTheDocument();
    });

    // Verifica que confirm fue llamado
    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('eliminar la categoría "Consolas"'));
  });

  // --- Caso de Prueba 6: Cancelar Borrado ---
  it("CP-Categoria6: No elimina la categoría si el usuario cancela la confirmación", () => {
    // Simulamos que el usuario cancela
    window.confirm = vi.fn(() => false);

    render(<CategoriasContent />);
    const categoriaRow = screen.getByText("Teclados").closest('tr');
    const botonBorrar = within(categoriaRow).getByRole('button', { name: /Eliminar/i });

    fireEvent.click(botonBorrar);

    // Verifica que la categoría AÚN existe
    expect(screen.getByText("Teclados")).toBeInTheDocument();
    // Verifica que confirm fue llamado
    expect(window.confirm).toHaveBeenCalledTimes(1);
    // Verifica que el estado no se modificó (indirectamente, porque el elemento sigue ahí)
  });

});