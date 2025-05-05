document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("No hay sesión activa");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const invoiceId = urlParams.get('id');
    if (!invoiceId) {
        alert("No se especificó ID de factura");
        return;
    }

    try {
        // Obtener perfil del usuario
        const profileRes = await fetch("/api/auth/profile", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!profileRes.ok) throw new Error("No se pudo obtener el perfil");

        const profile = await profileRes.json();
        console.log("✅ Perfil obtenido:", profile);

        const documentId = profile.document?.trim();
        if (!documentId) throw new Error("Documento del cliente no encontrado");
        console.log("📄 Documento del cliente:", documentId);

        // Obtener facturas
        const billsRes = await fetch(`/api/bills/customer/${documentId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!billsRes.ok) throw new Error("No se pudieron obtener las facturas");

        const bills = await billsRes.json();
        console.log("📦 Facturas obtenidas:", bills);

        // Buscar factura específica
        const invoiceId = urlParams.get('id'); // Get ID from URL
        if (!invoiceId) { // Check if ID exists in URL
            throw new Error("No se especificó ID de factura en la URL");
        }
        console.log("🆔 ID de factura buscado:", invoiceId);

        // Find the specific invoice from the list using the ID from the URL
        // Use == for type coercion as URL param is string and bill.id might be number
        const invoice = bills.find(bill => bill.id == invoiceId);

        // Check if the invoice was found
        if (!invoice) {
             // Provide a more specific error message
             throw new Error(`Factura con ID ${invoiceId} no encontrada para este cliente.`);
        }
        console.log("🧾 Factura encontrada:", invoice); // Log the actual invoice object

        // Renderizar factura (Now 'invoice' is defined and holds the correct data)
        document.getElementById('invoice-date').textContent = formatDate(invoice.billDate);
        document.getElementById('invoice-number').textContent = `#${invoice.id}`;
        document.getElementById('client-name').textContent = invoice.customerName;
        document.getElementById('client-phone').textContent = invoice.customerPhone || "123 456 7890";
        document.getElementById('client-address').textContent = invoice.customerAddress || "ange@gmail.com";
        document.getElementById('payment-method').textContent = invoice.paymentMethod || "Tarjeta de Credito";
        document.getElementById('payment-reference').textContent = invoice.paymentReference || "No aplica";

        const itemsTableBody = document.getElementById('items-table-body');
        itemsTableBody.innerHTML = ''; // Clear loading message

        invoice.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.itemName}</td>
                <td>${item.quantitySold}</td>
                <td>${formatCurrency(item.unitPrice)}</td>
                <td>${formatCurrency(item.totalPrice)}</td>
            `;
            itemsTableBody.appendChild(row);
        });

        document.getElementById('subtotal').textContent = formatCurrency(invoice.totalPriceWithoutTax);
        document.getElementById('tax').textContent = formatCurrency(invoice.tax);
        document.getElementById('discount').textContent = invoice.hasDiscount
            ? `${(invoice.discountRate * 100).toFixed(0)}% (${formatCurrency(invoice.totalPriceWithoutTax * invoice.discountRate)})` // Show discount amount
            : 'No aplica';
        document.getElementById('total-amount').textContent = formatCurrency(invoice.totalPrice);

    } catch (err) {
        console.error("❌ Error al cargar la factura:", err);
        alert("Error al cargar la factura: " + err.message);
        // Optionally display the error message in the HTML
        document.querySelector('.factura-container').innerHTML = `<p class="text-danger text-center">Error al cargar la factura: ${err.message}</p>`;
    }
});

// Funciones auxiliares
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options).toUpperCase();
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);
}
