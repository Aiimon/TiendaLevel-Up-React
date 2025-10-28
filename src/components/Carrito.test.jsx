import { fireEvent, render, screen } from "@testing-library/react";
import Carrito from "./Carrito"; // Ajusta la ruta si es necesario
import { beforeEach, describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

describe("Testing Carrito Component (Sidebar)", () => {
  // --- Mocks y Datos de Prueba ---
  const mockSetOpen = vi.fn(); // Mock para la función que cierra el sidebar

  // Limpiar mocks antes de cada prueba
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Caso de Prueba 1: Renderizado Inicial (Cerrado) ---
  it("CP-Carrito1: Renderiza el sidebar cerrado por defecto si open es false", () => {
    render(<Carrito open={false} setOpen={mockSetOpen} cantidad={0} />);

    // Buscamos el div principal del sidebar
    // Usamos querySelector porque puede no ser fácilmente accesible por roles
    const sidebarDiv = screen.getByText(/Carrito de compras/i).closest('.carrito-sidebar');

    // Verifica que el div exista
    expect(sidebarDiv).toBeInTheDocument();
    // Verifica que NO tenga la clase 'open'
    expect(sidebarDiv).not.toHaveClass('open');
  });

  // --- Caso de Prueba 2: Renderizado Abierto ---
  it("CP-Carrito2: Renderiza el sidebar abierto si open es true", () => {
    render(<Carrito open={true} setOpen={mockSetOpen} cantidad={0} />);

    // Buscamos el div principal del sidebar
    const sidebarDiv = screen.getByText(/Carrito de compras/i).closest('.carrito-sidebar');

    // Verifica que el div exista
    expect(sidebarDiv).toBeInTheDocument();
    // Verifica que SÍ tenga la clase 'open'
    expect(sidebarDiv).toHaveClass('open');
  });

  // --- Caso de Prueba 3: Mensaje Carrito Vacío ---
  it("CP-Carrito3: Muestra el mensaje 'Tu carrito está vacío' si cantidad es 0", () => {
    render(<Carrito open={true} setOpen={mockSetOpen} cantidad={0} />);

    // Verifica que el mensaje de vacío esté presente
    expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
    // Verifica que el mensaje con items NO esté presente
    expect(screen.queryByText(/Tienes \d+ item\(s\) en tu carrito/i)).not.toBeInTheDocument();
  });

  // --- Caso de Prueba 4: Mensaje Carrito con Items ---
  it("CP-Carrito4: Muestra el mensaje con la cantidad de items si cantidad > 0", () => {
    const cantidadItems = 3;
    render(<Carrito open={true} setOpen={mockSetOpen} cantidad={cantidadItems} />);

    // Verifica que el mensaje con items esté presente y muestre la cantidad correcta
    expect(screen.getByText(`Tienes ${cantidadItems} item(s) en tu carrito`)).toBeInTheDocument();
    // Verifica que el mensaje de vacío NO esté presente
    expect(screen.queryByText(/Tu carrito está vacío/i)).not.toBeInTheDocument();
  });

  // --- Caso de Prueba 5: Evento Botón Cerrar ---
  it("CP-Carrito5: Llama a setOpen(false) al hacer clic en el botón de cerrar", () => {
    render(<Carrito open={true} setOpen={mockSetOpen} cantidad={2} />);

    // Buscamos el botón de cerrar (podría necesitar un aria-label si btn-close no es suficiente)
    const closeButton = screen.getByRole('button', { name: /close/i }); // Asumiendo que tiene aria-label="Close" o similar
    
    // Si no lo encuentra por 'name', puedes usar querySelector
    // const closeButton = document.querySelector('.btn-close'); 
    
    expect(closeButton).toBeInTheDocument(); // Asegura que el botón existe

    // Simular clic en el botón de cerrar
    fireEvent.click(closeButton);

    // Verifica que la función mockSetOpen fue llamada una vez con 'false'
    expect(mockSetOpen).toHaveBeenCalledTimes(1);
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });
});