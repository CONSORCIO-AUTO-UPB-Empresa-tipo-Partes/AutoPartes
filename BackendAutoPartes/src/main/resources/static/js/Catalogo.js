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

function comprarProducto(itemId) {
    // Lógica para manejar la compra del producto
    alert(`Producto con ID ${itemId} añadido al carrito.`);
}