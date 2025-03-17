document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const errorMensaje = document.getElementById("errorMensaje");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita recargar la página

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.error || "Error en el servidor"); });
                }
                return response.json();
            })
            .then(data => {
                alert(data.message); // Mensaje de éxito
                localStorage.setItem("token", data.token); // Guardar el token en localStorage
                window.location.href = data.redirect; // Redirige a la página del catálogo
            })
            .catch(error => {
                errorMensaje.textContent = error.message;
                errorMensaje.style.display = "block"; // Muestra mensaje de error
            });
    });
});