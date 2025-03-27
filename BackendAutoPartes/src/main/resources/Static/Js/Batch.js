// URL base de la API
const API_URL = "http://tu-api.com/batch";

// Función para alternar entre modo claro y oscuro
function toggleMode() {
    const body = document.body;
    body.classList.toggle("modo-claro");

    // Guardar el estado del modo en localStorage
    localStorage.setItem("modo", body.classList.contains("modo-claro") ? "claro" : "oscuro");
}

// Aplicar el modo guardado al cargar la página
function aplicarModoGuardado() {
    if (localStorage.getItem("modo") === "claro") {
        document.body.classList.add("modo-claro");
    }
}
aplicarModoGuardado();

// Variables globales
const formAgregarLote = document.getElementById("formAgregarLote");
const tablaLotes = document.getElementById("tablaLotes");

// Cargar lotes desde la API al iniciar
async function cargarLotes() {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error("Error al cargar lotes");
        const lotes = await respuesta.json();
        actualizarTablaLotes(lotes);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Agregar lote
formAgregarLote.addEventListener("submit", async function (e) {
    e.preventDefault();

    const lote = {
        idBatch: document.getElementById("idBatch").value,
        date: document.getElementById("date").value,
        supplier: document.getElementById("supplier").value,
        quantity: parseInt(document.getElementById("quantity").value),
        idItemType: document.getElementById("idItemType").value,
        purchasePrice: parseFloat(document.getElementById("purchasePrice").value),
        sellingPrice: parseFloat(document.getElementById("sellingPrice").value),
        haveWarranty: document.getElementById("haveWarranty").value === "true",
        warrantyInDays: parseInt(document.getElementById("warrantyInDays").value),
        description: document.getElementById("description").value,
        unitPurchasePrice: parseFloat(document.getElementById("unitPurchasePrice").value),
        unitSellingPrice: parseFloat(document.getElementById("unitSellingPrice").value),
    };

    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(lote),
        });

        if (!respuesta.ok) throw new Error("Error al agregar lote");

        formAgregarLote.reset();
        cargarLotes(); // Recargar la tabla después de agregar
    } catch (error) {
        console.error("Error:", error);
    }
});

// Actualizar la tabla con los lotes de la API
function actualizarTablaLotes(lotes) {
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

// Editar lote (precarga datos y actualiza)
async function editarLote(idBatch) {
    try {
        const respuesta = await fetch(`${API_URL}/${idBatch}`);
        if (!respuesta.ok) throw new Error("Error al obtener lote");

        const lote = await respuesta.json();
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

        // Evento para actualizar después de editar
        formAgregarLote.onsubmit = async function (e) {
            e.preventDefault();
            await actualizarLote(idBatch);
        };
    } catch (error) {
        console.error("Error:", error);
    }
}

// Actualizar lote
async function actualizarLote(idBatch) {
    const loteActualizado = {
        idBatch: document.getElementById("idBatch").value,
        date: document.getElementById("date").value,
        supplier: document.getElementById("supplier").value,
        quantity: parseInt(document.getElementById("quantity").value),
        idItemType: document.getElementById("idItemType").value,
        purchasePrice: parseFloat(document.getElementById("purchasePrice").value),
        sellingPrice: parseFloat(document.getElementById("sellingPrice").value),
        haveWarranty: document.getElementById("haveWarranty").value === "true",
        warrantyInDays: parseInt(document.getElementById("warrantyInDays").value),
        description: document.getElementById("description").value,
        unitPurchasePrice: parseFloat(document.getElementById("unitPurchasePrice").value),
        unitSellingPrice: parseFloat(document.getElementById("unitSellingPrice").value),
    };

    try {
        const respuesta = await fetch(`${API_URL}/${idBatch}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loteActualizado),
        });

        if (!respuesta.ok) throw new Error("Error al actualizar lote");

        formAgregarLote.reset();
        formAgregarLote.onsubmit = agregarLote; // Restaurar evento
        cargarLotes();
    } catch (error) {
        console.error("Error:", error);
    }
}

// Eliminar lote
async function eliminarLote(idBatch) {
    try {
        const respuesta = await fetch(`${API_URL}/${idBatch}`, { method: "DELETE" });
        if (!respuesta.ok) throw new Error("Error al eliminar lote");

        cargarLotes();
    } catch (error) {
        console.error("Error:", error);
    }
}

// Cargar lotes al inicio
cargarLotes();
