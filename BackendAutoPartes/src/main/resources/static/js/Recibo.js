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

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', aplicarModoGuardado);

// Función para formatear fecha
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options).toUpperCase();
}

// Función para formatear moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);
}

// Función para cargar datos de la factura
async function loadInvoiceData() {
    try {
        // Obtener el ID de la factura de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const invoiceId = urlParams.get('id');

        if (!invoiceId) {
            throw new Error('No se proporcionó ID de factura');
        }

        // Simulación de llamada a la API (reemplazar con tu llamada real)
        //const response = await fetch(/api/invoices/${invoiceId});
        if (!response.ok) {
            throw new Error('Error al cargar la factura');
        }

        const invoiceData = await response.json();

        // Llenar los datos de la factura
        document.getElementById('invoice-date').textContent = formatDate(invoiceData.date);
        document.getElementById('invoice-number').textContent = invoiceData.invoiceNumber;
        document.getElementById('client-name').textContent = invoiceData.client.name;
        document.getElementById('client-phone').textContent = invoiceData.client.phone;
        document.getElementById('client-address').textContent = invoiceData.client.address;

        // Datos de pago
        document.getElementById('payment-method').textContent = invoiceData.payment.method;
        document.getElementById('payment-reference').textContent = invoiceData.payment.reference;

        // Llenar tabla de productos
        const itemsTableBody = document.getElementById('items-table-body');
        itemsTableBody.innerHTML = ''; // Limpiar tabla

        invoiceData.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(item.unitPrice)}</td>
                    <td>${formatCurrency(item.total)}</td>
                `;
            itemsTableBody.appendChild(row);
        });

        // Actualizar totales
        document.getElementById('subtotal').textContent = formatCurrency(invoiceData.subtotal);
        document.getElementById('tax').textContent = formatCurrency(invoiceData.tax);
        document.getElementById('discount').textContent = formatCurrency(invoiceData.discount || 0);
        document.getElementById('total-amount').textContent = formatCurrency(invoiceData.total);

    } catch (error) {
        console.error('Error al cargar la factura:', error);
        alert('Error al cargar los datos de la factura');
    }
}

function logout() {
    window.location.href = 'PrincipalUltimo.html';
}

function toggleMode() {
    document.body.classList.toggle('modo-claro');
}

// Cargar los datos cuando la página esté lista
document.addEventListener('DOMContentLoaded', loadInvoiceData);