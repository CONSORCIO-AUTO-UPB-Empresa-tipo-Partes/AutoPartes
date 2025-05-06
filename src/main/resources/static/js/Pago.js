// filepath: src/main/resources/static/js/Pago.js
document.addEventListener('DOMContentLoaded', () => {
    const totalAmountElement = document.getElementById('total-amount');
    const emailElement = document.getElementById('email');
    const payButton = document.getElementById('pay-button');
    const paymentStatusElement = document.getElementById('payment-status');
    const token = localStorage.getItem('authToken');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalAmount = 0;
    let userEmail = ''; // We'll get this from the profile
    let customerDocument = ''; // Store customer document here

    if (!token) {
        showError('No estás autenticado. Redirigiendo al inicio...');
        setTimeout(() => window.location.href = 'InicioSesionCliente.html', 2000);
        return;
    }

    if (cart.length === 0) {
        showError('El carrito está vacío. Redirigiendo al catálogo...');
        setTimeout(() => window.location.href = 'Catalogo.html', 2000);
        return;
    }

    // Calculate total and get user email/document
    async function initializePayment() {
        totalAmount = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        totalAmountElement.textContent = totalAmount.toLocaleString();

        try {
            const profileResponse = await fetch("/api/auth/profile", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!profileResponse.ok) {
                 const errorText = await profileResponse.text();
                 throw new Error(`No se pudo obtener el perfil: ${errorText} (${profileResponse.status})`);
            }
            const profile = await profileResponse.json();

            if (!profile.email || !profile.document) {
                throw new Error('La información del perfil (email o documento) está incompleta.');
            }

            userEmail = profile.email;
            customerDocument = profile.document; // Store the document
            emailElement.value = userEmail;
            payButton.disabled = false; // Enable button once data is loaded
        } catch (error) {
            showError(`Error al cargar datos: ${error.message}`);
            payButton.disabled = true;
        }
    }

    payButton.addEventListener('click', processMockPayment);

    async function processMockPayment() {
        payButton.disabled = true;
        showStatus('Procesando pago simulado...', 'info');

        const paymentPayload = {
            amount: totalAmount,
            email: userEmail
        };

        try {
            const response = await fetch('/api/mock-payments/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include token if your mock API requires it
                },
                body: JSON.stringify(paymentPayload)
            });

            const result = await response.json();

            if (response.ok && result.status === 'approved') {
                showStatus(`Pago simulado aprobado (ID: ${result.paymentId}). Creando factura...`, 'success');
                // Proceed to create the actual bill and update stock
                await createBillAndUpdateStock(result.paymentId);
            } else {
                throw new Error(result.message || 'El pago simulado falló.');
            }

        } catch (error) {
            showError(`Error en el pago: ${error.message}`);
            payButton.disabled = false; // Re-enable button on failure
        }
    }

    async function createBillAndUpdateStock(paymentId) {
        // Use the customerDocument fetched during initialization
        if (!customerDocument) {
             showError('Error crítico: No se encontró el documento del cliente para crear la factura.');
             payButton.disabled = false; // Re-enable button
             return;
        }

        const billRequest = {
            customerDocument: customerDocument, // Use stored document
            items: cart.map(item => ({
                batchId: item.batchId,
                quantity: item.quantity
                // Consider adding unitPrice here if your backend /api/bills endpoint requires it
                // unitPrice: item.unitPrice
            })),
            hasDiscount: false, // Adjust as needed
            discountRate: 0,    // Adjust as needed
            paymentReference: paymentId // Optional: Link bill to mock payment
        };

        try {
            const billResponse = await fetch('/api/bills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(billRequest)
            });

            if (!billResponse.ok) {
                const errorMsg = await billResponse.text();
                throw new Error(`Error al crear la factura: ${errorMsg}`);
            }

            const createdBill = await billResponse.json();

            if (!createdBill || !createdBill.id) {
                 throw new Error('La respuesta de creación de factura no incluyó un ID válido.');
            }

            showStatus('Factura creada. Actualizando stock...', 'info');

            // Update stock (batch quantities) - Consider more robust error handling here
            let stockUpdateErrors = [];
            for (const item of cart) {
                try {
                    const stockResponse = await fetch(`/api/batches/sell/${item.batchId}?quantity=${item.quantity}`, {
                        method: 'PUT',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!stockResponse.ok) {
                         stockUpdateErrors.push(`Error al actualizar stock para batch ${item.batchId}.`);
                         console.warn(`Error al actualizar stock para batch ${item.batchId}. Status: ${stockResponse.status}`);
                    }
                } catch (stockError) {
                     stockUpdateErrors.push(`Error de red al actualizar stock para batch ${item.batchId}.`);
                     console.error(`Error de red al actualizar stock para batch ${item.batchId}:`, stockError);
                }
            }

             if (stockUpdateErrors.length > 0) {
                 // Handle stock update failures (e.g., notify admin, show partial success message)
                 showError(`Compra completada, pero hubo errores al actualizar el stock: ${stockUpdateErrors.join(' ')}. Contacte a soporte.`);
                 // Do NOT clear cart or redirect immediately if stock update failed partially
             } else {
                 showStatus('¡Compra completada! Redirigiendo al recibo...', 'success');
                 localStorage.removeItem('cart'); // Clear cart only on full success

                 // Redirect to the receipt page, using 'id' as the parameter name
                 setTimeout(() => {
                     window.location.href = `Recibo.html?id=${createdBill.id}`; // Use 'id' instead of 'billId'
                 }, 2000);
             }

        } catch (error) {
            showError(`Error al finalizar compra: ${error.message}`);
            // Consider how to handle payment success but bill/stock failure (e.g., refund simulation, admin notification)
            payButton.disabled = false; // Re-enable button on failure
        }
    }

    function showStatus(message, type = 'info') {
        paymentStatusElement.style.display = 'block';
        paymentStatusElement.className = `mt-3 alert alert-${type}`;
        paymentStatusElement.textContent = message;
    }

    function showError(message) {
        showStatus(message, 'danger');
    }

    // Initialize
    payButton.disabled = true; // Disable button initially
    initializePayment();
});
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
