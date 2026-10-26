import { dinero, crear } from "../utils.js";

export class TarjetaProducto extends HTMLElement {
  set producto(p) {
    this._p = p;
    this.pintar();
  }

  pintar() {
    const p = this._p;
    const disponible = p.active && p.stock > 0;
    const boton = crear("button", { type: "button", disabled: !disponible, textContent: disponible ? "Agregar al carrito" : "No disponible" });
    boton.onclick = () =>
      this.dispatchEvent(new CustomEvent("agregar-al-carrito", { detail: { id: p.id }, bubbles: true, composed: true }));
    this.replaceChildren(
      crear("article", { className: "tarjeta" },
        crear("h3", {}, p.name),
        crear("p", { className: "categoria" }, p.category),
        crear("p", {}, p.description),
        crear("p", { className: "precio" }, dinero(p.price)),
        crear("p", {}, disponible ? `Stock: ${p.stock}` : "Agotado o inactivo"),
        boton)
    );
  }
}

customElements.define("product-card", TarjetaProducto);
