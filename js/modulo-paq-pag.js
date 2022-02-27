/*
    --- PROYECTO: BROKEN CHAINS ---
    Alumno: Dante Juan Terranova
*/

function mostrarInfo() {
    swal({
        title: "Información de pago",
        text: "Las compras de servicios de membresías se concretan a través de transferencia bancaria. Usted deberá transferir a la cuenta bancaria del negocio y enviar el comprobante de pago a través de correo electrónico. Una vez comprobado se habilitarán las membresías en su cuenta.\n\nDatos:\n- CBU: 00000000000000000\n- Correo: bchains-servicios@hotmail.com.ar",
        icon: "info",
        button: "Aceptar",
    });
}

function mensajePaquetes() {
    swal({
        title: "¡Bienvenido a la sección de paquetes!",
        text: "Le aclaramos que los paquetes se abonan en efectivo en el local mismo y se habilitan en el momento.",
        icon: "../media/iconoMoto.png",
        button: "Aceptar",
    })
}

setTimeout(mensajePaquetes, 1000);