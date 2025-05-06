// Catalogo.js

document.addEventListener('DOMContentLoaded', function() {
    cargarCatalogo();
});

async function cargarCatalogo() {
    try {
        const token = localStorage.getItem('authToken');
        console.log("TOKEN ACTUAL:", token);
        if (!token) {
            window.location.href = 'InicioSesionCliente.html';
            return;
        }

        const response = await fetch('/api/catalog/itemtypes-with-batches', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (!response.ok) {
            if (response.status === 403 || response.status === 401) {
                alert('Tu sesión ha expirado o no tienes permisos. Inicia sesión nuevamente.');
                window.location.href = 'InicioSesionCliente.html';
            } else {
                throw new Error('Error al cargar el catálogo');
            }
            return;
        }

        const catalogo = await response.json();
        mostrarCatalogo(catalogo);
    } catch (error) {
        console.error('Error al cargar el catálogo:', error);
    }
}

function mostrarCatalogo(catalogo) {
    const catalogoContainer = document.getElementById('catalogoContainer');
    catalogoContainer.innerHTML = '';

    catalogo.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'col-md-4 mb-4';

        itemCard.innerHTML = `
            <div class="card">
                <img src="${item.itemType.imagepath}" class="card-img-top" alt="${item.itemType.itemname}">
                <div class="card-body">
                    <h5 class="card-title">${item.itemType.itemname}</h5>
                    <p class="card-text">${item.itemType.itemdescription}</p>
                    <button class="btn btn-primary" onclick='mostrarModal(${JSON.stringify(item).replace(/'/g, "\'").replace(/"/g, '&quot;')})'>Comprar</button>
                </div>
            </div>
        `;

        catalogoContainer.appendChild(itemCard);
    });
}

function mostrarModal(item) {
    const modalHtml = `
        <div class="modal fade" id="modalCompra" tabindex="-1" aria-labelledby="modalCompraLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content" style="background-color: #111; color: white;">
                    <div class="modal-header border-0">
                        <h5 class="modal-title" id="modalCompraLabel">${item.itemType.itemname}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body row">
                        <div class="col-md-5">
                            <img src="${item.itemType.imagepath}" class="img-fluid rounded" alt="Imagen del producto">
                        </div>
                        <div class="col-md-7">
                            <p><strong>Descripción:</strong> ${item.itemType.itemdescription}</p>

                            <div class="mb-3">
                                <label for="selectBatch" class="form-label">Selecciona un lote:</label>
                                <select class="form-select" id="selectBatch" onchange="actualizarModal()">
                                    ${item.batches.map(batch => `
                                        <option value="${batch.id}" data-price="${batch.unitsaleprice}" data-available="${batch.quantity}">
                                            Lote ${batch.id} - $${parseFloat(batch.unitsaleprice).toLocaleString()} - ${batch.quantity} unidades
                                        </option>
                                    `).join('')}
                                </select>
                            </div>

                            <div class="d-flex align-items-center mb-3">
                                <label class="me-2">Cantidad:</label>
                                <button class="btn btn-outline-light btn-sm" onclick="ajustarCantidad(-1)">−</button>
                                <input type="number" id="cantidad" class="form-control mx-2" style="width: 70px;" value="1" min="1">
                                <button class="btn btn-outline-light btn-sm" onclick="ajustarCantidad(1)">+</button>
                            </div>

                            <div class="detalle-compra mt-3">
                                <p><strong>Lote Seleccionado:</strong> #<span id="loteSeleccionado">-</span></p>
                                <p><strong>Precio Unitario:</strong> $<span id="precio">-</span></p>
                                <p><strong>Disponibles:</strong> <span id="disponible">-</span> unidades</p>
                                <hr>
                                <p class="fs-5"><strong>Total a pagar:</strong> $<span id="total">-</span></p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-success" onclick='confirmarCompra(${JSON.stringify(item).replace(/'/g, "\\'").replace(/"/g, '&quot;')})'>Agregar al carrito</button>
                    </div>
                </div>
            </div>
        </div>`;

    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = modalHtml;
    const modal = new bootstrap.Modal(document.getElementById('modalCompra'));
    modal.show();

    sessionStorage.setItem('itemActual', JSON.stringify(item));
    actualizarModal();
}


function actualizarModal() {
    const select = document.getElementById('selectBatch');
    const selected = select.options[select.selectedIndex];
    const precio = parseFloat(selected.dataset.price);
    const disponible = parseInt(selected.dataset.available);
    const cantidadInput = document.getElementById('cantidad');

    cantidadInput.max = disponible;
    if (parseInt(cantidadInput.value) > disponible) {
        cantidadInput.value = disponible;
    }

    document.getElementById('precio').textContent = precio.toFixed(2);
    document.getElementById('disponible').textContent = disponible;
    document.getElementById('loteSeleccionado').textContent = `#${selected.value}`;
    actualizarTotal();

    const stockBajo = disponible <= 5;
    document.getElementById('disponible').textContent = disponible;
    document.getElementById('disponible').style.color = stockBajo ? '#FF335F' : 'inherit';

}


function ajustarCantidad(delta) {
    const cantidadInput = document.getElementById('cantidad');
    let nuevaCantidad = parseInt(cantidadInput.value) + delta;
    const max = parseInt(cantidadInput.max);
    if (nuevaCantidad < 1) nuevaCantidad = 1;
    if (nuevaCantidad > max) nuevaCantidad = max;
    cantidadInput.value = nuevaCantidad;
    actualizarTotal();
}

function actualizarTotal() {
    const precio = parseFloat(document.getElementById('precio').textContent);
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const total = precio * cantidad;
    document.getElementById('total').textContent = total.toFixed(2);
}

function confirmarCompra(item) {
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const batchId = document.getElementById('selectBatch').value;
    const batch = item.batches.find(b => b.id == batchId);

    const producto = {
        itemId: item.itemType.id,
        itemName: item.itemType.itemname,
        itemDescription: item.itemType.itemdescription,
        itemImage: item.itemType.imagepath,
        batchId: batch.id,
        unitPrice: batch.unitsaleprice,
        quantity: cantidad
    };

    let carrito = JSON.parse(localStorage.getItem('cart')) || [];
    const idx = carrito.findIndex(p => p.batchId == producto.batchId);
    if (idx >= 0) {
        carrito[idx].quantity += cantidad;
    } else {
        carrito.push(producto);
    }

    localStorage.setItem('cart', JSON.stringify(carrito));
    bootstrap.Modal.getInstance(document.getElementById('modalCompra')).hide();
    alert(`Agregado ${cantidad} unidades de ${producto.itemName} al carrito.`);
}

function logout() {
    localStorage.removeItem('authToken');
}
function toggleMode() {
    const body = document.body;
    body.classList.toggle("modo-claro");

    // Guardar preferencia en localStorage
    if (body.classList.contains("modo-claro")) {
        localStorage.setItem("modo", "claro");
    } else {
        localStorage.setItem("modo", "oscuro");
    }
}

// Aplicar modo al cargar la página
function aplicarModoGuardado() {
    const modoGuardado = localStorage.getItem("modo");
    if (modoGuardado === "claro") {
        document.body.classList.add("modo-claro");
    }
}
