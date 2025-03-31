 feature/frontend/ArregloDeCatalogo
// Función para alternar entre modo claro y oscuro

document.addEventListener("DOMContentLoaded", function () {
    const formAgregarLote = document.getElementById("formAgregarLote");
    const tablaLotes = document.getElementById("tablaLotes");
    let lotes = []; // Variable para almacenar los lotes

    // Función para alternar entre modo claro y oscuro
 develop
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
    let idCounter = 1;

    const formAgregarLote = document.getElementById("formAgregarLote");
    const tablaLotes = document.getElementById("tablaLotes");

    // Evento para agregar un nuevo lote
    formAgregarLote.addEventListener("submit", function (e) {
        e.preventDefault();

        const dateArrivalValue = document.getElementById("datearrival").value;
        const dateArrival = dateArrivalValue ? new Date(dateArrivalValue).toISOString() : null;

        const lote = {
 feature/frontend/ArregloDeCatalogo
            idBatch: document.getElementById("idBatch").value,
            date: document.getElementById("date").value,
            supplier: document.getElementById("supplier").value,
            quantity: document.getElementById("quantity").value,
            idItemType: document.getElementById("idItemType").value,
            purchasePrice: parseFloat(document.getElementById("purchasePrice").value),
            sellingPrice: parseFloat(document.getElementById("sellingPrice").value),
            haveWarranty: document.getElementById("haveWarranty").value === "true",
            warrantyInDays: document.getElementById("warrantyInDays").value,
            description: document.getElementById("description").value,
            unitPurchasePrice: parseFloat(document.getElementById("unitPurchasePrice").value),
            unitSellingPrice: parseFloat(document.getElementById("unitSellingPrice").value),
        };

        lotes.push(lote);
        actualizarTablaLotes();
        formAgregarLote.reset();

            datearrival: dateArrival,
            quantity: parseInt(document.getElementById("quantity").value),
            purchaseprice: parseFloat(document.getElementById("purchaseprice").value),
            unitpurchaseprice: parseFloat(document.getElementById("unitpurchaseprice").value),
            unitsaleprice: parseFloat(document.getElementById("unitsaleprice").value),
            monthsofwarranty: parseInt(document.getElementById("monthsofwarranty").value),
            itemdescription: document.getElementById("itemdescription").value,
            itemId: parseInt(document.getElementById("itemId").value),
            providerId: parseInt(document.getElementById("providerId").value),
            warrantyindays: parseInt(document.getElementById("warrantyindays").value),
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
                }
                throw new Error("Error al agregar el lote");
            })
            .then(data => {
                lotes.push(data);
                actualizarTablaLotes();
                formAgregarLote.reset();
                alert("Lote agregado exitosamente");
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error al agregar el lote: " + error.message);
            });
 develop
    });

    // Función para actualizar la tabla de lotes
    function actualizarTablaLotes() {
        tablaLotes.innerHTML = "";

        // Crear encabezados de tabla si es necesario
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
            <th>ID</th>
            <th>Fecha Llegada</th>
            <th>Proveedor</th>
            <th>Cantidad</th>
            <th>Artículo</th>
            <th>Precio Compra</th>
            <th>Precio Venta Unitario</th>
            <th>Garantía</th>
            <th>Días Garantía</th>
            <th>Descripción</th>
            <th>Precio Unitario Compra</th>
            <th>Acciones</th>
        `;
        tablaLotes.appendChild(headerRow);

        // Llenar la tabla con los lotes
        lotes.forEach((lote) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
 feature/frontend/ArregloDeCatalogo
                <td>${lote.idBatch}</td>
                <td>${lote.date}</td>
                <td>${lote.supplier}</td>
                <td>${lote.quantity}</td>
                <td>${lote.idItemType}</td>
                <td>$${lote.purchasePrice.toFixed(2)}</td>
                <td>$${lote.sellingPrice.toFixed(2)}</td>
                <td>${lote.haveWarranty ? "Sí" : "No"}</td>
                <td>${lote.warrantyInDays}</td>
                <td>${lote.description}</td>
                <td>$${lote.unitPurchasePrice.toFixed(2)}</td>
                <td>$${lote.unitSellingPrice.toFixed(2)}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editarLote(${lote.idBatch})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarLote(${lote.idBatch})">Eliminar</button>

                <td>${lote.id}</td>
                <td>${lote.datearrival ? new Date(lote.datearrival).toLocaleDateString() : ''}</td>
                <td>${lote.providerName || lote.providerId}</td>
                <td>${lote.quantity}</td>
                <td>${lote.itemName || lote.itemId}</td>
                <td>$${lote.purchaseprice.toFixed(2)}</td>
                <td>$${lote.unitsaleprice.toFixed(2)}</td>
                <td>${lote.havewarranty ? "Sí" : "No"}</td>
                <td>${lote.warrantyindays}</td>
                <td>${lote.itemdescription}</td>
                <td>$${lote.unitpurchaseprice.toFixed(2)}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editarLote(${lote.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarLote(${lote.id})">Eliminar</button>
 develop
                </td>
            `;
            tablaLotes.appendChild(fila);
        });
    }

 feature/frontend/ArregloDeCatalogo
    function editarLote(idBatch) {
        const lote = lotes.find((l) => l.idBatch === idBatch);
        if (lote) {
            document.getElementById("idBatch").value = lote.idBatch;
            document.getElementById("date").value = lote.date;
            document.getElementById("supplier").value = lote.supplier;
            document.getElementById("quantity").value = lote.quantity;
            document.getElementById("idItemType").value = lote.idItemType;
            document.getElementById("purchasePrice").value = lote.purchasePrice;
            document.getElementById("sellingPrice").value = lote.sellingPrice;
            document.getElementById("haveWarranty").value = lote.haveWarranty ? "true" : "false";
            document.getElementById("warrantyInDays").value = lote.warrantyInDays;
            document.getElementById("description").value = lote.description;
            document.getElementById("unitPurchasePrice").value = lote.unitPurchasePrice;
            document.getElementById("unitSellingPrice").value = lote.unitSellingPrice;
            eliminarLote(idBatch);

    // Función para editar un lote
    window.editarLote = function(id) {
        const lote = lotes.find((l) => l.id === id);
        if (lote) {
            // Formatear la fecha para el input date (YYYY-MM-DD)
            const fecha = lote.datearrival ? new Date(lote.datearrival).toISOString().split('T')[0] : '';

            document.getElementById("datearrival").value = fecha;
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

            // Opcional: desplazarse al formulario para edición
            formAgregarLote.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Función para eliminar un lote
    window.eliminarLote = function(id) {
        if (!confirm("¿Estás seguro de que deseas eliminar este lote?")) {
            return;
 develop
        }

 feature/frontend/ArregloDeCatalogo
    function eliminarLote(idBatch) {
        lotes = lotes.filter((l) => l.idBatch !== idBatch);
        actualizarTablaLotes();
    }

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
                alert("Error al eliminar el lote: " + error.message);
            });
    };

    // Llamar a la función para obtener los lotes al cargar la página
    obtenerLotes();
});
 develop
