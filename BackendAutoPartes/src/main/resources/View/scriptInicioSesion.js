document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");

    loginButton.addEventListener("click", function () {
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (email === "" || password === "") {
            alert("Por favor, ingresa tu correo y contraseña.");
            return;
        }

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
                window.location.href = data.redirect; // Redirige a la página del catálogo
            })
            .catch(error => {
                alert(error.message); // Mensaje de error
            });
    });
});
