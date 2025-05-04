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
        } else {
            garantiaInfo.textContent = `Tienes ${diasRestantesGarantia} días restantes de garantía.`;
            garantiaInfo.style.color = 'green';
            const porcentajeUsado = (diffDays / 30) * 100;
            garantiaProgress.style.width = `${porcentajeUsado}%`;
            diasRestantes.textContent = `Días restantes de garantía: ${diasRestantesGarantia}/30`;
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
});

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