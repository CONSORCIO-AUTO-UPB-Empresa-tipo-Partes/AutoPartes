document.addEventListener("DOMContentLoaded", async () => { 
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        console.log("No auth token found, redirecting to login.");
        window.location.href = "InicioSesionClientes.html";
        return;
    }

    let userName = 'Usuario';

    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        try {
            const response = await fetch(`/api/auth/user-info?email=${encodeURIComponent(userEmail)}`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (!response.ok) {
                 if (response.status === 401 || response.status === 403) {
                    console.log("Token invalid/expired during user info fetch, redirecting.");
                    localStorage.clear();
                    window.location.href = 'InicioSesionClientes.html';
                    return;
                 }
                 console.error(`Error fetching user info: ${response.status}`);
                 const userDataStr = localStorage.getItem('user');
                 if (userDataStr) {
                     try {
                         const userData = JSON.parse(userDataStr);
                         userName = userData.name || userData.email || 'Usuario';
                     } catch (e) { console.error('Error parsing user data from local storage:', e); }
                 }
            } else {
                const userData = await response.json();
                localStorage.setItem('user', JSON.stringify(userData));
                userName = userData.name || userData.email || 'Usuario';
                console.log("User info fetched successfully:", userData);
            }
        } catch (error) {
            console.error('Network or other error fetching user info, trying local storage:', error);
            const userDataStr = localStorage.getItem('user');
            if (userDataStr) {
                try {
                    const userData = JSON.parse(userDataStr);
                    userName = userData.name || userData.email || 'Usuario';
                } catch (e) { console.error('Error parsing user data from local storage:', e); }
            }
        }
    } else {
        const userDataStr = localStorage.getItem('user');
        if (userDataStr) {
             try {
                 const userData = JSON.parse(userDataStr);
                 userName = userData.name || userData.email || 'Usuario';
             } catch (e) { console.error('Error parsing user data from local storage:', e); }
        }
    }

    console.log("User is authenticated. Proceeding with Secretaria page load.");

    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = userName;
    }

    aplicarModoGuardado();
    await cargarClientes();
});

function toggleMode() {
    const body = document.body;
    body.classList.toggle("modo-claro");

    if (body.classList.contains("modo-claro")) {
        localStorage.setItem("modo", "claro");
    } else {
        localStorage.setItem("modo", "oscuro");
    }
}

function aplicarModoGuardado() {
    const modoGuardado = localStorage.getItem("modo");
    if (modoGuardado === "claro") {
        document.body.classList.add("modo-claro");
    }
}

function mostrarEnviarCorreo() {
    const enviarCorreoDiv = document.getElementById("enviarCorreo");
    if (enviarCorreoDiv) {
        enviarCorreoDiv.classList.remove("hidden");
    } else {
        console.error("Element with ID 'enviarCorreo' not found.");
    }
}

document.getElementById("formEnviarCorreo").addEventListener("submit", function (event) {
    event.preventDefault();

    let destinatario = document.getElementById("destinatario").value;
    let asunto = document.getElementById("asunto").value;
    let mensaje = document.getElementById("mensajeCorreo").value;

    alert("Correo (simulación local) listo para enviar a: " + destinatario);
    document.getElementById("formEnviarCorreo").reset();
});

async function cargarClientes() {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        handleAuthError('cargar clientes');
        return;
    }

    const tableBody = document.getElementById('clientesTableBody');
    if (!tableBody) {
        console.error("Element with ID 'clientesTableBody' not found.");
        alert("Error interno: No se encontró la tabla de clientes.");
        return;
    }
    tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Cargando clientes...</td></tr>';

    try {
        console.log("Fetching clients from /api/persons/clients...");
        const response = await fetch('/api/persons/clients', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log("Received response for /api/persons/clients, status:", response.status);
        const clients = await handleResponse(response, 'cargar clientes');
        console.log("Processed clients data:", clients);

        tableBody.innerHTML = '';

        if (clients && clients.length > 0) {
            console.log(`Populating table with ${clients.length} clients.`);
            clients.forEach((client, index) => {
                const row = tableBody.insertRow();
                row.innerHTML = `
                    <td>${client.personname || 'N/A'}</td>
                    <td>${client.iddocument || 'N/A'} (${client.typedocument || 'N/A'})</td>
                    <td>${client.email || 'N/A'}</td>
                    <td>${client.phonenumber || 'N/A'}</td>
                    <td>
                        <button class="btn btn-sm btn-info me-1" onclick="mostrarDetallesCliente('${client.iddocument}')">
                            Ver Detalles
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="mostrarFacturasCliente('${client.iddocument}')">
                            Ver Facturas
                        </button>
                    </td>
                `;
            });
            console.log("Finished populating client table.");
        } else {
            console.log("No clients found or clients array is empty.");
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No se encontraron clientes.</td></tr>';
        }

    } catch (error) {
        console.error('Error caught in cargarClientes:', error);
        if (!error.handled) {
            console.error('Unhandled error during cargarClientes:', error);
            alert(`Error al cargar la lista de clientes: ${error.message || 'Error desconocido'}. Revise la consola (F12) para más detalles.`);
        }
        if (!error.handled) {
             tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Error al cargar clientes. Verifique la consola para más detalles.</td></tr>';
        } else {
             tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Error de autenticación. Redirigiendo...</td></tr>';
        }
    }
}

async function mostrarDetallesCliente(clienteId) {
    const modalBody = document.getElementById('clientDetailsModalBody');
    const modalTitle = document.getElementById('clientDetailsModalLabel');
    if (!modalBody || !modalTitle) {
        console.error("Modal elements not found!");
        alert("Error interno: No se pudo mostrar los detalles del cliente.");
        return;
    }
    modalBody.innerHTML = 'Cargando detalles...';
    modalTitle.textContent = 'Detalles del Cliente';

    if (!clienteId) {
        modalBody.innerHTML = 'ID de cliente inválido.';
        return;
    }

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        handleAuthError('mostrar detalles cliente');
        const modalElement = document.getElementById('clientDetailsModal');
        if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        }
        return;
    }

    try {
        console.log(`Fetching details for client ID: ${clienteId}`);
        const response = await fetch(`/api/persons/${clienteId}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log(`Received response for /api/persons/${clienteId}, status:`, response.status);
        const client = await handleResponse(response, 'mostrar detalles cliente');
        console.log("Processed client details:", client);

        if (client) {
            modalTitle.textContent = `Detalles de: ${client.personname || 'Cliente'}`;
            modalBody.innerHTML = `
                <p><strong>Nombre Completo:</strong> ${client.personname || 'N/A'}</p>
                <p><strong>Tipo Documento:</strong> ${client.typedocument || 'N/A'}</p>
                <p><strong>Número Documento:</strong> ${client.iddocument || 'N/A'}</p>
                <p><strong>Email:</strong> ${client.email || 'N/A'}</p>
                <p><strong>Teléfono:</strong> ${client.phonenumber || 'N/A'}</p>
                <p><strong>Dirección:</strong> ${client.personaddress || 'N/A'}</p>
                <hr>
                <p><strong>Tipo Persona:</strong> ${client.persontype || 'N/A'}</p>
                <p><strong>Tipo Usuario (Rol):</strong> ${client.usertype || 'N/A'}</p>
            `;
            const clientModalElement = document.getElementById('clientDetailsModal');
            if (clientModalElement) {
                 const clientModal = new bootstrap.Modal(clientModalElement);
                 clientModal.show();
            } else {
                console.error("Modal element #clientDetailsModal not found for showing.");
            }

        } else {
            console.log("Client details not found or empty.");
            modalBody.innerHTML = 'No se pudieron cargar los detalles del cliente.';
             const clientModalElement = document.getElementById('clientDetailsModal');
             if (clientModalElement) {
                 const clientModal = new bootstrap.Modal(clientModalElement);
                 clientModal.show();
             }
        }

    } catch (error) {
         console.error('Error caught in mostrarDetallesCliente:', error);
         if (!error.handled) {
            console.error('Unhandled error during mostrarDetallesCliente:', error);
            alert(`Error al obtener detalles del cliente: ${error.message || 'Error desconocido'}. Revise la consola (F12).`);
         }
        modalBody.innerHTML = 'Error al cargar detalles. Verifique la consola.';
         const clientModalElement = document.getElementById('clientDetailsModal');
         if (clientModalElement) {
             const clientModal = new bootstrap.Modal(clientModalElement);
             clientModal.show();
         }
    }
}

async function mostrarFacturasCliente(clienteDocumento) {
    const modalBody = document.getElementById('invoiceDetailsModalBody');
    const modalTitle = document.getElementById('invoiceDetailsModalLabel');
    if (!modalBody || !modalTitle) {
        console.error("Invoice modal elements not found!");
        alert("Error interno: No se pudo mostrar las facturas del cliente.");
        return;
    }
    modalBody.innerHTML = '<p class="text-center">Cargando facturas...</p>';
    modalTitle.textContent = 'Facturas del Cliente';

    if (!clienteDocumento) {
        modalBody.innerHTML = '<p class="text-center text-danger">Documento de cliente inválido.</p>';
        return;
    }

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        handleAuthError('mostrar facturas cliente');
        const modalElement = document.getElementById('invoiceDetailsModal');
        if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        }
        return;
    }

    try {
        console.log(`Fetching invoices for client document: ${clienteDocumento}`);
        const response = await fetch(`/api/bills/customer/${clienteDocumento}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log(`Received response for /api/bills/customer/${clienteDocumento}, status:`, response.status);
        const invoices = await handleResponse(response, 'mostrar facturas cliente');
        console.log("Processed invoices:", invoices);

        if (invoices && invoices.length > 0) {
            modalTitle.textContent = `Facturas de Cliente: ${clienteDocumento}`;
            let tableHTML = `
                <div class="table-responsive">
                    <table class="table table-sm table-hover table-striped table-bordered">
                        <thead class="table-light">
                            <tr>
                                <th>ID Factura</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Impuesto</th>
                                <th>Total con Imp.</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            invoices.forEach(invoice => {
                tableHTML += `
                    <tr>
                        <td>${invoice.id || 'N/A'}</td>
                        <td>${invoice.date ? new Date(invoice.date).toLocaleDateString() : 'N/A'}</td>
                        <td>${invoice.totalPriceWithoutTax != null ? invoice.totalPriceWithoutTax.toFixed(2) : 'N/A'}</td>
                        <td>${invoice.tax != null ? invoice.tax.toFixed(2) : 'N/A'}</td>
                        <td>${invoice.totalPriceWithTax != null ? invoice.totalPriceWithTax.toFixed(2) : 'N/A'}</td>
                    </tr>
                `;
            });
            tableHTML += `
                        </tbody>
                    </table>
                </div>
            `;
            modalBody.innerHTML = tableHTML;

        } else {
            console.log("No invoices found for this client.");
            modalTitle.textContent = `Facturas de Cliente: ${clienteDocumento}`;
            modalBody.innerHTML = '<p class="text-center">No se encontraron facturas para este cliente.</p>';
        }

    } catch (error) {
         console.error('Error caught in mostrarFacturasCliente:', error);
         if (!error.handled) {
            console.error('Unhandled error during mostrarFacturasCliente:', error);
            alert(`Error al obtener facturas del cliente: ${error.message || 'Error desconocido'}. Revise la consola (F12).`);
         }
        modalBody.innerHTML = '<p class="text-center text-danger">Error al cargar las facturas. Verifique la consola.</p>';
    }

    const invoiceModalElement = document.getElementById('invoiceDetailsModal');
    if (invoiceModalElement) {
         const invoiceModal = new bootstrap.Modal(invoiceModalElement);
         invoiceModal.show();
    } else {
        console.error("Modal element #invoiceDetailsModal not found for showing.");
    }
}

function handleAuthError(action) {
    console.error(`Authentication error during ${action}. Redirecting.`);
    if (!window.location.href.endsWith('InicioSesionClientes.html')) {
        alert("Su sesión ha expirado o no es válida. Por favor, inicie sesión de nuevo.");
        localStorage.clear();
        window.location.href = 'InicioSesionClientes.html';
    }
}

async function handleResponse(response, action, allowNoContent = false) {
    if (response.status === 401 || response.status === 403) {
        console.error(`Authorization error during ${action} (${response.status}). Redirecting.`);
        if (!window.location.href.endsWith('InicioSesionClientes.html')) {
            alert("Error de autorización. Su sesión puede haber expirado.");
            localStorage.clear();
            window.location.href = 'InicioSesionClientes.html';
        }
        const error = new Error(`Authorization required (${response.status})`);
        error.handled = true;
        throw error;
    }
    if (!response.ok && !(allowNoContent && response.status === 204)) {
        let errorMsg = `Error ${response.status} durante ${action}: ${response.statusText}`;
        try {
            const errorBody = await response.json();
            errorMsg = errorBody.message || errorBody.error || `Error ${response.status} durante ${action}`;
        } catch (e) { }
        const error = new Error(errorMsg);
        error.handled = false;
        throw error;
    }
    if (response.status === 204 && allowNoContent) {
        return null;
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        try {
            return await response.json();
        } catch (e) {
            console.error(`Error parsing JSON response during ${action}:`, e);
            const error = new Error(`Respuesta inválida del servidor durante ${action}.`);
            error.handled = false;
            throw error;
        }
    }
    try {
        return await response.text();
    } catch (e) {
        console.error(`Error reading text response during ${action}:`, e);
        const error = new Error(`Error leyendo respuesta del servidor durante ${action}.`);
        error.handled = false;
        throw error;
    }
}