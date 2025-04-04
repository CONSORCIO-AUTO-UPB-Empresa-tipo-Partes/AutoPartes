// Función para alternar entre modo claro y oscuro
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

                // Lógica para agregar, editar y eliminar lotes
                let lotes = [];
                let editando = false;
                let loteEditando = null;

                const formAgregarLote = document.getElementById("formAgregarLote");
                const tablaLotes = document.getElementById("tablaLotes");

                formAgregarLote.addEventListener("submit", function (e) {
                    e.preventDefault();

                    const lote = {
                        datearrival: document.getElementById("datearrival").value,
                        quantity: document.getElementById("quantity").value,
                        purchaseprice: document.getElementById("purchaseprice").value,
                        unitpurchaseprice: document.getElementById("unitpurchaseprice").value,
                        unitsaleprice: document.getElementById("unitsaleprice").value,
                        monthsofwarranty: document.getElementById("monthsofwarranty").value,
                        itemdescription: document.getElementById("itemdescription").value,
                        itemId: document.getElementById("itemId").value,
                        providerId: document.getElementById("providerId").value,
                        warrantyindays: document.getElementById("warrantyindays").value,
                        havewarranty: document.getElementById("havewarranty").value
                    };

                    if (editando) {
                        // Editar lote existente
                        lote.id = loteEditando.id;
                        fetch(`/api/batches/${lote.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(lote)
                        })
                        .then(response => response.json())
                        .then(data => {
                            lotes = lotes.map(l => l.id === data.id ? data : l);
                            actualizarTabla();
                            editando = false;
                            loteEditando = null;
                            formAgregarLote.reset();
                        })
                        .catch(error => console.error('Error:', error));
                    } else {
                        // Agregar nuevo lote
                        fetch('/api/batches', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(lote)
                        })
                        .then(response => response.json())
                        .then(data => {
                            lotes.push(data);
                            actualizarTabla();
                            formAgregarLote.reset();
                        })
                        .catch(error => console.error('Error:', error));
                    }
                });

                function actualizarTabla() {
                    tablaLotes.innerHTML = "";
                    lotes.forEach(lote => {
                        const fila = document.createElement("tr");
                        fila.innerHTML = `
                            <td>${lote.id}</td>
                            <td>${lote.datearrival}</td>
                            <td>${lote.providerId}</td>
                            <td>${lote.quantity}</td>
                            <td>${lote.itemId}</td>
                            <td>${lote.purchaseprice}</td>
                            <td>${lote.unitsaleprice}</td>
                            <td>${lote.monthsofwarranty}</td>
                            <td>${lote.warrantyindays}</td>
                            <td>${lote.itemdescription}</td>
                            <td>${lote.unitpurchaseprice}</td>
                            <td>${lote.unitsaleprice}</td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="editarLote(${lote.id})">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="eliminarLote(${lote.id})">Eliminar</button>
                            </td>
                        `;
                        tablaLotes.appendChild(fila);
                    });
                }

                function editarLote(id) {
                    loteEditando = lotes.find(l => l.id === id);
                    if (loteEditando) {
                        document.getElementById("datearrival").value = loteEditando.datearrival;
                        document.getElementById("quantity").value = loteEditando.quantity;
                        document.getElementById("purchaseprice").value = loteEditando.purchaseprice;
                        document.getElementById("unitpurchaseprice").value = loteEditando.unitpurchaseprice;
                        document.getElementById("unitsaleprice").value = loteEditando.unitsaleprice;
                        document.getElementById("monthsofwarranty").value = loteEditando.monthsofwarranty;
                        document.getElementById("itemdescription").value = loteEditando.itemdescription;
                        document.getElementById("itemId").value = loteEditando.itemId;
                        document.getElementById("providerId").value = loteEditando.providerId;
                        document.getElementById("warrantyindays").value = loteEditando.warrantyindays;
                        document.getElementById("havewarranty").value = loteEditando.havewarranty;
                        editando = true;
                    }
                }

                function eliminarLote(id) {
                    fetch(`/api/batches/${id}`, {
                        method: 'DELETE'
                    })
                    .then(() => {
                        lotes = lotes.filter(l => l.id !== id);
                        actualizarTabla();
                    })
                    .catch(error => console.error('Error:', error));
                }

                // Obtener lotes al cargar la página
                function obtenerLotes() {
                    fetch('/api/batches')
                    .then(response => response.json())
                    .then(data => {
                        lotes = data;
                        actualizarTabla();
                    })
                    .catch(error => console.error('Error:', error));
                }

                obtenerLotes();