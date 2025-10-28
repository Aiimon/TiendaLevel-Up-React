import { render, screen, waitFor } from "@testing-library/react";
import ProteccionUser from "./ProteccionUser"; // Ajusta la ruta si es necesario
import { beforeEach, describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom"; // Necesario para testear Navigate

// --- Mock de window.alert ---
// Espiamos la función alert original para verificar llamadas
const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {}); // Mockea para que no muestre alertas reales
// ----------------------------

// --- Componente Helper para mostrar la ruta actual ---
// Nos ayuda a verificar si la navegación ocurrió
const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
};
// ----------------------------------------------------

describe("Testing ProteccionUser Component", () => {
  // --- Datos de Prueba ---
  const mockUsuarioLogueado = { email: "test@ejemplo.com", nombre: "Usuario Test" };
  const ContenidoHijo = () => <div data-testid="contenido-hijo">Contenido Protegido</div>;

  beforeEach(() => {
    vi.clearAllMocks(); // Limpia el espía de alert y otros mocks
  });

  // --- Caso de Prueba 1: Usuario Logueado ---
  it("CP-ProteccionUser1: Renderiza los children si el usuario está logueado", () => {
    render(
      <MemoryRouter>
        <ProteccionUser usuario={mockUsuarioLogueado}>
          <ContenidoHijo />
        </ProteccionUser>
      </MemoryRouter>
    );

    // Verifica que el contenido hijo se renderiza
    expect(screen.getByTestId("contenido-hijo")).toBeInTheDocument();
    // Verifica que la alerta NO fue llamada
    expect(alertSpy).not.toHaveBeenCalled();
    // Verifica que NO se redirigió (opcional, comprobando que no estamos en /auth)
    // No podemos verificar directamente Navigate, pero sí que el contenido está.
  });

  // --- Caso de Prueba 2: Usuario NO Logueado (Primera Vez) ---
  it("CP-ProteccionUser2: No renderiza children, muestra alerta (una vez) y redirige a /auth si no hay usuario", async () => {
     render(
       <MemoryRouter initialEntries={['/ruta-protegida']}>
         <Routes>
           <Route path="/ruta-protegida" element={
             <ProteccionUser usuario={null}>
               <ContenidoHijo />
             </ProteccionUser>
           } />
           {/* Ruta destino de la redirección */}
           <Route path="/auth" element={<LocationDisplay />} />
         </Routes>
       </MemoryRouter>
     );

     // Esperar a que el useEffect se ejecute después del montaje
     await waitFor(() => {
        // Verifica que la alerta FUE llamada
        expect(alertSpy).toHaveBeenCalledTimes(1);
        expect(alertSpy).toHaveBeenCalledWith("Debes iniciar sesión para acceder a esta sección.");
     });

    // Verifica que el contenido hijo NO se renderiza
    expect(screen.queryByTestId("contenido-hijo")).not.toBeInTheDocument();

    // Verifica que se redirigió a /auth
    expect(screen.getByTestId('location-display')).toHaveTextContent('/auth');
  });

   // --- Caso de Prueba 3: Usuario NO Logueado (Re-render) ---
   it("CP-ProteccionUser3: No muestra la alerta de nuevo si el componente se re-renderiza sin usuario", async () => {
     // Render inicial sin usuario
     const { rerender } = render(
       <MemoryRouter initialEntries={['/ruta-protegida']}>
         <Routes>
           <Route path="/ruta-protegida" element={
             <ProteccionUser usuario={null}>
               <ContenidoHijo />
             </ProteccionUser>
           } />
           <Route path="/auth" element={<LocationDisplay />} />
         </Routes>
       </MemoryRouter>
     );

     // Esperar la primera alerta
     await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledTimes(1);
     });

     // Limpiar el mock para la siguiente verificación
     alertSpy.mockClear();

     // Re-renderizar el componente, todavía sin usuario
     rerender(
       <MemoryRouter initialEntries={['/ruta-protegida']}>
         <Routes>
           <Route path="/ruta-protegida" element={
             <ProteccionUser usuario={null}>
               <ContenidoHijo />
             </ProteccionUser>
           } />
           <Route path="/auth" element={<LocationDisplay />} />
         </Routes>
       </MemoryRouter>
     );

      // Esperar un ciclo de renderizado (aunque useEffect no debería dispararse de nuevo por el ref)
      // Usamos un pequeño delay para estar seguros
      await new Promise(resolve => setTimeout(resolve, 0));

     // Verificar que la alerta NO fue llamada de nuevo gracias al useRef
     expect(alertSpy).not.toHaveBeenCalled();
      // Todavía deberíamos estar redirigidos
     expect(screen.getByTestId('location-display')).toHaveTextContent('/auth');
   });

   // --- Caso de Prueba 4: Cambio de Estado (Logout a Login) ---
   it("CP-ProteccionUser4: Renderiza children si el usuario cambia de null a logueado", () => {
     // Render inicial sin usuario
     const { rerender } = render(
       <MemoryRouter initialEntries={['/ruta-protegida']}>
         <Routes>
           <Route path="/ruta-protegida" element={
             <ProteccionUser usuario={null}>
               <ContenidoHijo />
             </ProteccionUser>
           } />
           <Route path="/auth" element={<LocationDisplay />} />
         </Routes>
       </MemoryRouter>
     );

     // Verifica redirección inicial
     expect(screen.getByTestId('location-display')).toHaveTextContent('/auth');
     expect(screen.queryByTestId("contenido-hijo")).not.toBeInTheDocument();

     // Re-renderizar CON usuario
     rerender(
       <MemoryRouter initialEntries={['/ruta-protegida']}>
         <Routes>
           <Route path="/ruta-protegida" element={
             <ProteccionUser usuario={mockUsuarioLogueado}>
               <ContenidoHijo />
             </ProteccionUser>
           } />
           <Route path="/auth" element={<div>Auth Page</div>} /> {/* Solo para que la ruta exista */}
         </Routes>
       </MemoryRouter>
     );

     // Ahora debería renderizar los children
     expect(screen.getByTestId("contenido-hijo")).toBeInTheDocument();
     // Y no debería estar en la página /auth
     expect(screen.queryByTestId('location-display')).not.toBeInTheDocument();
   });

});