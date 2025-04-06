// Modo claro/oscuro
function toggleMode() {
    const body = document.body;
    body.classList.toggle("modo-claro");
    localStorage.setItem("modo", body.classList.contains("modo-claro") ? "claro" : "oscuro");
}

function aplicarModoGuardado() {
    const modoGuardado = localStorage.getItem("modo");
    if (modoGuardado === "claro") {
        document.body.classList.add("modo-claro");
    }
}

// Logout
function logout() {
    localStorage.clear();
    window.location.href = "InicioSesionCliente.html";
}

// Cargar datos del usuario
async function loadUserProfile() {
    const token = localStorage.getItem("authToken");
    if (!token) {
        window.location.href = "InicioSesionCliente.html";
        return;
    }

    try {
        const response = await fetch("/api/auth/profile", {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        if (response.ok) {
            const user = await response.json();
            document.getElementById("name").value = user.name || '';
            document.getElementById("lastname").value = user.lastname || '';
            document.getElementById("email").value = user.email || '';
            document.getElementById("phone").value = user.phone || '';
            document.getElementById("address").value = user.address || '';
            document.getElementById("documentType").value = user.documentType || '';
            document.getElementById("document").value = user.document || '';
            document.getElementById("password").value = ''; // nunca mostrar la contraseña real
        } else {
            throw new Error("Token inválido o expirado");
        }
    } catch (err) {
        console.error("Error al cargar perfil:", err);
        window.location.href = "InicioSesionCliente.html";
    }
}

// Inicializar eventos y estado
window.addEventListener("DOMContentLoaded", () => {
    aplicarModoGuardado();
    loadUserProfile();

    document.getElementById("profileForm").addEventListener("submit", (event) => {
        event.preventDefault();
        document.getElementById("confirmationMessage").style.display = "block";
        setTimeout(() => {
            document.getElementById("confirmationMessage").style.display = "none";
        }, 3000);
    });

    document.getElementById("profileForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("authToken");
        if (!token) return window.location.href = "InicioSesionCliente.html";

        const body = {
            name: document.getElementById("name").value,
            lastname: document.getElementById("lastname").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            documentType: document.getElementById("documentType").value,
            document: document.getElementById("document").value
        };

        try {
            const response = await fetch("/api/auth/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                document.getElementById("confirmationMessage").textContent = "¡Perfil actualizado!";
                document.getElementById("confirmationMessage").style.display = "block";
                setTimeout(() => {
                    document.getElementById("confirmationMessage").style.display = "none";
                }, 3000);
            } else {
                alert("Error al guardar cambios");
            }
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
        }
    });

});
