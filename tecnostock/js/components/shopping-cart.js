import { dinero, crear } from "../utils.js";

export class CarritoCompras extends HTMLElement {
  set carrito(c) {
    this._c = c;
    this.pintar();
  }

  emitir(tipo, id) {
    this.dispatchEvent(new CustomEvent(tipo, { detail: { id }, bubbles: true, composed: true }));
  }

  pintar() {
    const filas = this._c.items.map(i => {
      const boton = (tipo, texto, accion) => {
        const b = crear("button", { type: "button", textContent: texto, "aria-label": `${accion} ${i.name}` });
        b.onclick = () => this.emitir(tipo, i.id);
        return b;
      };
      return crear("li", {},
        crear("span", {}, `${i.name} x${i.cantidad} - ${dinero(i.importe)}`),
        boton("carrito-disminuir", "-", "Disminuir"),
        boton("carrito-aumentar", "+", "Aumentar"),
        boton("carrito-quitar", "Eliminar", "Eliminar"));
    });
    this.replaceChildren(filas.length ? crear("ul", {}, ...filas) : crear("p", {}, "El carrito está vacío."));
  }
}

customElements.define("shopping-cart", CarritoCompras);
