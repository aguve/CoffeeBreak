SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS;
SET UNIQUE_CHECKS=0;

SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS=0;

SET @OLD_SQL_MODE=@@SQL_MODE;
SET SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

DROP DATABASE IF EXISTS coffeebreak_db;
CREATE DATABASE coffeebreak_db;
USE coffeebreak_db;

CREATE TABLE CATEGORIA (
id_categoria INT AUTO_INCREMENT PRIMARY KEY,
nombre_categoria VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE CLIENTE (
id_cliente INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
apellido VARCHAR(100) NOT NULL,
email VARCHAR(150) NOT NULL UNIQUE,
contrasena VARCHAR(255) NOT NULL,
telefono VARCHAR(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE ESTADO_PEDIDO (
id_estado INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(45) NOT NULL,
descripcion TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE PEDIDO (
id_pedido INT AUTO_INCREMENT PRIMARY KEY,
id_cliente INT NOT NULL,
fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
id_estado INT NOT NULL,
fecha_pago DATE,
monto DECIMAL(10,2),
metodo_pago VARCHAR(50),

CONSTRAINT fk_pedido_cliente
    FOREIGN KEY (id_cliente)
    REFERENCES CLIENTE(id_cliente),

CONSTRAINT fk_pedido_estado
    FOREIGN KEY (id_estado)
    REFERENCES ESTADO_PEDIDO(id_estado)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE PRODUCTO (
id_producto INT AUTO_INCREMENT PRIMARY KEY,
nombre_producto VARCHAR(150) NOT NULL,
descripcion TEXT,
imagen VARCHAR(500),
precio DECIMAL(10,2) NOT NULL,
disponible BOOLEAN DEFAULT TRUE,
id_categoria INT NOT NULL,

CONSTRAINT fk_producto_categoria
    FOREIGN KEY (id_categoria)
    REFERENCES CATEGORIA(id_categoria)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE EMPLEADO (
id_empleado INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
apellido VARCHAR(100) NOT NULL,
email VARCHAR(150) NOT NULL UNIQUE,
contrasena VARCHAR(255) DEFAULT NULL,
telefono VARCHAR(20),
puesto VARCHAR(100) NOT NULL,
turno VARCHAR(50) NOT NULL,
rol ENUM('administrador', 'empleado') NOT NULL DEFAULT 'empleado',
activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE DETALLE_PEDIDO (
id_detalle INT AUTO_INCREMENT PRIMARY KEY,
id_pedido INT NOT NULL,
id_producto INT NOT NULL,
cantidad INT NOT NULL,

CONSTRAINT fk_detalle_pedido
    FOREIGN KEY (id_pedido)
    REFERENCES PEDIDO(id_pedido),

CONSTRAINT fk_detalle_producto
    FOREIGN KEY (id_producto)
    REFERENCES PRODUCTO(id_producto)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO CATEGORIA (nombre_categoria) VALUES ('Cafés'), ('Bebidas'), ('Bocadillos'), ('Bollería');

INSERT INTO ESTADO_PEDIDO (nombre, descripcion) VALUES
('Pendiente', 'Pedido recibido, esperando confirmación'),
('En preparación', 'El pedido está siendo preparado'),
('Listo para recoger', 'El pedido está listo para recoger'),
('Entregado', 'El pedido ha sido entregado al cliente');

INSERT INTO PRODUCTO (nombre_producto, descripcion, imagen, precio, disponible, id_categoria) VALUES
('Café Solo', 'Café espresso tradicional', 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=300&h=300&fit=crop', 1.50, TRUE, 1),
('Café con Leche', 'Café con leche espumosa', 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300&h=300&fit=crop', 1.80, TRUE, 1),
('Cappuccino', 'Café con leche y espuma de leche', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=300&fit=crop', 2.20, TRUE, 1),
('Latte Macchiato', 'Leche con café manchado', 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=300&h=300&fit=crop', 2.50, TRUE, 1),
('Agua Mineral', 'Agua mineral natural 500ml', 'https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=300&h=300&fit=crop', 1.00, TRUE, 2),
('Zumo de Naranja', 'Zumo de naranja natural exprimido', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=300&fit=crop', 2.00, TRUE, 2),
('Refresco Cola', 'Refresco de cola 330ml', 'https://images.unsplash.com/photo-1596803244618-8d5cca6c68ba?w=300&h=300&fit=crop', 1.50, TRUE, 2),
('Bocadillo Jamón', 'Bocadillo de jamón serrano con tomate', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=300&fit=crop', 3.50, TRUE, 3),
('Bocadillo Queso', 'Bocadillo de queso curado', 'https://images.unsplash.com/photo-1485963631004-f2f00b1d6606?w=300&h=300&fit=crop', 3.00, TRUE, 3),
('Croissant', 'Croissant de mantequilla', 'https://images.unsplash.com/photo-1555507036-ab1f4038028a?w=300&h=300&fit=crop', 1.80, TRUE, 4),
('Napolitana', 'Napolitana de chocolate', 'https://images.unsplash.com/photo-1609505848912-b78c2c14e1e4?w=300&h=300&fit=crop', 2.00, TRUE, 4),
('Ensaimada', 'Ensaimada tradicional', 'https://images.unsplash.com/photo-1609501078723-6bd52f6e48f9?w=300&h=300&fit=crop', 1.50, TRUE, 4);

INSERT INTO EMPLEADO (nombre, apellido, email, contrasena, telefono, puesto, turno, rol, activo) VALUES
('María', 'López', 'maria.lopez@coffeebreak.es', 'pgOrKenbsLHSlKFMkToSur2kGM9nBvR48G9uyuchjOo5WyxwRDL83wj0l/U1XDkd', '612345678', 'Barista', 'Mañana', 'administrador', TRUE),
('Carlos', 'García', 'carlos.garcia@coffeebreak.es', 'pgOrKenbsLHSlKFMkToSur2kGM9nBvR48G9uyuchjOo5WyxwRDL83wj0l/U1XDkd', '623456789', 'Cocinero', 'Mañana', 'empleado', TRUE),
('Ana', 'Martínez', 'ana.martinez@coffeebreak.es', 'pgOrKenbsLHSlKFMkToSur2kGM9nBvR48G9uyuchjOo5WyxwRDL83wj0l/U1XDkd', '634567890', 'Camarera', 'Tarde', 'empleado', TRUE),
('Pedro', 'Sánchez', 'pedro.sanchez@coffeebreak.es', 'pgOrKenbsLHSlKFMkToSur2kGM9nBvR48G9uyuchjOo5WyxwRDL83wj0l/U1XDkd', '645678901', 'Cocinero', 'Tarde', 'empleado', TRUE),
('Laura', 'Fernández', 'laura.fernandez@coffeebreak.es', 'pgOrKenbsLHSlKFMkToSur2kGM9nBvR48G9uyuchjOo5WyxwRDL83wj0l/U1XDkd', '656789012', 'Barista', 'Noche', 'empleado', TRUE);

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
