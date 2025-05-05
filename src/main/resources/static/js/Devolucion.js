document.addEventListener('DOMContentLoaded', function() {
    // Elementos del formulario
    const form = document.getElementById('devolucionForm');
    const fechaCompraInput = document.getElementById('fechaCompra');
    const motivoDevolucionSelect = document.getElementById('motivoDevolucion');
    const detalleMotivoContainer = document.getElementById('detalleMotivoContainer');
    const garantiaInfo = document.getElementById('garantiaInfo');
    const garantiaProgress = document.getElementById('garantiaProgress');
    const diasRestantes = document.getElementById('diasRestantes');
    const mensajeError = document.getElementById('mensajeError');
    const mensajeExito = document.getElementById('mensajeExito');

    // Mostrar/ocultar campo de detalle cuando se selecciona "Otro motivo"
    motivoDevolucionSelect.addEventListener('change', function() {
        if (this.value === 'otro') {
            detalleMotivoContainer.style.display = 'block';
            document.getElementById('detalleMotivo').required = true;
        } else {
            detalleMotivoContainer.style.display = 'none';
            document.getElementById('detalleMotivo').required = false;
        }
    });

    // Calcular días de garantía cuando se selecciona fecha
    fechaCompraInput.addEventListener('change', function() {
        const fechaCompra = new Date(this.value);
        const hoy = new Date();

        // Validar que la fecha no sea futura
        if (fechaCompra > hoy) {
            garantiaInfo.textContent = 'La fecha de compra no puede ser futura';
            garantiaInfo.style.color = 'red';
            garantiaProgress.style.width = '0%';
            diasRestantes.textContent = 'Días restantes de garantía: 0/30';
            document.querySelector('button[type="submit"]').disabled = true;
            return;
        }

        // Calcular diferencia en días
        const diffTime = hoy - fechaCompra;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diasRestantesGarantia = 30 - diffDays;

        // Actualizar interfaz
        if (diffDays > 30) {
            garantiaInfo.textContent = 'Lo sentimos, el período de garantía de 30 días ha expirado.';
            garantiaInfo.style.color = 'red';
            garantiaProgress.style.width = '100%';
            diasRestantes.textContent = 'Días restantes de garantía: 0/30';
            document.querySelector('button[type="submit"]').disabled = true;
        } else {
            garantiaInfo.textContent = `Tienes ${diasRestantesGarantia} días restantes de garantía.`;
            garantiaInfo.style.color = 'green';
            const porcentajeUsado = (diffDays / 30) * 100;
            garantiaProgress.style.width = `${porcentajeUsado}%`;
            diasRestantes.textContent = `Días restantes de garantía: ${diasRestantesGarantia}/30`;
            document.querySelector('button[type="submit"]').disabled = false;
        }
    });

    // Validar formulario al enviar
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Ocultar mensajes previos
        mensajeError.classList.add('d-none');
        mensajeExito.classList.add('d-none');

        // Validar fecha de compra
        const fechaCompra = new Date(fechaCompraInput.value);
        const hoy = new Date();

        if (!fechaCompraInput.value) {
            mostrarError('Por favor ingresa la fecha de compra.');
            return;
        }

        if (fechaCompra > hoy) {
            mostrarError('La fecha de compra no puede ser futura.');
            return;
        }

        // Calcular diferencia en días
        const diffTime = hoy - fechaCompra;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 30) {
            mostrarError('Lo sentimos, el período de garantía de 30 días ha expirado. No podemos procesar tu devolución.');
            return;
        }

        // Si todo está bien, mostrar mensaje de éxito (simulación)
        mensajeExito.textContent = '¡Solicitud de devolución enviada con éxito! Nos comunicaremos contigo en un plazo de 48 horas.';
        mensajeExito.classList.remove('d-none');

        // Resetear formulario después de 3 segundos
        setTimeout(() => {
            form.reset();
            garantiaInfo.textContent = '';
            garantiaProgress.style.width = '0%';
            diasRestantes.textContent = 'Días restantes de garantía: 0/30';
            detalleMotivoContainer.style.display = 'none';
            mensajeExito.classList.add('d-none');
        }, 5000);
    });

    function mostrarError(mensaje) {
        mensajeError.textContent = mensaje;
        mensajeError.classList.remove('d-none');
    }

    // Aplicar modo guardado (del diseño anterior)
    function aplicarModoGuardado() {
        const modoGuardado = localStorage.getItem("modo");
        if (modoGuardado === "claro") {
            document.body.classList.add("modo-claro");
        }
    }

    aplicarModoGuardado();

    const selectPedido = document.getElementById('numeroPedido');
    if (!selectPedido) {
        console.error('Elemento con id "numeroPedido" no encontrado en el DOM');
        return;
    }
    cargarPedidos();

    selectPedido.addEventListener('change', async function() {
        const facturaId = this.value;
        if (!facturaId) return;

        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Token de autenticación no encontrado. Por favor, inicie sesión.');
            alert('Debe iniciar sesión para continuar');
            return;
        }

        try {
            const response = await fetch(`/api/bills/${facturaId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                }
            });

            if (response.ok) {
                const factura = await response.json();
                const detalleFactura = document.getElementById('detalleFactura');
                detalleFactura.style.display = 'block';
                console.log('Items de la factura:', factura.items);
                detalleFactura.innerHTML = `
                    <p><strong>Factura ID:</strong> ${factura.id}</p>
                    <p><strong>Fecha:</strong> ${new Date(factura.billDate).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> $${factura.totalPrice.toLocaleString()}</p>
                    <p><strong>Impuestos:</strong> $${factura.tax.toLocaleString()}</p>
                    <p><strong>Items:</strong></p>
                    <ul>
                        ${factura.items.map(item => {
                            const itemName = item.itemName || 'Nombre no disponible';
                            const itemQuantity = item.quantitySold || 'Cantidad no disponible';
                            const itemPrice = item.unitPrice || 0;
                            return `<li>${itemName} - Cantidad: ${itemQuantity}, Precio: $${itemPrice.toLocaleString()}</li>`;
                        }).join('')}
                    </ul>
                `;
                const fechaCompraInput = document.getElementById('fechaCompra');
                fechaCompraInput.value = new Date(factura.billDate).toISOString().split('T')[0];

                const fechaCompra = new Date(factura.billDate);
                const hoy = new Date();

                const diffTime = hoy - fechaCompra;
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                const diasRestantesGarantia = 30 - diffDays;

                const garantiaInfo = document.getElementById('garantiaInfo');
                const garantiaProgress = document.getElementById('garantiaProgress');
                const diasRestantes = document.getElementById('diasRestantes');

                if (diffDays > 30) {
                    garantiaInfo.textContent = 'Lo sentimos, el período de garantía de 30 días ha expirado.';
                    garantiaInfo.style.color = 'red';
                    garantiaProgress.style.width = '100%';
                    diasRestantes.textContent = 'Días restantes de garantía: 0/30';
                    document.querySelector('button[type="submit"]').disabled = true;
                } else {
                    garantiaInfo.textContent = `Tienes ${diasRestantesGarantia} días restantes de garantía.`;
                    garantiaInfo.style.color = 'green';
                    const porcentajeUsado = (diffDays / 30) * 100;
                    garantiaProgress.style.width = `${porcentajeUsado}%`;
                    diasRestantes.textContent = `Días restantes de garantía: ${diasRestantesGarantia}/30`;
                    document.querySelector('button[type="submit"]').disabled = false;
                }
            } else {
                console.error('Error al cargar la factura:', await response.text());
                alert('No se pudo cargar la factura. Verifique sus permisos o intente nuevamente.');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            alert('Ocurrió un error al intentar cargar la factura.');
        }
    });
});

// Función para cargar los pedidos realizados por el usuario autenticado
async function cargarPedidos() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Debe iniciar sesión para continuar');
        return;
    }

    try {
        const userDocument = await obtenerDocumentoUsuario();
        console.log('Documento del usuario:', userDocument);
        if (!userDocument) {
            console.error('No se pudo obtener el documento del usuario');
            return;
        }

        const response = await fetch(`/api/bills/customer/${userDocument}`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });

        if (response.ok) {
            const pedidos = await response.json();
            const selectPedido = document.getElementById('numeroPedido');

            pedidos.forEach(pedido => {
                const option = document.createElement('option');
                option.value = pedido.id;
                option.textContent = `Pedido #${pedido.id} - ${pedido.date}`;
                selectPedido.appendChild(option);
            });
        } else {
            console.error('Error al cargar pedidos:', await response.text());
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
    }
}

// Función auxiliar para obtener el documento del usuario
async function obtenerDocumentoUsuario() {
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch('/api/auth/profile', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });
        if (response.ok) {
            const user = await response.json();
            return user.document;
        }
    } catch (err) {
        console.error('Error al obtener perfil del usuario:', err);
    }
    return null;
}

// Función para cambiar el modo (del diseño anterior)
function toggleMode() {
    const body = document.body;
    body.classList.toggle("modo-claro");
    if (body.classList.contains("modo-claro")) {
        localStorage.setItem("modo", "claro");
    } else {
        localStorage.setItem("modo", "oscuro");
    }
}