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

    if (editando && loteEditando) {
        lote.id = loteEditando.id;

        fetch(`/api/batches/${lote.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
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
            .catch(error => console.error('Error al editar:', error));
    } else {
        fetch('/api/batches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lote)
        })
            .then(response => response.json())
            .then(data => {
                lotes.push(data);
                actualizarTabla();
                formAgregarLote.reset();
            })
            .catch(error => console.error('Error al agregar:', error));
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
            <td>${lote.unitpurchaseprice}</td>
            <td>${lote.unitsaleprice}</td>
            <td>${lote.monthsofwarranty}</td>
            <td>${lote.warrantyindays}</td>
            <td>${lote.itemdescription}</td>
            <td>${lote.havewarranty}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarLote(${lote.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarLote(${lote.id})">Eliminar</button>
            </td>
        `;
        tablaLotes.appendChild(fila);
    });
}

function editarLote(id) {
    const lote = lotes.find(l => l.id === id);
    if (lote) {
        loteEditando = lote;
        editando = true;

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
        document.getElementById("havewarranty").value = lote.havewarranty;
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
        .catch(error => console.error('Error al eliminar:', error));
}

function obtenerLotes() {
    fetch('/api/batches')
        .then(response => response.json())
        .then(data => {
            lotes = data;
            actualizarTabla();
        })
        .catch(error => console.error('Error al obtener lotes:', error));
}

obtenerLotes();
