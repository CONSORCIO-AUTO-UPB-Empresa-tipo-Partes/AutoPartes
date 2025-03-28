document.addEventListener("DOMContentLoaded", function () {
    const formAgregarLote = document.getElementById("formAgregarLote");
    const tablaLotes = document.getElementById("tablaLotes");

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

    // Función para obtener y mostrar los lotes existentes
    function obtenerLotes() {
        fetch("/api/batches")
            .then(response => response.json())
            .then(data => {
                lotes = data;
                actualizarTablaLotes();
            })
            .catch(error => console.error("Error al obtener los lotes:", error));
    }

    formAgregarLote.addEventListener("submit", function (e) {
        e.preventDefault();
        const lote = {
            datearrival: new Date(document.getElementById("datearrival").value).toISOString(),
            quantity: document.getElementById("quantity").value,
            purchaseprice: parseFloat(document.getElementById("purchaseprice").value),
            unitpurchaseprice: parseFloat(document.getElementById("unitpurchaseprice").value),
            unitsaleprice: parseFloat(document.getElementById("unitsaleprice").value),
            monthsofwarranty: document.getElementById("monthsofwarranty").value,
            itemdescription: document.getElementById("itemdescription").value,
            itemId: document.getElementById("itemId").value,
            providerId: document.getElementById("providerId").value,
            warrantyindays: document.getElementById("warrantyindays").value,
            havewarranty: document.getElementById("havewarranty").value === "true"
        };

        fetch("/api/batches", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(lote)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Error al agregar el lote");
                }
            })
            .then(data => {
                lotes.push(data);
                actualizarTablaLotes();
                formAgregarLote.reset();
                alert("Lote agregado exitosamente");
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error al agregar el lote");
            });
    });

    function actualizarTablaLotes() {
        tablaLotes.innerHTML = "";
        lotes.forEach((lote) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                                            <td>${lote.id}</td>
                                            <td>${lote.datearrival}</td>
                                            <td>${lote.providerName}</td>
                                            <td>${lote.quantity}</td>
                                            <td>${lote.itemName}</td>
                                            <td>$${lote.purchaseprice.toFixed(2)}</td>
                                            <td>$${lote.unitsaleprice.toFixed(2)}</td>
                                            <td>${lote.havewarranty ? "Sí" : "No"}</td>
                                            <td>${lote.warrantyindays}</td>
                                            <td>${lote.itemdescription}</td>
                                            <td>$${lote.unitpurchaseprice.toFixed(2)}</td>
                                            <td>$${lote.unitsaleprice.toFixed(2)}</td>
                                            <td>
                                                <button class="btn btn-primary btn-sm" onclick="editarLote(${lote.id})">Editar</button>
                                                <button class="btn btn-danger btn-sm" onclick="eliminarLote(${lote.id})">Eliminar</button>
                                            </td>
                                        `;
            tablaLotes.appendChild(fila);
        });
    }

    function editarLote(id) {
        const lote = lotes.find((l) => l.id === id);
        if (lote) {
            document.getElementById("datearrival").value = lote.datearrival;
            document.getElementById("quantity").value = lote.quantity;
            document.getElementById("purchaseprice").value = lote.purchaseprice;
            document.getElementById("unitpurchaseprice").value = lote.unitpurchaseprice;
            document.getElementById("unitsaleprice").value = lote.unitsaleprice;
            document.getElementById("monthsofwarranty").value = lote.monthsofwarranty;
            document.getElementById("itemdescription").value = lote.itemdescription;
            document.getElementById("itemId").value = lote.itemId;
            document.getElementById("providerId").value = lote.providerId;
            document.getElementById("warrantyindays").value = lote.warrantyindays;
            document.getElementById("havewarranty").value = lote.havewarranty ? "true" : "false";
            eliminarLote(id);
        }
    }

    function eliminarLote(id) {
        fetch(`/api/batches/${id}`, {
            method: "DELETE"
        })
            .then(response => {
                if (response.ok) {
                    lotes = lotes.filter((l) => l.id !== id);
                    actualizarTablaLotes();
                    alert("Lote eliminado exitosamente");
                } else {
                    throw new Error("Error al eliminar el lote");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error al eliminar el lote");
            });
    }

    // Llamar a la función para obtener los lotes al cargar la página
    obtenerLotes();
});