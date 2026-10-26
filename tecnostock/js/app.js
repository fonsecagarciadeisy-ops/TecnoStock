import { cargarProductos } from "./api.js";
import { Carrito } from "./cart.js";
import { cargarCarrito, guardarCarrito } from "./storage.js";
import { dinero, crear } from "./utils.js";
import "./components/product-list.js";
import "./components/shopping-cart.js";

const $ = id => document.getElementById(id);
let productos = [];
let carrito = new Carrito([]);

const avisar = (texto, esError = false) => {
  $("mensaje").textContent = (esError ? "Error: " : "") + texto;
  $("mensaje").className = esError ? "error" : "ok";
};

const pintarCatalogo = () => {
  const texto = $("buscar").value.trim().toLowerCase();
  const categoria = $("categoria").value;
  const orden = $("orden").value;
  const lista = productos
    .filter(p =>
      (!texto || `${p.name} ${p.description}`.toLowerCase().includes(texto)) &&
      (!categoria || p.category === categoria) &&
      (!$("soloDisponibles").checked || (p.active && p.stock > 0)))
    .sort((a, b) => (orden === "asc" ? a.price - b.price : orden === "desc" ? b.price - a.price : 0));
  $("lista").productos = lista;
  $("vacio").hidden = lista.length > 0;
};

const pintarCarrito = () => {
  const { subtotal, descuento, total } = carrito.totales;
  $("carrito").carrito = carrito;
  $("unidades").textContent = carrito.unidades;
  $("subtotal").textContent = dinero(subtotal);
  $("descuento").textContent = dinero(descuento);
  $("total").textContent = dinero(total);
  guardarCarrito(carrito.datos);
};

const aplicar = resultado => {
  resultado.ok ? avisar("Carrito actualizado.") : avisar(resultado.mensaje, true);
  pintarCarrito();
};

document.addEventListener("agregar-al-carrito", e => aplicar(carrito.cambiar(e.detail.id, 1)));
document.addEventListener("carrito-aumentar", e => aplicar(carrito.cambiar(e.detail.id, 1)));
document.addEventListener("carrito-disminuir", e => aplicar(carrito.cambiar(e.detail.id, -1)));
document.addEventListener("carrito-quitar", e => {
  carrito.quitar(e.detail.id);
  aplicar({ ok: true });
});

$("filtros").addEventListener("input", pintarCatalogo);
$("filtros").onsubmit = e => e.preventDefault();
$("limpiarFiltros").onclick = () => {
  $("filtros").reset();
  pintarCatalogo();
};

$("vaciar").onclick = () => {
  carrito.vaciar();
  aplicar({ ok: true });
};

$("confirmar").onclick = () => {
  const resultado = carrito.confirmar();
  if (!resultado.ok) return avisar(resultado.mensaje, true);
  const p = resultado.pedido;
  $("confirmacion").replaceChildren(
    crear("h3", {}, `Pedido ${p.id} confirmado`),
    crear("ul", {}, ...p.items.map(i => crear("li", {}, `${i.name} x${i.cantidad}: ${dinero(i.importe)}`))),
    crear("p", {}, `Subtotal ${dinero(p.subtotal)} | Descuento ${dinero(p.descuento)} | Total ${dinero(p.total)}`)
  );
  avisar("Pedido confirmado. No se realizó ningún pago real.");
  pintarCarrito();
};

(async () => {
  $("carrito").carrito = carrito;
  $("estado").textContent = "Cargando catálogo...";
  try {
    productos = await cargarProductos();
    $("categoria").append(...[...new Set(productos.map(p => p.category))].map(c => new Option(c, c)));
    carrito = new Carrito(productos, cargarCarrito());
    $("estado").textContent = "";
    pintarCatalogo();
    pintarCarrito();
  } catch (err) {
    $("estado").textContent = `Error: no se pudo cargar el catálogo (${err.message}). Recarga la página para reintentar.`;
    $("estado").className = "error";
  }
})();
