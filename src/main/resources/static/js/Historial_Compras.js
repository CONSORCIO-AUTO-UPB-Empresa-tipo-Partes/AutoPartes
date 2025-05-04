document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
        // Obtener el perfil autenticado
        const profileResponse = await fetch("/api/auth/profile", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const profile = await profileResponse.json();
        console.log("🧾 Perfil recibido:", profile); // 👈 AGREGA ESTO

        const document = profile.document?.trim();
        console.log("📄 Documento del cliente:", document); // 👈 Y ESTO TAMBIÉN

        // Validar documento antes de continuar
        if (!document) {
            console.warn("⚠️ Documento del cliente no encontrado, abortando fetch de facturas.");
            return;
        }

        // Llamar al historial por documento
        const billsResponse = await fetch(`/api/bills/customer/${document}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const bills = await billsResponse.json();
        console.log("📦 Facturas recibidas:", bills);

        renderPurchaseHistory(bills);
    } catch (error) {
        console.error("❌ Error cargando historial de compras:", error);
    }
});

function renderPurchaseHistory(bills) {
    const container = document.getElementById("purchase-history");

    if (!bills || bills.length === 0) {
        container.innerHTML = "<p>No se encontraron compras registradas.</p>";
        return;
    }

    const historyHtml = bills.map(bill => {
        const itemsHtml = bill.items.map(item => `
            <tr>
                <td>${item.itemName}</td>
                <td>${item.itemDescription}</td>
                <td>${item.quantitySold}</td>
                <td>$${parseFloat(item.unitPrice).toLocaleString()}</td>
                <td>$${parseFloat(item.totalPrice).toLocaleString()}</td>
            </tr>
        `).join("");

        return `
            <div class="card mb-4 shadow-sm factura-box">
                <div class="card-header bg-dark text-white d-flex justify-content-between">
                    <span><strong>Factura #${bill.id}</strong></span>
                    <span><i class="bi bi-calendar"></i> ${bill.billDate?.split("T")[0]}</span>
                </div>
                <div class="card-body">
                    <h5 class="card-title text-primary-emphasis">Cliente: ${bill.customerName} (${bill.customerDocument})</h5>
                    
                    <div class="table-responsive">
                        <table class="table table-bordered table-dark table-sm mt-3">
                            <thead class="table-secondary text-dark">
                                <tr>
                                    <th>Producto</th>
                                    <th>Descripción</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                        </table>
                    </div>

                    <div class="mt-3 resumen-factura">
                        <p><strong>Total sin IVA:</strong> $${parseFloat(bill.totalPriceWithoutTax).toLocaleString()}</p>
                        <p><strong>IVA (19%):</strong> $${parseFloat(bill.tax).toLocaleString()}</p>
                        ${bill.hasDiscount ? `<p><strong>Descuento aplicado:</strong> ${parseFloat(bill.discountRate * 100).toFixed(0)}%</p>` : ""}
                        <p class="fs-5"><strong>Total pagado:</strong> $${parseFloat(bill.totalPrice).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    container.innerHTML = historyHtml;
}



