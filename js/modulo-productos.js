/* Creo clase "Producto" */
class Producto {

    constructor(id, leyenda, precio, stock, tipo, img) {
        this.id = id;
        this.leyenda = leyenda;
        this.precio = precio;
        this.stock = stock;
        this.tipo = tipo;
        this.img = img;
    }

    // Creo un metodo para chequear el stock
    consultarStock() {
        let salida = false;
        if (this.stock > 0) {
            salida = true;
        }
        return salida;
    }

    // Creo un metodo para calcular y devolver el precio despues del descuento
    aplicarDescuento(porcentajeDescuento) {
        let precioDescontado;
        if ((this.precio || porcentajeDescuento) <= 0) {
            precioDescontado = 0;
        }
        else {
            this.precio = this.precio - (this.precio * (porcentajeDescuento / 100));
            this.precio = this.precio.toFixed(2);
        }
        return precioDescontado;
    }
}

