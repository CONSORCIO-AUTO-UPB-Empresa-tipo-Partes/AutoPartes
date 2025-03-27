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
    let idCounter = 1;

    const formAgregarLote = document.getElementById("formAgregarLote");
    const tablaLotes = document.getElementById("tablaLotes");

    formAgregarLote.addEventListener("submit", function (e) {
        e.preventDefault();
        const lote = {
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
    });

    function actualizarTablaLotes() {
        tablaLotes.innerHTML = "";
        lotes.forEach((lote) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
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
                </td>
            `;
            tablaLotes.appendChild(fila);
        });
    }

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
        }
    }

    function eliminarLote(idBatch) {
        lotes = lotes.filter((l) => l.idBatch !== idBatch);
        actualizarTablaLotes();
    }