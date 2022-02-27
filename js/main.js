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
    asignarEventoAgregar();
    // Inicializo el estado del stock de cada producto
    estadoStock();
});

// Creo el array carrito y luego creo un evento para cada boton de agregado
let carrito = [];
let carritoImportado = JSON.parse(localStorage.getItem('carrito'));
if (carritoImportado != null) {
    carrito = carritoImportado;
}

// Obtengo informacion inicial de la pagina (agregado, cantidades, eliminado)
let botonesAgregar = document.getElementsByClassName('agregar');
let cantidadesPagina = document.getElementsByClassName('cantidadAgregar');
let errores = document.getElementsByClassName('mensajeError');
let botonesEliminar = document.getElementsByClassName('eliminar');
let arrayProductos = [];