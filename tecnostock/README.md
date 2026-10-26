# TecnoStock

Tienda de suministros tecnológicos hecha con JavaScript nativo, HTML y CSS.

## Cómo ejecutarla

Necesita un servidor HTTP local (con doble clic en index.html `fetch` no funciona).
En VS Code: extensión Live Server, clic derecho en index.html y "Open with Live Server".

## Estructura

- index.html: estructura de la página
- css/styles.css: estilos
- data/products.json: catálogo (12 productos, 3 categorías)
- js/api.js: carga y validación del catálogo con fetch
- js/cart.js: reglas del carrito, descuento y confirmación
- js/storage.js: persistencia con localStorage
- js/app.js: coordina la interfaz y escucha los eventos
- js/components/: product-card, product-list y shopping-cart (Web Components)

## Reglas implementadas

- Búsqueda sin distinguir mayúsculas, filtro por categoría, solo disponibles y orden por precio, combinables y sin nuevas solicitudes HTTP.
- Un producto aparece una sola vez en el carrito; cantidades enteras desde 1 y sin superar el stock; no se agregan productos inactivos o agotados.
- Los precios salen siempre del catálogo cargado.
- Descuento del 10 % si el subtotal es de $300.000 COP o más.
- El carrito se guarda en localStorage y se valida al recuperarlo.
- Los componentes emiten eventos personalizados (bubbles y composed) y app.js valida y modifica el estado.
- La confirmación del pedido es una simulación: no hay pago real ni se modifica el inventario.
