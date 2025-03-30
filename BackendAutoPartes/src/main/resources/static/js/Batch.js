document.addEventListener("DOMContentLoaded", function () {
    const formAgregarLote = document.getElementById("formAgregarLote");
    const tablaLotes = document.getElementById("tablaLotes");
    let lotes = []; // Variable para almacenar los lotes

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

    // Evento para agregar un nuevo lote
    formAgregarLote.addEventListener("submit", function (e) {
        e.preventDefault();

        const dateArrivalValue = document.getElementById("datearrival").value;
        const dateArrival = dateArrivalValue ? new Date(dateArrivalValue).toISOString() : null;

        const lote = {
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
                </td>
            `;
            tablaLotes.appendChild(fila);
        });
    }

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