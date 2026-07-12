let todosLosEmpleados = [];
let rolFiltro = 'todos';
let turnoFiltro = 'todos';

document.addEventListener('DOMContentLoaded', function() {
    cargarEmpleados();
});

async function cargarEmpleados() {
    mostrarLoader();
    try {
        const data = await API.get(API.getBaseUrl() + '/api/sesion');
        if (!data.autenticado || data.tipo !== 'empleado' || data.rol !== 'administrador') {
            document.getElementById('empleadosContainer').innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-shield-lock"></i>
                    <h4>Acceso restringido</h4>
                    <p>Solo los administradores pueden gestionar empleados</p>
                    <a href="login.html" class="btn-primary-custom" style="display:inline-block; width:auto; padding:0.7rem 1.5rem; text-decoration:none;">Iniciar Sesión</a>
                </div>
            `;
            document.querySelector('.empleados-header .btn-primary-custom').style.display = 'none';
            return;
        }
        const empleados = await API.get(API.getBaseUrl() + '/api/empleados');
        todosLosEmpleados = empleados || [];
        renderizarEmpleados(todosLosEmpleados);
        actualizarEstadisticas(todosLosEmpleados);
    } catch (error) {
        Toast.mostrar('Error al cargar empleados: ' + error.message, 'danger');
    } finally {
        ocultarLoader();
    }
}

function renderizarEmpleados(empleados) {
    const container = document.getElementById('empleadosContainer');
    if (!container) return;
    if (!empleados || empleados.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-people"></i>
                <h4>No hay empleados registrados</h4>
                <p>Agrega el primer empleado usando el botón de arriba</p>
            </div>
        `;
        return;
    }
    container.innerHTML = '';
    empleados.forEach(empleado => {
        const div = document.createElement('div');
        div.className = 'emp-card';
        const rolBadge = empleado.rol === 'administrador'
            ? '<span class="emp-rol-badge emp-rol-admin"><i class="bi bi-shield-fill me-1"></i>Admin</span>'
            : '<span class="emp-rol-badge emp-rol-empleado"><i class="bi bi-person-badge me-1"></i>Empleado</span>';
        div.innerHTML = `
            <div class="emp-card-header">
                <div class="emp-avatar ${empleado.rol === 'administrador' ? 'emp-avatar-admin' : ''}">${empleado.nombre.charAt(0)}${empleado.apellido.charAt(0)}</div>
                <div class="emp-info">
                    <div class="emp-name">${empleado.nombre} ${empleado.apellido}</div>
                    <div class="emp-email">${empleado.email}</div>
                </div>
                <div class="emp-header-badges">
                    ${rolBadge}
                    <span class="emp-status ${empleado.activo ? 'emp-activo' : 'emp-inactivo'}">${empleado.activo ? 'Activo' : 'Inactivo'}</span>
                </div>
            </div>
            <div class="emp-card-body">
                <div class="emp-detail">
                    <i class="bi bi-briefcase-fill"></i>
                    <span>${empleado.puesto}</span>
                </div>
                <div class="emp-detail">
                    <i class="bi bi-clock-fill"></i>
                    <span>${empleado.turno}</span>
                </div>
                ${empleado.telefono ? `
                <div class="emp-detail">
                    <i class="bi bi-telephone-fill"></i>
                    <span>${empleado.telefono}</span>
                </div>
                ` : ''}
            </div>
            <div class="emp-card-actions">
                <button class="btn-outline-custom" onclick="editarEmpleado(${empleado.idEmpleado})">
                    <i class="bi bi-pencil me-1"></i>Editar
                </button>
                <button class="btn-outline-custom danger" onclick="eliminarEmpleado(${empleado.idEmpleado})">
                    <i class="bi bi-trash me-1"></i>Eliminar
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

function actualizarEstadisticas(empleados) {
    document.getElementById('statTotal').textContent = empleados.length;
    document.getElementById('statActivos').textContent = empleados.filter(e => e.activo).length;
    document.getElementById('statAdmins').textContent = empleados.filter(e => e.rol === 'administrador').length;
    document.getElementById('statEmpleados').textContent = empleados.filter(e => e.rol === 'empleado').length;
}

function filtrarEmpleados() {
    const termino = document.getElementById('busquedaEmpleado').value.toLowerCase();
    let filtrados = todosLosEmpleados;
    if (termino) {
        filtrados = filtrados.filter(e =>
            e.nombre.toLowerCase().includes(termino) ||
            e.apellido.toLowerCase().includes(termino) ||
            e.email.toLowerCase().includes(termino) ||
            e.puesto.toLowerCase().includes(termino)
        );
    }
    if (rolFiltro !== 'todos') {
        filtrados = filtrados.filter(e => e.rol === rolFiltro);
    }
    if (turnoFiltro !== 'todos') {
        filtrados = filtrados.filter(e => e.turno === turnoFiltro);
    }
    renderizarEmpleados(filtrados);
}

function filtrarPorRol(btn, rol) {
    rolFiltro = rol;
    document.querySelectorAll('.empleados-filters .category-pills:first-of-type .pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    filtrarEmpleados();
}

function filtrarPorTurno(btn, turno) {
    turnoFiltro = turno;
    document.querySelectorAll('.empleados-filters .category-pills:last-of-type .pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    filtrarEmpleados();
}

function abrirModalAgregar() {
    document.getElementById('modalTitle').textContent = 'Nuevo Empleado';
    document.getElementById('empleadoForm').reset();
    document.getElementById('empleadoId').value = '';
    document.getElementById('empleadoActivo').value = 'true';
    document.getElementById('empleadoRol').value = 'empleado';
    document.getElementById('empleadoContrasena').required = true;
    const modal = new bootstrap.Modal(document.getElementById('empleadoModal'));
    modal.show();
}

async function editarEmpleado(id) {
    mostrarLoader();
    try {
        const empleado = await API.get(API.getBaseUrl() + '/api/empleado?id=' + id);
        document.getElementById('modalTitle').textContent = 'Editar Empleado';
        document.getElementById('empleadoId').value = empleado.idEmpleado;
        document.getElementById('empleadoNombre').value = empleado.nombre;
        document.getElementById('empleadoApellido').value = empleado.apellido;
        document.getElementById('empleadoEmail').value = empleado.email;
        document.getElementById('empleadoContrasena').value = '';
        document.getElementById('empleadoContrasena').required = false;
        document.getElementById('empleadoTelefono').value = empleado.telefono || '';
        document.getElementById('empleadoPuesto').value = empleado.puesto;
        document.getElementById('empleadoTurno').value = empleado.turno;
        document.getElementById('empleadoRol').value = empleado.rol || 'empleado';
        document.getElementById('empleadoActivo').value = String(empleado.activo);
        const modal = new bootstrap.Modal(document.getElementById('empleadoModal'));
        modal.show();
    } catch (error) {
        Toast.mostrar('Error al cargar empleado: ' + error.message, 'danger');
    } finally {
        ocultarLoader();
    }
}

async function guardarEmpleado(event) {
    event.preventDefault();
    const id = document.getElementById('empleadoId').value;
    const contrasena = document.getElementById('empleadoContrasena').value;
    const datos = {
        nombre: document.getElementById('empleadoNombre').value.trim(),
        apellido: document.getElementById('empleadoApellido').value.trim(),
        email: document.getElementById('empleadoEmail').value.trim(),
        contrasena: contrasena || undefined,
        telefono: document.getElementById('empleadoTelefono').value.trim(),
        puesto: document.getElementById('empleadoPuesto').value,
        turno: document.getElementById('empleadoTurno').value,
        rol: document.getElementById('empleadoRol').value,
        activo: document.getElementById('empleadoActivo').value === 'true'
    };

    if (!datos.nombre || !datos.apellido || !datos.email || !datos.puesto || !datos.turno) {
        Toast.mostrar('Todos los campos obligatorios deben estar llenos', 'warning');
        return;
    }

    if (!id && (!contrasena || contrasena.length < 8)) {
        Toast.mostrar('La contraseña debe tener al menos 8 caracteres', 'warning');
        return;
    }

    mostrarLoader();
    try {
        if (id) {
            if (!datos.contrasena) delete datos.contrasena;
            await API.put(API.getBaseUrl() + '/api/empleado/' + id, datos);
            Toast.mostrar('Empleado actualizado exitosamente', 'success');
        } else {
            await API.post(API.getBaseUrl() + '/api/empleado', datos);
            Toast.mostrar('Empleado registrado exitosamente', 'success');
        }
        bootstrap.Modal.getInstance(document.getElementById('empleadoModal')).hide();
        cargarEmpleados();
    } catch (error) {
        Toast.mostrar('Error: ' + error.message, 'danger');
    } finally {
        ocultarLoader();
    }
}

async function eliminarEmpleado(id) {
    if (!confirm('¿Eliminar este empleado?')) return;
    mostrarLoader();
    try {
        await API.del(API.getBaseUrl() + '/api/empleado/' + id);
        Toast.mostrar('Empleado eliminado', 'success');
        cargarEmpleados();
    } catch (error) {
        Toast.mostrar('Error: ' + error.message, 'danger');
    } finally {
        ocultarLoader();
    }
}
