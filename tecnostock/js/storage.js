const CLAVE = "tecnostock-carrito";

export const guardarCarrito = lineas => {
  try { localStorage.setItem(CLAVE, JSON.stringify(lineas)); } catch {}
};

export const cargarCarrito = () => {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE));
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
};
