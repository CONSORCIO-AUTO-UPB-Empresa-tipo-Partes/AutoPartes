document.addEventListener("DOMContentLoaded", function () {
    let proveedores = [];
    let editando = false;
    let proveedorEditando = null;

    const formAgregarProveedor = document.getElementById("formAgregarProveedor");
    const nombreProveedorInput = document.getElementById("nombreProveedor");
    const direccionInput = document.getElementById("direccionProveedor");
    const telefonoInput = document.getElementById("telefonoProveedor");
    const correoInput = document.getElementById("correoProveedor");
    const tablaProveedoresBody = document.getElementById("tablaProveedoresBody");

    formAgregarProveedor.addEventListener("submit", function (event) {
        event.preventDefault();
        const proveedorData = {
            name: nombreProveedorInput.value.trim(),
            address: direccionInput.value.trim(),
            phone: telefonoInput.value.trim(),
            email: correoInput.value.trim()
        };

        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            alert("Sesión expirada. Por favor inicia sesión.");
            window.location.href = "InicioSesionEmpleados.html";
            return;
        }

        if (editando) {
            Object.assign(proveedorEditando, proveedorData);
            fetch(`/api/providers/${proveedorEditando.idprovider}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(proveedorEditando)
            })
                .then(response => response.json())
                .then(data => {
                    proveedores = proveedores.map(prov => prov.idprovider === data.idprovider ? data : prov);
                    actualizarTabla();
                    editando = false;
                    proveedorEditando = null;
                    formAgregarProveedor.reset();
                    formAgregarProveedor.querySelector("button[type='submit']").textContent = "Agregar proveedor";
                })
                .catch(error => console.error('Error:', error));
        } else {
            agregarProveedor(proveedorData, authToken);
            formAgregarProveedor.reset();
        }
    });

    function agregarProveedor(proveedor, token) {
        fetch('/api/providers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(proveedor)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al agregar proveedor: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                proveedores.push(data);
                actualizarTabla();
            })
            .catch(error => console.error('Error:', error));
    }

    function actualizarTabla() {
        tablaProveedoresBody.innerHTML = "";
        proveedores.forEach(prov => {
            let fila = `
                <tr>
                    <td>${prov.idprovider}</td>
                    <td>${prov.name}</td>
                    <td>${prov.address}</td>
                    <td>${prov.phone}</td>
                    <td>${prov.email}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarProveedor(${prov.idprovider})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarProveedor(${prov.idprovider})">Eliminar</button>
                    </td>
                </tr>`;
            tablaProveedoresBody.innerHTML += fila;
        });
    }

    window.editarProveedor = function (id) {
        proveedorEditando = proveedores.find(prov => prov.idprovider === id);
        if (proveedorEditando) {
            nombreProveedorInput.value = proveedorEditando.name;
            direccionInput.value = proveedorEditando.address;
            telefonoInput.value = proveedorEditando.phone;
            correoInput.value = proveedorEditando.email;
            editando = true;
            formAgregarProveedor.querySelector("button[type='submit']").textContent = "Guardar cambios";
        }
    };

    window.eliminarProveedor = function (id) {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            alert("Sesión expirada. Por favor inicia sesión.");
            window.location.href = "InicioSesionEmpleados.html";
            return;
        }

        fetch(`/api/providers/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
            .then(response => {
                if (!response.ok) throw new Error(`Error al eliminar proveedor: ${response.status}`);
                proveedores = proveedores.filter(prov => prov.idprovider !== id);
                actualizarTabla();
            })
            .catch(error => console.error('Error:', error));
    };

    function obtenerProveedores() {
        const authToken = localStorage.getItem('authToken'); // Recuperar el token
        if (!authToken) {
            alert("Sesión no válida. Inicia sesión nuevamente.");
            window.location.href = "InicioSesionEmpleados.html";
            return;
        }

        fetch('/api/providers', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener proveedores: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            proveedores = data;
            actualizarTabla();
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
        });
    }

    // Cargar información del usuario actual
    document.addEventListener('DOMContentLoaded', function() {
        const userDataStr = localStorage.getItem('user');
        if (userDataStr) {
            try {
                const userData = JSON.parse(userDataStr);
                document.getElementById('userName').textContent = userData.name || 'Usuario';
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }

        const userImage = localStorage.getItem('userImage');
        if (userImage) {
            document.querySelector('#userInfo img').src = userImage;
        }
    });

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

    function verificarModo() {
        if (localStorage.getItem('modo') === 'claro') {
            document.body.classList.add('modo-claro');
        }
    }

    obtenerProveedores();
    aplicarModoGuardado();
});
