document.addEventListener('DOMContentLoaded', function() {
    cargarCatalogo();
});

async function cargarCatalogo() {
    try {
        const response = await fetch('/api/catalog/itemtypes-with-batches');
        const catalogo = await response.json();
        mostrarCatalogo(catalogo);
    } catch (error) {
        console.error('Error al cargar el catálogo:', error);
    }
}

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

function mostrarCatalogo(catalogo) {
    const catalogoContainer = document.getElementById('catalogoContainer');
    catalogoContainer.innerHTML = '';

    catalogo.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'col-md-4 mb-4 item-card';
        itemCard.dataset.itemName = item.itemType.itemname.toLowerCase();
        itemCard.innerHTML = `
            <div class="card">
                <img src="${item.itemType.imagepath}" class="card-img-top" alt="${item.itemType.itemname}">
                <div class="card-body">
                    <h5 class="card-title">${item.itemType.itemname}</h5>
                    <p class="card-text">${item.itemType.itemdescription}</p>
                    <ul class="list-group list-group-flush">
                        ${item.batches.map(batch => `
                            <li class="list-group-item">
                                <strong>Lote:</strong> ${batch.id} -
                                <strong>Precio:</strong> $${batch.unitsaleprice} -
                                <strong>Cantidad:</strong> ${batch.quantity}
                            </li>
                        `).join('')}
                    </ul>
                    <button class="btn btn-primary mt-3" onclick="comprarProducto(${item.itemType.id})">Comprar</button>
                </div>
            </div>
        `;
        catalogoContainer.appendChild(itemCard);
    });
}

function filtrarCatalogo() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const itemCards = document.querySelectorAll('.item-card');

    itemCards.forEach(card => {
        const itemName = card.dataset.itemName;
        if (itemName.includes(searchInput)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function comprarProducto(itemId) {
    // Lógica para manejar la compra del producto
    alert(`Producto con ID ${itemId} añadido al carrito.`);
}