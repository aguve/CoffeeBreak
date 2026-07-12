package service;

import beans.Empleado;
import dao.EmpleadoDAO;
import java.sql.SQLException;
import java.util.List;
import utils.PasswordUtils;

public class EmpleadoService {

    private final EmpleadoDAO empleadoDAO;

    public EmpleadoService() {
        this.empleadoDAO = new EmpleadoDAO();
    }

    public Empleado registrar(String nombre, String apellido, String email, String contrasena, String telefono, String puesto, String turno, String rol) throws SQLException {
        if (empleadoDAO.buscarPorEmail(email) != null) {
            throw new IllegalArgumentException("El email ya está registrado");
        }
        Empleado empleado = new Empleado();
        empleado.setNombre(nombre);
        empleado.setApellido(apellido);
        empleado.setEmail(email);
        empleado.setContrasena(contrasena != null ? PasswordUtils.hashPassword(contrasena) : null);
        empleado.setTelefono(telefono);
        empleado.setPuesto(puesto);
        empleado.setTurno(turno);
        empleado.setRol(rol != null ? rol : "empleado");
        empleado.setActivo(true);
        empleadoDAO.insertar(empleado);
        return empleado;
    }

    public Empleado login(String email, String contrasena) throws SQLException {
        Empleado empleado = empleadoDAO.buscarPorEmail(email);
        if (empleado != null && empleado.isActivo() && empleado.getContrasena() != null
                && PasswordUtils.checkPassword(contrasena, empleado.getContrasena())) {
            return empleado;
        }
        return null;
    }

    public Empleado buscarPorId(int id) throws SQLException {
        return empleadoDAO.buscarPorId(id);
    }

    public List<Empleado> listarTodos() throws SQLException {
        return empleadoDAO.listarTodos();
    }

    public List<Empleado> listarActivos() throws SQLException {
        return empleadoDAO.listarActivos();
    }

    public List<Empleado> listarPorRol(String rol) throws SQLException {
        return empleadoDAO.listarPorRol(rol);
    }

    public void actualizar(Empleado empleado) throws SQLException {
        empleadoDAO.actualizar(empleado);
    }

    public void eliminar(int id) throws SQLException {
        empleadoDAO.eliminar(id);
    }
}
