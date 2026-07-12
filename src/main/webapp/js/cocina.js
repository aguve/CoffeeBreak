let tiemposPedido = {};

document.addEventListener('DOMContentLoaded', function() {
    cargarPedidosCocina();
    cargarEmpleadosCocina();
    setInterval(cargarPedidosCocina, 10000);
    setInterval(cargarEmpleadosCocina, 30000);
    setInterval(actualizarTiempos, 1000);
});

async function cargarPedidosCocina() {
    try {
        const pedidos = await API.get(API.getBaseUrl() + '/api/pedidos');
        renderizarPedidosCocina(pedidos);
    } catch (error) {
        console.error('Error cargando pedidos de cocina:', error);
    }
}

function renderizarPedidosCocina(pedidos) {
    const colPendientes = document.getElementById('colPendientes');
    const colPreparacion = document.getElementById('colPreparacion');
    if (!colPendientes || !colPreparacion) return;

    const todos = pedidos || [];
    const pendientes = todos.filter(p => p.nombreEstado === 'Pendiente');
    const enPreparacion = todos.filter(p => p.nombreEstado === 'En preparaci\u00f3n');
    const procesados = todos.filter(p =>
        p.nombreEstado === 'Listo para recoger' || p.nombreEstado === 'Entregado'
    );
    const activos = [...pendientes, ...enPreparacion];

    document.getElementById('orderCountBadge').textContent = activos.length + ' activos';
    document.getElementById('pendientesCount').textContent = pendientes.length;
    document.getElementById('preparacionCount').textContent = enPreparacion.length;
    document.getElementById('statProcesados').textContent = procesados.length;
    document.getElementById('statPendientes').textContent = pendientes.length;
    document.getElementById('statEnPreparacion').textContent = enPreparacion.length;
    document.getElementById('statHoy').textContent = todos.length;

    if (pendientes.length === 0) {
        colPendientes.innerHTML = '<div class="kitchen-empty"><i class="bi bi-inbox"></i><p>Sin pedidos pendientes</p></div>';
    } else {
        colPendientes.innerHTML = '';
        pendientes.forEach(pedido => {
            colPendientes.appendChild(crearTarjetaPedido(pedido, 'pendiente'));
        });
    }

    if (enPreparacion.length === 0) {
        colPreparacion.innerHTML = '<div class="kitchen-empty"><i class="bi bi-inbox"></i><p>Sin pedidos en cocina</p></div>';
    } else {
        colPreparacion.innerHTML = '';
        enPreparacion.forEach(pedido => {
            colPreparacion.appendChild(crearTarjetaPedido(pedido, 'preparacion'));
        });
    }
}

function crearTarjetaPedido(pedido, tipo) {
    if (!tiemposPedido[pedido.idPedido]) {
        tiemposPedido[pedido.idPedido] = Date.now();
    }
    const div = document.createElement('div');
    div.className = 'mcd-order ' + tipo;
    div.id = 'pedido_' + pedido.idPedido;

    const esNuevo = tipo === 'pendiente' && (Date.now() - tiemposPedido[pedido.idPedido]) < 30000;
    if (esNuevo) div.classList.add('orden-nueva');

    const btnHtml = tipo === 'pendiente'
        ? `<button class="mcd-order-action btn-iniciar" onclick="enviarACocina(${pedido.idPedido})"><i class="bi bi-play-fill"></i> Iniciar</button>`
        : `<button class="mcd-order-action btn-listo" onclick="marcarListo(${pedido.idPedido})"><i class="bi bi-check-lg"></i> Listo</button>`;

    div.innerHTML = `
        <div class="mcd-order-top">
            <span class="mcd-order-id">#${pedido.idPedido}</span>
            <span class="mcd-order-timer timer-ok" id="timer_${pedido.idPedido}">0:00</span>
        </div>
        <div class="mcd-order-customer"><i class="bi bi-person me-1"></i>${pedido.nombreCliente || 'Cliente'}</div>
        <ul class="mcd-order-items" id="mcdItems_${pedido.idPedido}">
            <li><span class="item-qty">...</span> Cargando...</li>
        </ul>
        ${btnHtml}
    `;
    return div;
}

function actualizarTiempos() {
    Object.keys(tiemposPedido).forEach(id => {
        const timerEl = document.getElementById('timer_' + id);
        if (!timerEl) return;
        const elapsed = Math.floor((Date.now() - tiemposPedido[id]) / 1000);
        const mins = Math.floor(elapsed / 60);
        const secs = elapsed % 60;
        timerEl.textContent = mins + ':' + String(secs).padStart(2, '0');

        timerEl.classList.remove('timer-ok', 'timer-warning', 'timer-critical');
        if (elapsed > 300) timerEl.classList.add('timer-critical');
        else if (elapsed > 120) timerEl.classList.add('timer-warning');
        else timerEl.classList.add('timer-ok');
    });
}

async function cargarDetallesPedido(idPedido) {
    try {
        const data = await API.get(API.getBaseUrl() + '/api/pedido/' + idPedido);
        const detalles = data.detalles || [];
        const ul = document.getElementById('mcdItems_' + idPedido);
        if (!ul) return;
        ul.innerHTML = detalles.map(det =>
            `<li><span class="item-qty">${det.cantidad}x</span> ${det.nombreProducto || 'Producto'}</li>`
        ).join('');
    } catch (error) {
        console.error('Error cargando detalles:', error);
    }
}

async function cargarEmpleadosCocina() {
    try {
        const empleados = await API.get(API.getBaseUrl() + '/api/empleados/rol?rol=empleado');
        renderizarEmpleadosCocina(empleados || []);
    } catch (error) {
        console.error('Error cargando empleados de cocina:', error);
    }
}

function renderizarEmpleadosCocina(empleados) {
    const container = document.getElementById('cocinaEmpleados');
    if (!container) return;

    const enCocina = empleados.filter(e => e.activo && (e.puesto === 'Cocinero' || e.puesto === 'Barista'));

    if (enCocina.length === 0) {
        container.innerHTML = '<p style="font-size:0.75rem; color:var(--texto-claro);">No hay personal asignado</p>';
        return;
    }

    container.innerHTML = enCocina.map(emp => `
        <div class="ko-staff-card">
            <div class="ko-staff-avatar">${emp.nombre.charAt(0)}${emp.apellido.charAt(0)}</div>
            <div class="ko-staff-info">
                <div class="ko-staff-name">${emp.nombre} ${emp.apellido}</div>
                <div class="ko-staff-detail">${emp.puesto} &middot; ${emp.turno}</div>
            </div>
        </div>
    `).join('');
}

async function enviarACocina(idPedido) {
    mostrarLoader();
    try {
        await API.put(API.getBaseUrl() + '/api/pedido/' + idPedido, { idEstado: 2 });
        Toast.mostrar('Pedido #' + idPedido + ' enviado a cocina', 'success');
        cargarPedidosCocina();
    } catch (error) {
        Toast.mostrar('Error: ' + error.message, 'danger');
    } finally {
        ocultarLoader();
    }
}

async function marcarListo(idPedido) {
    mostrarLoader();
    try {
        await API.put(API.getBaseUrl() + '/api/pedido/' + idPedido, { idEstado: 3 });
        Toast.mostrar('Pedido #' + idPedido + ' marcado como listo', 'success');
        delete tiemposPedido[idPedido];
        cargarPedidosCocina();
    } catch (error) {
        Toast.mostrar('Error: ' + error.message, 'danger');
    } finally {
        ocultarLoader();
    }
}
