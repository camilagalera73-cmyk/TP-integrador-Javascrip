
/*
  tp_integrador_js_galera.js
  Tema: Carrito de compras
  Autor: Lucia Galera
  Cumple: variables (string, number, boolean, null), objeto literal con método (this),
  array y forEach, función tradicional y función flecha, if/else, switch, do...while,
  y demostración de call/apply.
*/

// Variables y tipos de datos
const tiendaNombre = "La Tiendita de Lucia"; // string
let totalCompra = 0;                           // number
let envioGratis = false;                       // boolean
let notaCliente = null;                        // null (puede usarse como 'sin nota')

// Objeto literal principal: Carrito
const Carrito = {
  tienda: tiendaNombre,
  productos: [], // array de items {id, nombre, precio, cantidad}
  moneda: "ARS",
  agregarProducto: function(producto) {
    // usa this para acceder al carrito
    const existente = this.productos.find(p => p.id === producto.id);
    if (existente) {
      existente.cantidad += producto.cantidad;
    } else {
      this.productos.push(producto);
    }
    this.actualizarTotal();
    return this; // para encadenar si se desea
  },
  eliminarProducto: function(id) {
    this.productos = this.productos.filter(p => p.id !== id);
    this.actualizarTotal();
  },
  actualizarTotal: function() {
    totalCompra = this.productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    envioGratis = totalCompra >= 5000 ? true : false; // ejemplo de operador ternario
  },
  listarProductos: function() {
    console.log(`Productos en ${this.tienda}:`);
    this.productos.forEach(p => {
      console.log(`- ${p.nombre} x${p.cantidad} — ${p.precio} ${this.moneda} c/u`);
    });
    console.log(`Total: ${totalCompra} ${this.moneda} | Envío gratis: ${envioGratis}`);
  }
};

// Array inicial de catálogo
const catalogo = [
  { id: 1, nombre: "Mate", precio: 1200 },
  { id: 2, nombre: "Termo 1L", precio: 3500 },
  { id: 3, nombre: "Libreta A5", precio: 800 },
  { id: 4, nombre: "Lapicera", precio: 150 }
];

// Recorrer catálogo con forEach()
console.log("Catálogo disponible:");
catalogo.forEach(item => {
  console.log(`${item.id}. ${item.nombre} — ${item.precio} ARS`);
});

// Función tradicional: buscar producto por id (con parámetros y return)
function buscarProductoPorId(id) {
  return catalogo.find(p => p.id === id) || null;
}

// Función flecha: crear un item para agregar al carrito (retorno implícito)
const crearItem = (id, cantidad) => {
  const p = buscarProductoPorId(id);
  return p ? { id: p.id, nombre: p.nombre, precio: p.precio, cantidad } : null;
};

// Control de flujo: ejemplo con switch para seleccionar acción de usuario simulada
function ejecutarAccionSimulada(accion, datos) {
  switch (accion) {
    case "agregar":
      const item = crearItem(datos.id, datos.cantidad);
      if (item) {
        Carrito.agregarProducto(item);
        console.log(`Se agregó ${item.nombre} x${item.cantidad}.`);
      } else {
        console.log("Producto no encontrado.");
      }
      break;
    case "eliminar":
      Carrito.eliminarProducto(datos.id);
      console.log(`Se eliminó el producto con id ${datos.id} (si existía).`);
      break;
    case "listar":
      Carrito.listarProductos();
      break;
    default:
      console.log("Acción no reconocida.");
  }
}

// do...while: simulación de interacción hasta que el usuario diga 'salir' (aquí usamos un array de acciones simuladas)
const accionesSimuladas = [
  { accion: "agregar", datos: { id: 1, cantidad: 2 } },
  { accion: "agregar", datos: { id: 2, cantidad: 1 } },
  { accion: "listar" },
  { accion: "agregar", datos: { id: 3, cantidad: 5 } },
  { accion: "eliminar", datos: { id: 1 } },
  { accion: "listar" }
];

let i = 0;
do {
  const paso = accionesSimuladas[i];
  ejecutarAccionSimulada(paso.accion, paso.datos || {});
  i++;
} while (i < accionesSimuladas.length);

// Demostración de call/apply: función externa para aplicar descuento que usará el contexto (this)
function aplicarDescuentoPorContexto(porcentaje, motivo) {
  // this esperará un objeto que contenga productos y moneda
  const subtotal = this.productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const descuento = subtotal * (porcentaje / 100);
  const nuevoTotal = subtotal - descuento;
  console.log(`Descuento aplicado: ${porcentaje}% por ${motivo}. Ahorro: ${descuento} ${this.moneda}. Total con descuento: ${nuevoTotal} ${this.moneda}.`);
  return nuevoTotal;
}

// Usando call
aplicarDescuentoPorContexto.call(Carrito, 10, "Promoción de bienvenida");

// Usando apply (argumentos como array)
aplicarDescuentoPorContexto.apply(Carrito, [5, "Black Friday - demo"]);

// Mostrar estado final
Carrito.listarProductos();

// Exportar para uso con Node (opcional)
if (typeof module !== "undefined") {
  module.exports = { Carrito, catalogo, buscarProductoPorId, crearItem };
}
