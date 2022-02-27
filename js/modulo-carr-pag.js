/*
    --- PROYECTO: BROKEN CHAINS ---
    Alumno: Dante Juan Terranova
*/

/* Creo un array con los productos y lo lleno con elementos de un .json */
async function importarProductos() {
    let entradaProductosTemp = [];
    await fetch('../js/productos.json')
    .then((resp) => resp.json())
    .then((json) => {
        entradaProductosTemp = json.map((objeto) => {
            return objeto;
        });
    });
    return entradaProductosTemp;
}

let entradaProductos = [];
document.addEventListener('DOMContentLoaded', async () => {
    entradaProductos = await importarProductos();
    // Creo un nuevo array de objetos con los productos procesados
    arrayProductos = entradaProductos.map((productoEmpleado) => new Producto(productoEmpleado.id, productoEmpleado.leyenda, productoEmpleado.precio, productoEmpleado.stock, productoEmpleado.tipo, productoEmpleado.img));
    // Inicializo el estado del stock de cada producto
    estadoStock();
});

// Creo un nuevo array de objetos con los productos procesados
let arrayProductos = [];

// Creo un array con los cupones
const cupones = [
    {nombre: 'IRON883', porcentaje: 5},
    {nombre: 'MOV112', porcentaje: 10},
    {nombre: 'ARES78', porcentaje: 10},
    {nombre: 'SOA', porcentaje: 20},
    {nombre: 'DANTE2001', porcentaje: 15}
];

// Saco del localStorage el JSON para mostrar el carrito
let carrito = [];
let carritoLS = JSON.parse(localStorage.getItem('carrito'));
if (carritoLS != null) {
    carrito = carritoLS;
}
let totalBase = JSON.parse(localStorage.getItem('totalBase'));
let totalFinal = JSON.parse(localStorage.getItem('totalFinal'));
mostrarCarrito();

// Le asigno a los botones de eliminar su evento 
let botonesEliminar = document.getElementsByClassName('eliminar');
asignarEventoEliminar();
asignarEventoCantidad();

// Muestro la cantidad de productos agregados al carrito
recienAgregado();
if (carrito.length < 1) {
    let listado = document.getElementById('listadoProductos');
    listado.style.border = 'none';
}

// Asocio el boton de aplicar cupon a su evento
let botonAplicarCupon = document.getElementById('aplicarCupon');
botonAplicarCupon.addEventListener('click', mostrarDescuento);

// Le agrego un evento al boton de pagar
let botonPagar = document.getElementById('botonPagarCarrito');
botonPagar.addEventListener('click', alertPago);