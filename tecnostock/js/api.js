const esValido = p =>
  p && Number.isInteger(p.id) && typeof p.name === "string" && typeof p.category === "string" &&
  typeof p.description === "string" && Number.isFinite(p.price) && p.price > 0 &&
  Number.isInteger(p.stock) && p.stock >= 0 && typeof p.active === "boolean";

export async function cargarProductos() {
  const respuesta = await fetch("data/products.json");
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  const datos = await respuesta.json();
  if (!Array.isArray(datos)) throw new Error("datos inválidos");
  const validos = datos.filter(esValido);
  if (datos.length && !validos.length) throw new Error("datos inválidos");
  return validos;
}
