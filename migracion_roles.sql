USE coffeebreak_db;

-- Añadir columna de contraseña a EMPLEADO
ALTER TABLE EMPLEADO ADD COLUMN contrasena VARCHAR(255) DEFAULT NULL AFTER email;

-- Añadir columna de tipo_usuario para distinguir cliente/empleado en sesiones
-- (el rol ya existe en EMPLEADO, el tipo de usuario se maneja por sesión)

-- Contraseña por defecto: 12345678 (hash pre-calculado)
-- Los empleados deben cambiar su contraseña desde el panel de admin
UPDATE EMPLEADO SET contrasena = NULL;

-- Crear usuario admin inicial con contraseña conocida
-- El hash se generará al registrar desde la aplicación
