// Función para cambiar el modo
    function toggleMode() {
        const body = document.body;
        body.classList.toggle("modo-claro");

        // Guardar el estado del modo en localStorage
        if (body.classList.contains("modo-claro")) {
            localStorage.setItem("modo", "claro");
        } else {
            localStorage.setItem("modo", "oscuro");
        }
    }

    // Aplicar el modo guardado al cargar la página
    function aplicarModoGuardado() {
        const modoGuardado = localStorage.getItem("modo");
        if (modoGuardado === "claro") {
            document.body.classList.add("modo-claro");
        }
    }

    // Llamar a la función al cargar la página
    aplicarModoGuardado();