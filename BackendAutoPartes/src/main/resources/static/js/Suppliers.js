document.addEventListener("DOMContentLoaded", function () {
                    let proveedores = [];
                    let editando = false;
                    let proveedorEditando = null;

                    const formAgregarProveedor = document.getElementById("formAgregarProveedor");
                    const nombreProveedorInput = document.getElementById("nombreProveedor");
                    const tablaProveedoresBody = document.getElementById("tablaProveedoresBody");

                    formAgregarProveedor.addEventListener("submit", function (event) {
                        event.preventDefault();
                        let nombre = nombreProveedorInput.value.trim();

                        if (editando) {
                            // Editar proveedor existente
                            proveedorEditando.name = nombre;
                            fetch(`/api/providers/${proveedorEditando.idprovider}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(proveedorEditando)
                            })
                            .then(response => response.json())
                            .then(data => {
                                proveedores = proveedores.map(prov => prov.idprovider === data.idprovider ? data : prov);
                                actualizarTabla();
                                editando = false;
                                proveedorEditando = null;
                                document.querySelector("#formAgregarProveedor button[type='submit']").textContent = "Agregar proveedor";
                            })
                            .catch(error => console.error('Error:', error));
                        } else {
                            // Agregar nuevo proveedor
                            let nuevoProveedor = {
                                name: nombre
                            };
                            agregarProveedor(nuevoProveedor);
                        }

                        formAgregarProveedor.reset();
                    });

                    function agregarProveedor(proveedor) {
                        fetch('/api/providers', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(proveedor)
                        })
                        .then(response => response.json())
                        .then(data => {
                            proveedores.push(data);
                            actualizarTabla();
                        })
                        .catch(error => console.error('Error:', error));
                    }

                    function actualizarTabla() {
                        tablaProveedoresBody.innerHTML = "";
                        proveedores.forEach(prov => {
                            let fila = `<tr>
                                            <td>${prov.idprovider}</td>
                                            <td>${prov.name}</td>
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
                            editando = true;
                            document.querySelector("#formAgregarProveedor button[type='submit']").textContent = "Guardar cambios";
                        }
                    };

                    window.eliminarProveedor = function (id) {
                        fetch(`/api/providers/${id}`, {
                            method: 'DELETE'
                        })
                        .then(() => {
                            proveedores = proveedores.filter(prov => prov.idprovider !== id);
                            actualizarTabla();
                        })
                        .catch(error => console.error('Error:', error));
                    };

                    // Obtener proveedores al cargar la página
                    function obtenerProveedores() {
                        fetch('/api/providers')
                        .then(response => response.json())
                        .then(data => {
                            proveedores = data;
                            actualizarTabla();
                        })
                        .catch(error => console.error('Error:', error));
                    }

                    obtenerProveedores();
                });