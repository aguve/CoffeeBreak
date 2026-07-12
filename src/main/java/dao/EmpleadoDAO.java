package dao;

import beans.Empleado;
import conexion.ConexionBD;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class EmpleadoDAO {

    private static final String INSERT = "INSERT INTO EMPLEADO (nombre, apellido, email, contrasena, telefono, puesto, turno, rol, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    private static final String UPDATE = "UPDATE EMPLEADO SET nombre=?, apellido=?, email=?, contrasena=?, telefono=?, puesto=?, turno=?, rol=?, activo=? WHERE id_empleado=?";
    private static final String DELETE = "DELETE FROM EMPLEADO WHERE id_empleado=?";
    private static final String SELECT_ALL = "SELECT * FROM EMPLEADO";
    private static final String SELECT_BY_ID = "SELECT * FROM EMPLEADO WHERE id_empleado=?";
    private static final String SELECT_BY_EMAIL = "SELECT * FROM EMPLEADO WHERE email=?";
    private static final String SELECT_ACTIVE = "SELECT * FROM EMPLEADO WHERE activo=TRUE";
    private static final String SELECT_BY_ROL = "SELECT * FROM EMPLEADO WHERE rol=?";

    public void insertar(Empleado empleado) throws SQLException {
        try (Connection conn = ConexionBD.getConnection(); PreparedStatement ps = conn.prepareStatement(INSERT, PreparedStatement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, empleado.getNombre());
            ps.setString(2, empleado.getApellido());
            ps.setString(3, empleado.getEmail());
            ps.setString(4, empleado.getContrasena());
            ps.setString(5, empleado.getTelefono());
            ps.setString(6, empleado.getPuesto());
            ps.setString(7, empleado.getTurno());
            ps.setString(8, empleado.getRol());
            ps.setBoolean(9, empleado.isActivo());
            ps.executeUpdate();
            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    empleado.setIdEmpleado(rs.getInt(1));
                }
            }
        }
    }

    public void actualizar(Empleado empleado) throws SQLException {
        try (Connection conn = ConexionBD.getConnection(); PreparedStatement ps = conn.prepareStatement(UPDATE)) {
            ps.setString(1, empleado.getNombre());
            ps.setString(2, empleado.getApellido());
            ps.setString(3, empleado.getEmail());
            ps.setString(4, empleado.getContrasena());
            ps.setString(5, empleado.getTelefono());
            ps.setString(6, empleado.getPuesto());
            ps.setString(7, empleado.getTurno());
            ps.setString(8, empleado.getRol());
            ps.setBoolean(9, empleado.isActivo());
            ps.setInt(10, empleado.getIdEmpleado());
            ps.executeUpdate();
        }
    }

    public void eliminar(int id) throws SQLException {
        try (Connection conn = ConexionBD.getConnection(); PreparedStatement ps = conn.prepareStatement(DELETE)) {
            ps.setInt(1, id);
            ps.executeUpdate();
        }
    }

    public List<Empleado> listarTodos() throws SQLException {
        List<Empleado> lista = new ArrayList<>();
        try (Connection conn = ConexionBD.getConnection(); PreparedStatement ps = conn.prepareStatement(SELECT_ALL); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                lista.add(mapear(rs));
            }
        }
        return lista;
    }

    public Empleado buscarPorId(int id) throws SQLException {
        try (Connection conn = ConexionBD.getConnection(); PreparedStatement ps = conn.prepareStatement(SELECT_BY_ID)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapear(rs);
                }
            }
        }
        return null;
    }

    public Empleado buscarPorEmail(String email) throws SQLException {
        try (Connection conn = ConexionBD.getConnection(); PreparedStatement ps = conn.prepareStatement(SELECT_BY_EMAIL)) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapear(rs);
                }
            }
        }
        return null;
    }

    public List<Empleado> listarActivos() throws SQLException {
        List<Empleado> lista = new ArrayList<>();
        try (Connection conn = ConexionBD.getConnection(); PreparedStatement ps = conn.prepareStatement(SELECT_ACTIVE); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                lista.add(mapear(rs));
            }
        }
        return lista;
    }

    public List<Empleado> listarPorRol(String rol) throws SQLException {
        List<Empleado> lista = new ArrayList<>();
        try (Connection conn = ConexionBD.getConnection(); PreparedStatement ps = conn.prepareStatement(SELECT_BY_ROL)) {
            ps.setString(1, rol);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    lista.add(mapear(rs));
                }
            }
        }
        return lista;
    }

    private Empleado mapear(ResultSet rs) throws SQLException {
        Empleado e = new Empleado();
        e.setIdEmpleado(rs.getInt("id_empleado"));
        e.setNombre(rs.getString("nombre"));
        e.setApellido(rs.getString("apellido"));
        e.setEmail(rs.getString("email"));
        e.setContrasena(rs.getString("contrasena"));
        e.setTelefono(rs.getString("telefono"));
        e.setPuesto(rs.getString("puesto"));
        e.setTurno(rs.getString("turno"));
        e.setRol(rs.getString("rol"));
        e.setActivo(rs.getBoolean("activo"));
        return e;
    }
}
