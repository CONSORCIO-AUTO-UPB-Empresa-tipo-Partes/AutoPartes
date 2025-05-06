document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("authToken");
    const userType = localStorage.getItem("userType");

    if (!token || userType !== "BODEGUERO") {
        alert("Acceso restringido. Debes iniciar sesión como Bodeguero.");
        window.location.href = "InicioSesionEmpleados.html";
        return;
    }

    const tablaProveedores = document.getElementById("tablaProveedores");
    const btnBuscar = document.getElementById("btnBuscarProveedor");
    const inputBuscar = document.getElementById("buscarProveedor");

    function mostrarProveedores(proveedores) {
        tablaProveedores.innerHTML = "";

        if (!proveedores.length) {
            const fila = document.createElement("tr");
            fila.innerHTML = `<td colspan="2">No se encontraron proveedores.</td>`;
            tablaProveedores.appendChild(fila);
            return;
        }

        proveedores.forEach(p => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${p.idprovider}</td>
                <td>${p.name}</td>
            `;
            tablaProveedores.appendChild(fila);
        });
    }

    function buscarProveedor() {
        const criterio = inputBuscar.value.trim().toLowerCase();

        fetch("/api/providers", {
            headers: { "Authorization": "Bearer " + token }
        })
            .then(res => res.json())
            .then(data => {
                if (!criterio) {
                    mostrarProveedores(data);
                    return;
                }

                const filtrados = data.filter(p =>
                    p.name.toLowerCase().includes(criterio) ||
                    p.idprovider.toString().includes(criterio)
                );

                mostrarProveedores(filtrados);
            })
            .catch(error => {
                console.error("Error al buscar proveedores:", error);
                tablaProveedores.innerHTML = `<tr><td colspan="2">Error al cargar los proveedores.</td></tr>`;
            });
    }

    btnBuscar.addEventListener("click", buscarProveedor);
});
