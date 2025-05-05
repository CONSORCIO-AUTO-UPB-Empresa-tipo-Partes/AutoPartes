document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("authToken");
    const userType = localStorage.getItem("userType");

    // Verificar acceso
    if (!token || userType !== "BODEGUERO") {
        alert("Acceso restringido. Debes iniciar sesión como Bodeguero.");
        window.location.href = "InicioSesionEmpleados.html";
        return;
    }

    // Asegurarse de que cargarProveedores se ejecute correctamente
    cargarProveedores();

    const formAgregarLote = document.getElementById("formAgregarLote");
    const tablaLotes = document.getElementById("tablaLotes");
    let lotes = [];

    // Modo claro/oscuro
    function toggleMode() {
        const body = document.body;
        body.classList.toggle("modo-claro");
        localStorage.setItem("modo", body.classList.contains("modo-claro") ? "claro" : "oscuro");
    }
    window.toggleMode = toggleMode;

    (function aplicarModoGuardado() {
        const modoGuardado = localStorage.getItem("modo");
        if (modoGuardado === "claro") document.body.classList.add("modo-claro");
    })();

    // Agregar lote
    formAgregarLote.addEventListener("submit", function (e) {
        e.preventDefault();

        const quantity = parseInt(document.getElementById("quantity").value);
        const purchasePrice = parseFloat(document.getElementById("purchaseprice").value);
        const haveWarranty = document.getElementById("havewarranty").value === "true";
        const monthsWarranty = haveWarranty ? parseInt(document.getElementById("monthsofwarranty").value || "0") : 0;
        const warrantyDays = monthsWarranty * 30; // Calcular días de garantía en base a los meses

        const unitPurchase = parseFloat((purchasePrice / quantity).toFixed(2));
        const unitSale = parseFloat((unitPurchase * 1.15).toFixed(2));

        const lote = {
            datearrival: new Date().toISOString(),
            quantity: quantity,
            purchaseprice: purchasePrice,
            unitpurchaseprice: unitPurchase,
            unitsaleprice: unitSale,
            monthsofwarranty: monthsWarranty,
            warrantyindays: warrantyDays,
            itemdescription: document.getElementById("itemdescription").value,
            itemId: parseInt(document.getElementById("itemId").value),
            providerId: parseInt(document.getElementById("providerId").value),
            havewarranty: haveWarranty
        };

        fetch("/api/batches", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(lote)
        })
            .then(response => {
                if (!response.ok) throw new Error("Error al agregar el lote");
                return response.json();
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

    function actualizarTablaLotes() {
        tablaLotes.innerHTML = "";

        lotes.forEach(lote => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
            <td>${lote.id}</td>
            <td>${lote.datearrival ? new Date(lote.datearrival).toLocaleDateString() : ''}</td>
            <td>${lote.providerName || 'No disponible'}</td>
            <td>${lote.quantity}</td>
            <td>${lote.itemName || 'No disponible'}</td>
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

    // Obtener lotes
    function obtenerLotes() {
        fetch("/api/batches", {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(data => {
                lotes = data;
                actualizarTablaLotes();
            })
            .catch(error => console.error("Error al obtener lotes:", error));
    }

    // Eliminar lote
    window.eliminarLote = function(id) {
        if (!confirm("¿Estás seguro de que deseas eliminar este lote?")) return;

        fetch(`/api/batches/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("No se pudo eliminar");
                lotes = lotes.filter(l => l.id !== id);
                actualizarTablaLotes();
                alert("Lote eliminado exitosamente");
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error al eliminar el lote: " + error.message);
            });
    };

    function cargarItemtypes() {
        fetch("/api/itemtypes", {
            headers: { "Authorization": "Bearer " + token }
        })
            .then(res => res.json())
            .then(data => {
                const selectItem = document.getElementById("itemId");
                selectItem.innerHTML = '<option value="">Seleccione un ítem</option>';
                data.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.id;
                    option.textContent = item.itemname;
                    selectItem.appendChild(option);
                });
            })
            .catch(err => console.error("Error cargando ítems:", err));
    }

    function cargarProveedores() {
        fetch("/api/providers", {
            headers: { "Authorization": "Bearer " + token }
        })
            .then(res => res.json())
            .then(data => {
                const selectProv = document.getElementById("providerId");
                selectProv.innerHTML = '<option value="">Seleccione un proveedor</option>';
                data.forEach(p => {
                    const option = document.createElement("option");
                    option.value = p.idprovider; // Usar idprovider como valor
                    option.textContent = p.name; // Usar name como texto
                    selectProv.appendChild(option);
                });
            })
            .catch(err => console.error("Error cargando proveedores:", err));
    }
    // --- CARGAR PROVEEDORES EN TABLA Y BÚSQUEDA ---
    function cargarProveedoresTabla() {
        fetch("/api/providers", {
            headers: { "Authorization": "Bearer " + token }
        })
            .then(res => res.json())
            .then(data => {
                proveedores = data;
                mostrarProveedores(proveedores);
            })
            .catch(error => {
                console.error("Error cargando proveedores:", error);
                alert("No se pudieron cargar los proveedores.");
            });
    }

    function mostrarProveedores(lista) {
        const tabla = document.getElementById("tablaProveedores");
        if (!tabla) return;
        tabla.innerHTML = "";
        lista.forEach(p => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${p.idprovider}</td>
                <td>${p.name}</td>
            `;
            tabla.appendChild(fila);
        });
    }

    function filtrarYMostrar() {
        const texto = document.getElementById("buscarProveedor").value.trim().toLowerCase();
        const filtrados = proveedores.filter(p =>
            p.name.toLowerCase().includes(texto) ||
            p.idprovider.toString().includes(texto)
        );
        mostrarProveedores(filtrados);
    }

    const inputBuscar = document.getElementById("buscarProveedor");
    const btnBuscar = document.getElementById("btnBuscarProveedor");
    if (inputBuscar) inputBuscar.addEventListener("input", filtrarYMostrar);
    if (btnBuscar) btnBuscar.addEventListener("click", filtrarYMostrar);

    // --- INICIALIZAR ---
    cargarProveedores();
    cargarItemtypes();
    obtenerLotes();
    cargarProveedoresTabla();
});