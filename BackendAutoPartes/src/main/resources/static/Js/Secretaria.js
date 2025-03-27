 let historial = []; // Array para almacenar el historial

    function toggleMode() {
        document.body.classList.toggle('modo-claro');
    }

    function mostrarEnviarCorreo() {
        document.getElementById("enviarCorreo").classList.remove("hidden");
        document.getElementById("enviarMensaje").classList.add("hidden");
        document.getElementById("historial").classList.add("hidden");
    }

    function mostrarEnviarMensaje() {
        document.getElementById("enviarMensaje").classList.remove("hidden");
        document.getElementById("enviarCorreo").classList.add("hidden");
        document.getElementById("historial").classList.add("hidden");
    }

    function mostrarHistorial() {
        document.getElementById("historial").classList.remove("hidden");
        document.getElementById("enviarCorreo").classList.add("hidden");
        document.getElementById("enviarMensaje").classList.add("hidden");
        actualizarHistorial();
    }

    function actualizarHistorial() {
        let tabla = document.getElementById("historialTabla");
        tabla.innerHTML = ""; // Limpiar la tabla antes de actualizar
        historial.forEach((item) => {
            let fila = `<tr>
                            <td>${item.tipo}</td>
                            <td>${item.destinatario}</td>
                            <td>${item.contenido}</td>
                            <td>${item.fecha}</td>
                        </tr>`;
            tabla.innerHTML += fila;
        });
    }

    document.getElementById("formEnviarCorreo").addEventListener("submit", function (event) {
        event.preventDefault();
        let destinatario = document.getElementById("destinatario").value;
        let asunto = document.getElementById("asunto").value;
        let mensaje = document.getElementById("mensajeCorreo").value;

        // Guardar en el historial
        historial.push({
            tipo: "Correo",
            destinatario: destinatario,
            contenido: `Asunto: ${asunto}, Mensaje: ${mensaje}`,
            fecha: new Date().toLocaleString(),
        });

        alert("Correo enviado con éxito!");
        document.getElementById("formEnviarCorreo").reset();
        actualizarHistorial();
    });

    document.getElementById("formEnviarMensaje").addEventListener("submit", function (event) {
        event.preventDefault();
        let destinatario = document.getElementById("destinatarioMensaje").value;
        let mensaje = document.getElementById("mensajeMarketing").value;

        // Guardar en el historial
        historial.push({
            tipo: "Mensaje de Marketing",
            destinatario: destinatario,
            contenido: mensaje,
            fecha: new Date().toLocaleString(),
        });

        alert("Mensaje de marketing enviado con éxito!");
        document.getElementById("formEnviarMensaje").reset();
        actualizarHistorial();
    });