/*
    --- PROYECTO: BROKEN CHAINS ---
    Alumno: Dante Juan Terranova
*/

// Creo una funcion para encontrar y devolver un producto (objeto) segun su ID
function encontrarProducto(array, id) {
    let productoBuscado = array.find((producto) => producto.id === id);
    return productoBuscado;
}

// Creo una funcion para ordenar IDs de menor a mayor
function ordenarID() {
    carrito.sort((a, b) => a.id - b.id);
}

// Creo una funcion para ver si existe un producto
function existeProducto(array, id) {
    return array.some((productoBuscado) => productoBuscado.id == id);
}

// Creo una funcion para retornar la posicion de un producto
function encontrarPosicion(array, id) {
    let i = 0;
    let posicion;
    while (true) {
        if (array[i].id == id) {
            posicion = i;
            break;
        }
        i++;
    }
    return posicion;
}

// Creo una funcion para retornar la posicion de un cupon
function encontrarPosicionCupon(array, cupon) {
    let i = 0;
    let posicion;
    while (true) {
        if (array[i].nombre == cupon) {
            posicion = i;
            break;
        }
        i++;
    }
    return posicion;
}

// Creo una funcion para saber si hay stock o no
function hayStock(objeto) {
    let hay;
    hay = objeto.stock > 0 ? true : false
    return hay;
}

// Creo una funcion para chequear si coincide el cupon
function cuponValido(cupon, arrayCupones) {
    let esValido = false;
    let i = 0;
    while (!esValido && i < arrayCupones.length) {
        esValido = (cupon == arrayCupones[i].nombre) && true;
        i++;
    }
    return esValido;
}

// Creo una funcion para hacer el descuento
function descontar(total, porcentaje) {
    if ((total || porcentaje) > 0) {
        total -= (total * (porcentaje / 100));
    }
    return total;
}

// Creo una funcion para aplicar impuesto
function impuesto(total, porcentaje) {
    if ((total && porcentaje) > 0) {
        total *= (porcentaje / 100 + 1);
    }
    return total;
}

// Creo una funcion para encontrar y devolver un cupon
function encontrarCupon(array, cupon) {
    let cuponActual = array.find((cuponActual) => cuponActual.nombre === cupon);
    return cuponActual;
}

// Calcular total carrito
function sumarCarrito(arrayCarrito) {
    let sumaTotal = 0;
    for (let i = 0; i < arrayCarrito.length; i++) {
        sumaTotal += (arrayCarrito[i].precio * arrayCarrito[i].cantidad);
    }
    return sumaTotal;
}

// Creo una funcion para agregar al carrito un producto
function agregarProducto(producto) {
    // Traigo tanto el producto con el que trato como su posicion en el array
    let posicionProducto = encontrarPosicion(arrayProductos, producto.id);
    let cantidadAgregar;
    if (producto.tipo == 'producto') {
        cantidadAgregar = parseInt(cantidadesPagina[posicionProducto].value);
    }
    else {
        cantidadAgregar = 1;
    }
    if (hayStock(producto)) {
        if (cantidadAgregar > 0) {
            if (producto.stock >= cantidadAgregar) {
                // Importo los productos del localStorage si hay algo
                let importarProductos = JSON.parse(localStorage.getItem('productos'));
                if (importarProductos != null) {
                    arrayProductos = importarProductos;
                }
                // Reduzco el stock dentro del array de productos para simular su salida
                arrayProductos[posicionProducto].stock = arrayProductos[posicionProducto].stock - cantidadAgregar;
                // Exporto el array de productos en el localStorage para compartir el stock de cada producto
                let exportarProductos = JSON.stringify(arrayProductos);
                localStorage.setItem('productos', exportarProductos);
                // Uso el objeto producto para agregarlo dentro del carrito
                let modifique = false;
                carrito = carrito.map((item) => {
                    if (item.id == producto.id) {
                        modifique = true;
                        return {...item, cantidad: item.cantidad + cantidadAgregar};
                    }
                    else {
                        return item;
                    }
                });
                if (!modifique) {
                    carrito = [...carrito, new Carrito(producto.leyenda, cantidadAgregar, producto.precio, producto.id, producto.img)];
                }
                // Muestro el carrito usando DOM
                ordenarID();
                // Asigno eventos a los botones de eliminar y cantidades
                asignarEventoEliminar();
                // Renuevo el estado del stock
                estadoStock();
                // Exporto el carrito actual al local storage
                // --Carrito
                let carritoJSON = JSON.stringify(carrito);
                localStorage.setItem('carrito', carritoJSON);
                // --Total base
                let sacarTotalBase = sumarCarrito(carrito);
                let totalBJSON = JSON.stringify(sacarTotalBase);
                localStorage.setItem('totalBase', totalBJSON);
                // --Total final
                let totalFJSON = JSON.stringify(impuesto(sacarTotalBase, 21));
                localStorage.setItem('totalFinal', totalFJSON);
                sessionStorage.setItem('totalFinal', totalFJSON);
                // Elimino el descuento previamente producido
                let hayCupon = sessionStorage.getItem('cuponAplicado');
                if (hayCupon) {
                    sessionStorage.removeItem('cuponAplicado');
                    sessionStorage.removeItem('posCupon');
                    sessionStorage.removeItem('totalFinal');
                }
                // Muestro la cantidad de productos en el carrito
                recienAgregado();
                listadoCarrito();
                // Transformo los inputs a su estado normal
                for (let i = 0; i < cantidadesPagina.length; i++) {
                    cantidadesPagina[i].style.border = '1px solid black';
                    errores[i].innerText = '';
                }
                cantidadesPagina[posicionProducto].value = '';
                // Notifico el agregado
                Toastify({
                    text: "Producto agregado con éxito",
                    duration: 2500,
                    gravity: "bottom",
                    position: "left",
                    style: {
                        background: "#f48322",
                    },
                    avatar: "../media/carrito.svg",
                    destination: "../pages/carrito.html",
                }).showToast();
            }
            else {
                errores[posicionProducto].innerText = 'No hay suficiente stock para esa cantidad';
                errores[posicionProducto].style.color = 'red';
                errores[posicionProducto].style.marginLeft = '40.5vw';
                errores[posicionProducto].style.marginTop = '-45px';
                errores[posicionProducto].style.marginBottom = '27px';
                errores[posicionProducto].style.maxWidth = '300px';
                cantidadesPagina[posicionProducto].style.border = '1px solid red';
                // Transformo el input a su estado normal
                for (let i = 0; i < cantidadesPagina.length; i++) {
                    if (i == posicionProducto) {
                        continue;
                    }
                    cantidadesPagina[i].style.border = '1px solid black';
                    errores[i].innerText = '';
                }
                cantidadesPagina[posicionProducto].value = '';
                estadoStock();
            }
        }
        else {
            errores[posicionProducto].innerText = 'Debe ingresar una cantidad válida';
            errores[posicionProducto].style.color = 'red';
            errores[posicionProducto].style.height = '30px';
            errores[posicionProducto].style.marginLeft = '45.2vw';
            errores[posicionProducto].style.marginTop = '-45px';
            errores[posicionProducto].style.marginBottom = '27px';
            errores[posicionProducto].style.maxWidth = '230px';
            cantidadesPagina[posicionProducto].style.border = '1px solid red';
            // Transformo el input a su estado normal
            for (let i = 0; i < cantidadesPagina.length; i++) {
                if (i == posicionProducto) {
                    continue;
                }
                cantidadesPagina[i].style.border = '1px solid black';
                errores[i].innerText = '';
            }
            cantidadesPagina[posicionProducto].value = '';
            estadoStock();
        }
    }
    else {
        errores[posicionProducto].innerText = 'Stock insuficiente';
        errores[posicionProducto].style.color = 'red';
        errores[posicionProducto].style.marginLeft = '48.5vw';
        errores[posicionProducto].style.marginTop = '-45px';
        errores[posicionProducto].style.marginBottom = '27px';
        errores[posicionProducto].style.maxWidth = '140px';
        cantidadesPagina[posicionProducto].style.border = '1px solid red';
        // Transformo el input a su estado normal
        for (let i = 0; i < cantidadesPagina.length; i++) {
            if (i == posicionProducto) {
                continue;
            }
            cantidadesPagina[i].style.border = '1px solid black';
            errores[i].innerText = '';
        }
        cantidadesPagina[posicionProducto].value = '';
        estadoStock();
    }
}

// Creo una funcion para mostrar el carrito usando DOM
function mostrarCarrito() {
    let cantCarrito = document.getElementById('enElCarrito');
    cantCarrito.innerHTML = 'En el carrito (' + carrito.length + ')';
    let ulCarrito = document.getElementById('listadoProductos');
    if (carrito.length > 0) {
        for (const producto of carrito) {
            let li = document.createElement('li');
            ulCarrito.appendChild(li);
            let imagen = new Image();
            imagen.setAttribute('src', producto.img);
            imagen.setAttribute('class', 'imagenesCarrito');
            imagen.width = 100;
            li.appendChild(imagen);
            let li2 = document.createElement('li');
            li.appendChild(li2);
            li2.innerHTML = 'x' + producto.cantidad + ' "' + producto.descripcion + '" $' + producto.precio + ' - ($' + producto.precio * producto.cantidad + ')' + 
            ' ID #' + producto.id + '<img class="eliminar" src="../media/borrar.png" alt="eliminar" style="background:none; margin-left:20px; font-size:0.9rem; width:35px; height:30px; cursor:pointer">';
            li2.style.padding = '5px';
            li2.className = producto.id;
            ulCarrito.appendChild(li);
            let divCantidad = document.createElement('div');
            divCantidad.style.width = '40%';
            divCantidad.style.margin = '0 auto';
            divCantidad.style.height = '50px';
            ulCarrito.appendChild(divCantidad);
            divCantidad.innerHTML = '<div class="add" style="cursor:pointer; width:40px; margin-left: 7.5vw; user-select:none">+</div><input class="inputCantidad" type="number" readonly="readonly" placeholder="Cant." style="width:70px; height:30px; margin-bottom:10px"><div class="minus" style="cursor:pointer; width:40px; margin-left: 16vw; user-select:none">-</div>';
            divError = document.createElement('div');
            divError.innerHTML = '<div class="mensajeError" style="color:red"></div>';
            ulCarrito.appendChild(divError);
        }
        let carritoStyle = document.getElementsByClassName('flexBoxCarritoProductos');
        carritoStyle[0].style.userSelect = 'none';
        // Total base
        let totalBase = sumarCarrito(carrito);
        let totalBaseMuestra = document.getElementById('totalBase');
        totalBaseMuestra.innerText = 'TOTAL BASE ----- $' + totalBase;
        // IVA
        let iva = totalBase * 0.21;
        let ivaMuestra = document.getElementById('iva');
        ivaMuestra.innerHTML = 'IVA (21%) ----- $' + iva;
        // Total final
        let totalFinal;
        let hayCupon = sessionStorage.getItem('cuponAplicado');
        // Mostrar cantidad actual
        let cantidadesActuales = document.getElementsByClassName('inputCantidad');
        for (let i = 0; i < cantidadesActuales.length; i++) {
            cantidadesActuales[i].value = carrito[i].cantidad;
        }
        if (hayCupon) {
            let finalConCupon = JSON.parse(sessionStorage.getItem('totalFinal'));
            totalFinal = finalConCupon;
            let descuentoMuestra = document.getElementById('descuento');
            let posicionCupon = JSON.parse(sessionStorage.getItem('posCupon'));
            let descontado = totalBase * (cupones[posicionCupon].porcentaje / 100);
            descuentoMuestra.innerHTML = 'DTO. (-%' + cupones[posicionCupon].porcentaje + ') ----- $' + descontado;
        }
        else {
            totalFinal = impuesto(totalBase, 21);
            localStorage.setItem('totalBase', totalBase);
            localStorage.setItem('totalFinal', totalFinal);
        }
        let totalFinalMuestra = document.getElementById('totalFinal');
        totalFinalMuestra.innerText = 'TOTAL FINAL: $' + totalFinal;
        // Genero el boton de limpiar carrito
        borrarCarrito();
    }
    else {
        // Lo que muestro si el carrito esta vacio
        document.getElementById('totalBase').innerText = '';
        document.getElementById('iva').innerText = '';
        document.getElementById('totalFinal').innerText = '¡Carrito vacio!';
        // No muestro el metodo de pago
        let pago = document.getElementsByClassName('pago');
        pago[0].style.display = 'none';
        // Muestro una imagen del cosito del desierto
        let imagenAgregar = new Image();
        imagenAgregar.setAttribute('src', '../media/tumbleweed.gif');
        imagenAgregar.width = 150;
        let imagenVacio = document.getElementById('listadoProductos');
        imagenVacio.appendChild(imagenAgregar);
        let noSelect = document.getElementById('carritoBox');
        noSelect.style.userSelect = 'none';
    }
}

// Creo una funcion para asignar el evento eliminar a sus respectivos botones
function asignarEventoEliminar() {
    for (let i = 0; i < botonesEliminar.length; i++) {
        botonesEliminar[i].addEventListener('click', eliminarProducto);
    }
}

// Creo una funcion para asignar el evento agregar a sus respectivos botones
function asignarEventoAgregar() {
    for (let i = 0; i < botonesAgregar.length; i++) {
        botonesAgregar[i].addEventListener('click', function(){
            agregarProducto(arrayProductos[i]);
        });
    }
}

// Creo una funcion que limpia el carrito
function limpiarCarrito() {
    document.getElementById('listadoProductos').innerText = '';
}

// Creo una funcion para descontar y mostrar
function mostrarDescuento() {
    let cuponFlag = (sessionStorage.getItem('cuponAplicado'));
    if (!cuponFlag && carrito.length > 0) {
        let cuponIngresado = document.getElementById('cupon').value;
        cuponIngresado = cuponIngresado.toUpperCase();
        document.getElementById('cupon').value = '';
        if (cuponValido(cuponIngresado, cupones)) {
            // Encuentro la posicion del cupon ingresado y la meto en sessionStorage
            let posicionCupon = encontrarPosicionCupon(cupones, cuponIngresado);
            sessionStorage.setItem('posCupon', JSON.stringify(posicionCupon));
            // Calculo el descuento a aplicar segun el porcentaje del cupon
            let totalBase = JSON.parse(localStorage.getItem('totalBase'));
            let descontar = totalBase * (cupones[posicionCupon].porcentaje / 100);
            let totalFinal = JSON.parse(localStorage.getItem('totalFinal'));;
            let nuevoTotalFinal = totalFinal - descontar;
            // Paso el reultado y la llave al sessionStorage 
            sessionStorage.setItem('totalFinal', JSON.stringify(nuevoTotalFinal));
            sessionStorage.setItem('cuponAplicado', true);
            // Muestro el descuento por pantalla, ademas de modificar el total final
            let descuentoMuestra = document.getElementById('descuento');
            descuentoMuestra.innerHTML = 'DTO. (-%' + cupones[posicionCupon].porcentaje + ') ----- $' + descontar;
            let totalFinalMuestra = document.getElementById('totalFinal');
            totalFinalMuestra.innerText = 'TOTAL FINAL: $' + JSON.parse(sessionStorage.getItem('totalFinal'));
            // Borro el error
            let mensajeErrorCupon = document.getElementById('errorCupon');
            mensajeErrorCupon.style.display = 'none';
            let bordeCupon = document.getElementById('cupon');
            bordeCupon.style.border = '2px solid #f48322';
            // Notifico la aplicacion del descuento
            Toastify({
                text: 'Cupón aplicado con éxito',
                duration: 2500,
                gravity: 'bottom',
                position: 'left',
                background: '#f48322',
                style: {
                    background: "#f48322",
                },
                avatar: '../media/descuento.png',
            }).showToast();
        }
        else {
            // Muestro el error
            let mensajeErrorCupon = document.getElementById('errorCupon');
            mensajeErrorCupon.style.display = 'block';
            mensajeErrorCupon.innerText = 'Cupón inválido';
            let bordeCupon = document.getElementById('cupon');
            bordeCupon.style.border = '2px solid red';
        }
    }
    else {
        let mensajeErrorCupon = document.getElementById('errorCupon');
        mensajeErrorCupon.style.display = 'block';
        mensajeErrorCupon.innerText = 'Ya aplicó el cupón o el carrito está vacío';
        let bordeCupon = document.getElementById('cupon');
        bordeCupon.style.border = '2px solid red';
    }
}

// Creo una funcion que me permite eliminar el nodo padre del boton "Eliminar", de manera que se borre el producto
function eliminarProducto(e) {
    window.location.reload();
    // Usando target obtengo el padre del boton, luego guardo su ID y lo elimino. Luego uso el ID para borrar del carrito el elemento
    let liProducto = e.target.parentNode;
    let idProductoEliminar = liProducto.className;
    let posicionCarrito = encontrarPosicion(carrito, idProductoEliminar);
    let devolverStock = carrito[posicionCarrito].cantidad;
    let posicionProductos = encontrarPosicion(arrayProductos, idProductoEliminar);
    // Importo los productos del localStorage si hay algo
    let importarProductos = JSON.parse(localStorage.getItem('productos'));
    if (importarProductos != null) {
        arrayProductos = importarProductos;
    }
    // Reduzco el stock dentro del array de productos para simular su salida
    arrayProductos[posicionProductos].stock = arrayProductos[posicionProductos].stock + devolverStock;
    // Exporto el array de productos en el localStorage para compartir el stock de cada producto
    let exportarProductos = JSON.stringify(arrayProductos);
    localStorage.setItem('productos', exportarProductos);
    // DOM
    liProducto.remove();
    carrito.splice(posicionCarrito, 1);
    asignarEventoEliminar();
    estadoStock();
    // Exporto el carrito actual al local storage
    let carritoJSON = JSON.stringify(carrito);
    localStorage.setItem('carrito', carritoJSON);
    // Muestro la cantidad de productos en el carrito
    recienAgregado();
    if (carrito.length < 1) {
        let numero = document.getElementById('numeroProductos');
        numero.style.background = 'none';
        let listado = document.getElementById('listadoProductos');
        listado.style.border = 'none';
    }
    // Elimino el descuento previamente producido
    let hayCupon = sessionStorage.getItem('cuponAplicado');
    if (hayCupon) {
        sessionStorage.removeItem('cuponAplicado');
        sessionStorage.removeItem('posCupon');
        sessionStorage.removeItem('totalFinal');
    }
    limpiarCarrito();
    mostrarCarrito();
}

// Creo una funcion que modifica el estado del stock de cada producto
function estadoStock() {
    // Importo los productos del localStorage si hay algo
    let importarProductos = JSON.parse(localStorage.getItem('productos'));
    if (importarProductos != null) {
        arrayProductos = importarProductos;
    }
    let stockProductos = document.getElementsByClassName('stock');
    for (let i = 0; i < stockProductos.length; i++) {
        if (hayStock(arrayProductos[i])) {
            stockProductos[i].innerHTML = 'Con stock';
            stockProductos[i].style.color = 'green';
            stockProductos[i].style.fontWeight = 'bold';
        }
        else {
            stockProductos[i].innerHTML = 'Sin stock';
            stockProductos[i].style.color = 'red';
            stockProductos[i].style.fontWeight = 'bold';
            cantidadesPagina[i].style.pointerEvents = 'none';
            cantidadesPagina[i].style.border = '1px solid #d6d6d6';
        }
    }
}

// Creo una funcion para mostrar la cantidad de productos agregados al carrito
function recienAgregado() {
    let carritoImportado = JSON.parse(localStorage.getItem('carrito'));
    let agregado = 0;
    if (carritoImportado != null) {
        agregado = carritoImportado.length;
    }
    let numero;
    if (agregado > 0) {
        numero = document.getElementById('numeroProductos');
        numero.innerText = agregado;
        numero.style.fontSize = '1rem';
        numero.style.top = '-10px';
        numero.style.left = '2vw';
        numero.style.color = 'white';
        numero.style.background = 'black';
        numero.style.borderRadius = '100%';
        numero.style.padding = '1px 6px';
        numero.style.position = 'absolute'
        numero.animate([
            {transform: 'scale(1)'},
            {transform: 'scale(1.1)'},
            {transform: 'scale(1)'}
        ], {
            duration: 1000,
            iterations: 2
        });
    }
    else {
        numero = document.getElementById('numeroProductos');
        numero.innerText = '';
    }
}

// Creo una funcion para asignarle su evento a todos los botones de aumentar/disminuir cantidad
function asignarEventoCantidad() {
    let botonesAdd = document.getElementsByClassName('add');
    let botonesMinus = document.getElementsByClassName('minus');
    for (let i = 0; i < botonesAdd.length; i++) {
        botonesAdd[i].replaceWith(botonesAdd[i].cloneNode(true));
        botonesAdd[i].addEventListener('click', function(){
            aumentarCantidad(i);
        });
        botonesMinus[i].replaceWith(botonesMinus[i].cloneNode(true));
        botonesMinus[i].addEventListener('click', function(){
            disminuirCantidad(i);
        });
    }
}

// Creo una funcion para aumentar la cantidad de un producto en el carrito
function aumentarCantidad(posCarrito) {
    // Encuentro el producto en arrayProductos y le bajo el stock
    let idDisminuir = carrito[posCarrito].id;
    let posProducto = encontrarPosicion(arrayProductos, idDisminuir);
    // Importo los productos del localStorage si hay algo
    let importarProductos = JSON.parse(localStorage.getItem('productos'));
    if (importarProductos != null) {
        arrayProductos = importarProductos;
    }
    if (hayStock(arrayProductos[posProducto])) {
        arrayProductos[posProducto].stock -= 1;
        // Cambio la cantidad del producto en carrito
        carrito[posCarrito].cantidad += 1;
        // Exporto el array de productos en el localStorage para compartir el stock de cada producto
        let exportarProductos = JSON.stringify(arrayProductos);
        localStorage.setItem('productos', exportarProductos);
        // --Total base
        let sacarTotalBase = sumarCarrito(carrito);
        let totalBJSON = JSON.stringify(sacarTotalBase);
        localStorage.setItem('totalBase', totalBJSON);
        // --Total final
        let totalFJSON = JSON.stringify(impuesto(sacarTotalBase, 21));
        localStorage.setItem('totalFinal', totalFJSON);
        sessionStorage.setItem('totalFinal', totalFJSON);
        // Elimino el descuento previamente producido
        let hayCupon = sessionStorage.getItem('cuponAplicado');
        if (hayCupon) {
            sessionStorage.removeItem('cuponAplicado');
            sessionStorage.removeItem('posCupon');
            sessionStorage.removeItem('totalFinal');
        }
        let descuentoMuestra = document.getElementById('descuento');
        descuentoMuestra.innerHTML = '';
        let contornoError = document.getElementById('cupon');
        contornoError.style.border = '2px solid black';
        let msjError = document.getElementById('errorCupon');
        msjError.innerText = '';
        limpiarCarrito();
        mostrarCarrito();
    }
    else {
        let mensajeError = document.getElementsByClassName('mensajeError');
        mensajeError[posCarrito].innerText = 'No hay más stock de este producto';
    }
    // Exporto el carrito al localStorage
    let carritoJSON = JSON.stringify(carrito);
    localStorage.setItem('carrito', carritoJSON);
    asignarEventoEliminar();
    asignarEventoCantidad();
}

// Creo una funcion para disminuir la cantidad de un producto en el carrito
function disminuirCantidad(posCarrito) {
    // Encuentro el producto en arrayProductos y le bajo la cantidad y le subo el stock
    let idDisminuir = carrito[posCarrito].id;
    let posProducto = encontrarPosicion(arrayProductos, idDisminuir);
    // Importo los productos del localStorage si hay algo
    let importarProductos = JSON.parse(localStorage.getItem('productos'));
    if (importarProductos != null) {
        arrayProductos = importarProductos;
    }
    // En el caso de que haya cantidad, se puede seguir decrementando, sino se borra
    if (carrito[posCarrito].cantidad > 1) {
        carrito[posCarrito].cantidad -= 1;
        arrayProductos[posProducto].stock += 1;
        // --Total base
        let sacarTotalBase = sumarCarrito(carrito);
        let totalBJSON = JSON.stringify(sacarTotalBase);
        localStorage.setItem('totalBase', totalBJSON);
        // --Total final
        let totalFJSON = JSON.stringify(impuesto(sacarTotalBase, 21));
        localStorage.setItem('totalFinal', totalFJSON);
        sessionStorage.setItem('totalFinal', totalFJSON);
        // Elimino el descuento previamente producido
        let hayCupon = sessionStorage.getItem('cuponAplicado');
        if (hayCupon) {
            sessionStorage.removeItem('cuponAplicado');
            sessionStorage.removeItem('posCupon');
            sessionStorage.removeItem('totalFinal');
        }
        let descuentoMuestra = document.getElementById('descuento');
        descuentoMuestra.innerHTML = '';
        let contornoError = document.getElementById('cupon');
        contornoError.style.border = '2px solid black';
        let msjError = document.getElementById('errorCupon');
        msjError.innerText = '';
        // Exporto el array de productos en el localStorage para compartir el stock de cada producto
        let exportarProductos = JSON.stringify(arrayProductos);
        localStorage.setItem('productos', exportarProductos);
        limpiarCarrito();
        mostrarCarrito();
    }
    else {
        carrito.splice(posCarrito, 1);
        arrayProductos[posProducto].stock = arrayProductos[posProducto].stock + 1;
        // Exporto el array de productos en el localStorage para compartir el stock de cada producto
        let exportarProductos = JSON.stringify(arrayProductos);
        localStorage.setItem('productos', exportarProductos);
        limpiarCarrito();
        mostrarCarrito();
        window.location.reload();
    }
    // Exporto el carrito al localStorage
    let carritoJSON = JSON.stringify(carrito);
    localStorage.setItem('carrito', carritoJSON);
    // Elimino el descuento previamente producido
    let hayCupon = sessionStorage.getItem('cuponAplicado');
    if (hayCupon) {
        sessionStorage.removeItem('cuponAplicado');
        sessionStorage.removeItem('posCupon');
        sessionStorage.removeItem('totalFinal');
    }
    asignarEventoEliminar();
    asignarEventoCantidad();
}

function alertPago() {
    // Traigo al carrito desde el localStorage
    let carritoImportado = JSON.parse(localStorage.getItem('carrito'));
    if (carritoImportado != null) {
        // Si no es nulo, verifico su longitud
        if (carritoImportado.length > 0) {
            swal({
                text: "¿Está seguro de que quiere continuar?",
                icon: "warning",
                buttons: ["Cancelar", "Aceptar"],
            })
        }
        else {
            swal({
                text: "Por favor, debe ingresar primero los productos al carrito",
                icon: "error",
                buttons: ["Cerrar", "Agregar productos"],
            }).then(
                function (resultado) {
                    if (resultado) {
                        window.location.href = "../pages/productos.html";
                    }
                }
            );
        }
    }
}

function listadoCarrito() {
    // Traigo al carrito desde el localStorage
    let carritoImportado = JSON.parse(localStorage.getItem('carrito'));
    if (carritoImportado != null) {
        // Si no es nulo, verifico su longitud
        if (carritoImportado.length > 0) {
            // Creo un listado del carrito
            let borrar = document.getElementById('listadoP');
            if (borrar != null) {
                borrar.remove();
            }
            let vacioBorrar = document.getElementById('vacio');
            if (vacioBorrar != null) {
                vacioBorrar.style.height = '0';
                vacioBorrar.style.paddingTop = '0';
            }
            let borrarTotal = document.getElementById('totalC');
            if (borrarTotal != null) {
                borrarTotal.remove();
            }
            let borrarCant = document.getElementById('cantC');
            if (borrarCant != null) {
                borrarCant.remove();
            }
            let carritoProductos = document.getElementsByClassName('carritoProductos');
            if (carritoProductos[0] != undefined) {
                carritoProductos[0].style.padding = '30px 30px 300px 30px';
                let ulLista = document.createElement('ul');
                ulLista.setAttribute('id', 'listadoP');
                ulLista.style.flexDirection = 'column';
                ulLista.style.height = 'auto';
                ulLista.style.maxHeight = '250px';
                carritoProductos[0].appendChild(ulLista);
                // Lleno con los productos borro el texto anterior
                let borrarVacio = document.getElementById('vacio');
                if (borrarVacio != null) {
                    borrarVacio.innerHTML = '';
                }
                let borrarListado = document.getElementById('listadoP');
                borrarListado.innerHTML = '';
                // Escribo los productos
                let listado = document.getElementById('listadoP');
                for (const producto of carritoImportado) {
                    let nuevoDiv = document.createElement('div');
                    nuevoDiv.innerHTML = 'x' + producto.cantidad + ' ' + producto.descripcion + ' $' + (producto.precio * producto.cantidad + '\n');
                    nuevoDiv.style.marginBottom = '5px';
                    nuevoDiv.style.background = 'none';
                    nuevoDiv.style.textAlign = 'center';
                    listado.appendChild(nuevoDiv);
                }
                // Escribo la cantidad actual en el carrito
                let cantidad = carritoImportado.length;
                let cant = document.createElement('p');
                cant.setAttribute('id', 'cantC');
                cant.innerHTML = 'Cantidad: ' + cantidad;
                cant.style.fontWeight = 'bold';
                cant.style.textAlign = 'center';
                cant.style.fontSize = '1.1rem';
                carritoProductos[0].appendChild(cant);
                // Escribo el total actual
                let totalActual = sumarCarrito(carritoImportado);
                let total = document.createElement('p');
                total.setAttribute('id', 'totalC');
                total.innerHTML = 'Total: $' + totalActual;
                total.style.fontWeight = 'bold';
                total.style.textAlign = 'center';
                total.style.fontSize = '1.3rem';
                carritoProductos[0].appendChild(total);
            }
        }
        else {
            // Si esta vacio informo
            let carritoProductos = document.getElementsByClassName('carritoProductos');
            carritoProductos[0].style.padding = '0';
            let textoVacio = document.createElement('p');
            textoVacio.setAttribute('id', 'vacio');
            carritoProductos[0].appendChild(textoVacio);
            let texto = document.getElementById('vacio');
            texto.innerHTML = '¡Carrito vacío!';
            texto.style.fontWeight = 'bold';
            texto.style.fontSize = '1.3rem';
            texto.style.textAlign = 'center';
            texto.style.paddingTop = '50px';
        }
    }
    else {
        // Si esta vacio informo
        let carritoProductos = document.getElementsByClassName('carritoProductos');
        if (carritoProductos[0] != undefined) {
            carritoProductos[0].style.padding = '0';
            let textoVacio = document.createElement('p');
            textoVacio.setAttribute('id', 'vacio');
            carritoProductos[0].appendChild(textoVacio);
            let texto = document.getElementById('vacio');
            texto.innerHTML = '¡Carrito vacío!';
            texto.style.fontWeight = 'bold';
            texto.style.fontSize = '1.3rem';
            texto.style.textAlign = 'center';
            texto.style.paddingTop = '50px';
        }
    }
}

// Creo una funcion para crear un boton de limpiar carrito
function borrarCarrito() {
    // Trato de limpiar por si antes habia valores escritos
    let divBorrar = document.getElementById('limpiar');
    if (divBorrar != null) {
        divBorrar.remove();
    }
    // Si la longitud del carrito es mayor a cero que escriba un boton de limpiar
    if (carrito.length > 0) {
        // Consigo el contenedor del carrito y le agrego un boton
        let contenedorCarrito = document.getElementById('carritoBox');
        let divLimpiar = document.createElement('div');
        divLimpiar.setAttribute('id', 'limpiar');
        contenedorCarrito.appendChild(divLimpiar);
        // Teniendo el boton creado le asigno evento
        let limpiar = document.getElementById('limpiar');
        limpiar.innerHTML = 'Limpiar carrito';
        limpiar.addEventListener('click', alertBorrarCarro);
    }
}

// Creo una funcion para alertar si se quiere borrar el carrito
function alertBorrarCarro() {
    swal({
        text: "¿Está seguro de que desea vaciar el carrito?",
        icon: "../media/clearCart.png",
        buttons: ["Cancelar", "Borrar"],
    }).then(
        function (resultado) {
            if (resultado) {
                // Importo los productos del localStorage si hay algo
                let importarProductos = JSON.parse(localStorage.getItem('productos'));
                if (importarProductos != null) {
                    arrayProductos = importarProductos;
                }
                // Importo el carrito
                let carritoImportado = JSON.parse(localStorage.getItem('carrito'));
                if (carritoImportado != null) {
                    carrito = carritoImportado;
                }
                // Aumento el stock dentro del array de productos
                for (producto of carrito) {
                    let posProductos = encontrarPosicion(arrayProductos, producto.id);
                    arrayProductos[posProductos].stock += producto.cantidad;
                }
                // Exporto el array de productos en el localStorage para compartir el stock de cada producto
                let exportarProductos = JSON.stringify(arrayProductos);
                localStorage.setItem('productos', exportarProductos);
                // Exporto el array carrito inicializado
                carrito = [];
                let exportarCarrito = JSON.stringify(carrito);
                localStorage.setItem('carrito', exportarCarrito);
                window.location.reload();
            }
        }
    );
}