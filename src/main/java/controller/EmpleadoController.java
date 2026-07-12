package controller;

import beans.Empleado;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import service.EmpleadoService;
import utils.JsonUtils;
import utils.Validaciones;

@WebServlet(name = "EmpleadoController", urlPatterns = {"/api/empleados", "/api/empleado", "/api/empleados/rol"})
public class EmpleadoController extends HttpServlet {

    private final EmpleadoService empleadoService = new EmpleadoService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try {
            String uri = request.getRequestURI();
            if (uri.contains("/api/empleados/rol")) {
                String rol = request.getParameter("rol");
                if (Validaciones.esCampoVacio(rol)) {
                    JsonUtils.enviarError(response, 400, "El parámetro rol es obligatorio");
                    return;
                }
                List<Empleado> empleados = empleadoService.listarPorRol(rol);
                JsonUtils.enviarJson(response, empleados);
            } else if (uri.endsWith("/api/empleado")) {
                String idParam = request.getParameter("id");
                if (idParam != null && !idParam.isEmpty()) {
                    int id = Integer.parseInt(idParam);
                    Empleado empleado = empleadoService.buscarPorId(id);
                    if (empleado != null) {
                        JsonUtils.enviarJson(response, empleado);
                    } else {
                        JsonUtils.enviarError(response, 404, "Empleado no encontrado");
                    }
                } else {
                    List<Empleado> empleados = empleadoService.listarTodos();
                    JsonUtils.enviarJson(response, empleados);
                }
            } else if (uri.endsWith("/api/empleados")) {
                List<Empleado> empleados = empleadoService.listarTodos();
                JsonUtils.enviarJson(response, empleados);
            } else {
                JsonUtils.enviarError(response, 404, "Ruta no encontrada");
            }
        } catch (SQLException e) {
            JsonUtils.enviarError(response, 500, "Error de base de datos: " + e.getMessage());
        } catch (NumberFormatException e) {
            JsonUtils.enviarError(response, 400, "ID no válido");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try {
            HttpSession session = request.getSession(false);
            if (session == null || session.getAttribute("empleadoRol") == null) {
                JsonUtils.enviarError(response, 401, "No autenticado como empleado");
                return;
            }
            String rolSesion = (String) session.getAttribute("empleadoRol");
            if (!"administrador".equals(rolSesion)) {
                JsonUtils.enviarError(response, 403, "Solo los administradores pueden crear empleados");
                return;
            }

            Map<String, Object> datos = JsonUtils.parsearMapa(request);
            String nombre = (String) datos.get("nombre");
            String apellido = (String) datos.get("apellido");
            String email = (String) datos.get("email");
            String contrasena = (String) datos.get("contrasena");
            String telefono = (String) datos.get("telefono");
            String puesto = (String) datos.get("puesto");
            String turno = (String) datos.get("turno");
            String rol = (String) datos.get("rol");

            if (Validaciones.esCampoVacio(nombre) || Validaciones.esCampoVacio(apellido) || Validaciones.esCampoVacio(email) || Validaciones.esCampoVacio(puesto) || Validaciones.esCampoVacio(turno)) {
                JsonUtils.enviarError(response, 400, "Todos los campos obligatorios deben estar llenos");
                return;
            }
            if (!Validaciones.esEmailValido(email)) {
                JsonUtils.enviarError(response, 400, "Email no válido");
                return;
            }
            if (Validaciones.esCampoVacio(contrasena)) {
                JsonUtils.enviarError(response, 400, "La contraseña es obligatoria");
                return;
            }
            if (contrasena != null && !Validaciones.esContrasenaValida(contrasena)) {
                JsonUtils.enviarError(response, 400, "La contraseña debe tener al menos 8 caracteres");
                return;
            }
            if (rol != null && !rol.equals("administrador") && !rol.equals("empleado")) {
                JsonUtils.enviarError(response, 400, "Rol no válido. Debe ser 'administrador' o 'empleado'");
                return;
            }
            try {
                Empleado empleado = empleadoService.registrar(nombre, apellido, email, contrasena, telefono, puesto, turno, rol);
                JsonUtils.enviarJson(response, Map.of("mensaje", "Empleado registrado exitosamente", "id", empleado.getIdEmpleado()));
            } catch (IllegalArgumentException e) {
                JsonUtils.enviarError(response, 400, e.getMessage());
            }
        } catch (SQLException e) {
            JsonUtils.enviarError(response, 500, "Error de base de datos: " + e.getMessage());
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try {
            String uri = request.getRequestURI();
            String idStr = uri.substring(uri.lastIndexOf('/') + 1);
            int id = Integer.parseInt(idStr);

            Empleado existente = empleadoService.buscarPorId(id);
            if (existente == null) {
                JsonUtils.enviarError(response, 404, "Empleado no encontrado");
                return;
            }

            Map<String, Object> datos = JsonUtils.parsearMapa(request);
            if (datos.containsKey("nombre")) existente.setNombre((String) datos.get("nombre"));
            if (datos.containsKey("apellido")) existente.setApellido((String) datos.get("apellido"));
            if (datos.containsKey("email")) existente.setEmail((String) datos.get("email"));
            if (datos.containsKey("telefono")) existente.setTelefono((String) datos.get("telefono"));
            if (datos.containsKey("puesto")) existente.setPuesto((String) datos.get("puesto"));
            if (datos.containsKey("turno")) existente.setTurno((String) datos.get("turno"));
            if (datos.containsKey("rol")) {
                String rol = (String) datos.get("rol");
                if (rol != null && !rol.equals("administrador") && !rol.equals("empleado")) {
                    JsonUtils.enviarError(response, 400, "Rol no válido. Debe ser 'administrador' o 'empleado'");
                    return;
                }
                existente.setRol(rol);
            }
            if (datos.containsKey("activo")) existente.setActivo((Boolean) datos.get("activo"));

            empleadoService.actualizar(existente);
            JsonUtils.enviarJson(response, Map.of("mensaje", "Empleado actualizado exitosamente"));
        } catch (SQLException e) {
            JsonUtils.enviarError(response, 500, "Error de base de datos: " + e.getMessage());
        } catch (NumberFormatException e) {
            JsonUtils.enviarError(response, 400, "ID no válido");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try {
            String uri = request.getRequestURI();
            String idStr = uri.substring(uri.lastIndexOf('/') + 1);
            int id = Integer.parseInt(idStr);

            Empleado existente = empleadoService.buscarPorId(id);
            if (existente == null) {
                JsonUtils.enviarError(response, 404, "Empleado no encontrado");
                return;
            }
            empleadoService.eliminar(id);
            JsonUtils.enviarJson(response, Map.of("mensaje", "Empleado eliminado exitosamente"));
        } catch (SQLException e) {
            JsonUtils.enviarError(response, 500, "Error de base de datos: " + e.getMessage());
        } catch (NumberFormatException e) {
            JsonUtils.enviarError(response, 400, "ID no válido");
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
