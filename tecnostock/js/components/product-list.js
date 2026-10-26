import "./product-card.js";

export class ListaProductos extends HTMLElement {
  set productos(lista) {
    this.replaceChildren(...lista.map(p => Object.assign(document.createElement("product-card"), { producto: p })));
  }
}

customElements.define("product-list", ListaProductos);
