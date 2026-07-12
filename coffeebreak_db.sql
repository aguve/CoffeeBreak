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
('Latte Macchiato', 'Leche con café manchado', 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=300&h=300&fit=crop', 2.50, TRUE, 1),
('Agua Mineral', 'Agua mineral natural 500ml', 'https://thumbs.dreamstime.com/b/botellas-de-agua-fr%C3%ADa-enfri%C3%A1ndose-en-el-hielo-las-monta%C3%B1as-pl%C3%A1stica-frente-nevadas-refrescantes-y-tremendas-un-caluroso-d%C3%ADa-389980883.jpg?w=300&h=300&fit=crop', 1.00, TRUE, 2),
('Zumo de Naranja', 'Zumo de naranja natural exprimido', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=300&fit=crop', 2.00, TRUE, 2),
('Refresco Cola', 'Refresco de cola 330ml', 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=300&fit=crop', 1.50, TRUE, 2),
('Bocadillo de jamón', 'Bocadillo de jamón serrano con tomate', 'https://enriquetomas.com/cdn/shop/articles/hacer-el-mejor-bocadillo-de-jamon-e1519833440102.jpg?v=1760606172&width=1780', 3.50, TRUE, 3),
('Bocadillo de queso semicurado', 'Bocadillo de queso semicurado Manchego', 'https://selectosibericos.com/wp-content/uploads/2015/12/manchego-semi.jpg?w=300&h=300&fit=crop', 3.00, TRUE, 3),
('Croissant', 'Croissant de mantequilla', 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=300&h=300&fit=crop', 1.80, TRUE, 4),
('Napolitana de choco', 'Napolitana de chocolate', 'https://pasteleriacampana.com/wp-content/uploads/2022/09/napolitana_3.jpg?w=300&h=300&fit=crop', 2.00, TRUE, 4),
('Ensaimada', 'Ensaimada tradicional', 'https://blogditifet.com/wp-content/uploads/2016/03/BlogDitiFet-Ensaimadas.jpg?w=300&h=300&fit=crop', 1.50, TRUE, 4);

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
