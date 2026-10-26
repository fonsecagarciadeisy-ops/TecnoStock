const exito = () => ({ ok: true });
const fallo = mensaje => ({ ok: false, mensaje });

export class Carrito {
  constructor(catalogo, guardado = []) {
    this.catalogo = new Map(catalogo.map(p => [p.id, p]));
    this.lineas = new Map();
    guardado.forEach(l => {
      const p = this.catalogo.get(l?.id);
      if (p && p.active && Number.isInteger(l.cantidad) && l.cantidad >= 1 && l.cantidad <= p.stock) this.lineas.set(p.id, l.cantidad);
    });
  }

  get items() {
    return [...this.lineas].map(([id, cantidad]) => {
      const p = this.catalogo.get(id);
      return { ...p, cantidad, importe: p.price * cantidad };
    });
  }

  get unidades() {
    return [...this.lineas.values()].reduce((a, c) => a + c, 0);
  }

  get totales() {
    const subtotal = this.items.reduce((a, i) => a + i.importe, 0);
    const descuento = subtotal >= 300000 ? subtotal * 0.1 : 0;
    return { subtotal, descuento, total: subtotal - descuento };
  }

  get datos() {
    return [...this.lineas].map(([id, cantidad]) => ({ id, cantidad }));
  }

  fijar(id, cantidad) {
    const p = this.catalogo.get(id);
    if (!p) return fallo("El producto no existe.");
    if (!p.active || p.stock < 1) return fallo(`${p.name} no está disponible.`);
    if (!Number.isInteger(cantidad) || cantidad < 1) return fallo("La cantidad mínima es 1; usa Eliminar para quitar el producto.");
    if (cantidad > p.stock) return fallo(`Solo hay ${p.stock} unidades de ${p.name}.`);
    this.lineas.set(id, cantidad);
    return exito();
  }

  cambiar(id, delta) {
    return this.fijar(id, (this.lineas.get(id) || 0) + delta);
  }

  quitar(id) {
    this.lineas.delete(id);
  }

  vaciar() {
    this.lineas.clear();
  }

  confirmar() {
    if (!this.lineas.size) return fallo("El carrito está vacío.");
    const invalido = this.items.find(i => !i.active || i.stock < 1 || i.cantidad > i.stock);
    if (invalido) return fallo(`${invalido.name} ya no es válido.`);
    const pedido = { id: `PED-${Date.now().toString(36).toUpperCase()}`, items: this.items, ...this.totales };
    this.vaciar();
    return { ok: true, pedido };
  }
}
