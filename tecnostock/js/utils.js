export const dinero = n =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export const crear = (etiqueta, atributos = {}, ...hijos) => {
  const elemento = document.createElement(etiqueta);
  Object.entries(atributos).forEach(([k, v]) => (k in elemento ? (elemento[k] = v) : elemento.setAttribute(k, v)));
  elemento.append(...hijos);
  return elemento;
};
