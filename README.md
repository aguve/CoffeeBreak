# CoffeeBreak – Cafetería Universitaria

Aplicación web full-stack para la gestión de pedidos en una cafetería universitaria. Los estudiantes pueden explorar el menú, hacer pedidos desde el móvil, seleccionar hora de recogida y método de pago, y seguir el estado de su pedido en tiempo real. El personal de cocina dispone de un dashboard para gestionar los pedidos entrantes.

---

## Idea

Eliminar las colas en la cafetería universitaria permitiendo a los estudiantes pedir su café, bebida o bocadillo desde el teléfono y recogerlo sin esperar. La cocina recibe los pedidos al instante y puede gestionar el flujo de trabajo de forma eficiente.

---

## Funcionalidades

### Para el estudiante
- **Catálogo de productos** — Navegación por categorías (Cafés, Bebidas, Bocadillos, Bollería) con búsqueda en tiempo real
- **Carrito de compras** — Persistente en `localStorage`; añadir, quitar y modificar cantidad de productos
- **Pedido** — Selección de franja horaria (10:00–14:00 en slots de 30 min) y método de pago (Tarjeta, Bizum, Efectivo)
- **Historial y seguimiento** — Lista de pedidos anteriores con indicador visual de estado: Pendiente → En preparación → Listo para recoger → Entregado
- **Autenticación** — Registro e inicio de sesión por email con contraseña hasheada (SHA-256 + salt)

### Para la cocina
- **Dashboard en tiempo real** — Auto-refresh cada 15 segundos con tarjetas de pedido activas
- **Gestión de estados** — Botones para enviar a cocina y marcar como listo para recoger
- **Control de stock exprés** — Checklist rápido de ingredientes básicos (café, leche, pan, jamón, queso, bollería)
- **Capacidad y cola** — Barras de progreso de ocupación y tiempo estimado de espera

---

## Tecnologías

| Tecnología | Propósito |
|---|---|
| **Java 25** | Lenguaje backend |
| **Jakarta Servlets 6** | API REST y controladores |
| **MySQL** | Base de datos relacional |
| **Apache Maven** | Build y gestión de dependencias |
| **JDBC** | Acceso a datos con `PreparedStatement` |
| **Google Gson** | Serialización JSON |
| **HTML5 / CSS3** | Frontend con diseño responsive mobile-first |
| **JavaScript (Vanilla)** | Interactividad del cliente, sin frameworks |
| **Bootstrap 5.3** | Componentes de UI y layout |
| **Bootstrap Icons** | Iconografía |
| **Apache Tomcat** | Servidor de aplicaciones (despliegue WAR) |

---

## Arquitectura

El proyecto sigue una arquitectura **3 capas** sin frameworks ni ORM:

```
web/ (HTML + JS) → Controller (Servlets) → Service → DAO (JDBC) → MySQL
```

- **Beans** — POJOS que representan las entidades del dominio
- **DAO** — Acceso a datos con SQL plano y `PreparedStatement`
- **Service** — Lógica de negocio
- **Controller** — Servlets Jakarta que exponen una API REST JSON
- **Web** — Páginas HTML estáticas con JavaScript vanilla

---

## Estructura del proyecto

```
CoffeeBreak/
├── pom.xml                              # Configuración Maven (WAR)
├── coffeebreak_db.sql                   # Schema + datos de semilla
├── migracion_imagen.sql                 # Migración de imágenes de productos
├── src/
│   ├── conexion/ConexionBD.java.template
│   ├── beans/
│   │   ├── Categoria.java
│   │   ├── Cliente.java
│   │   ├── DetallePedido.java
│   │   ├── EstadoPedido.java
│   │   ├── Pedido.java
│   │   └── Producto.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── CategoriaController.java
│   │   ├── PedidoController.java
│   │   └── ProductoController.java
│   ├── dao/
│   │   ├── CategoriaDAO.java
│   │   ├── ClienteDAO.java
│   │   ├── DetallePedidoDAO.java
│   │   ├── EstadoPedidoDAO.java
│   │   ├── PedidoDAO.java
│   │   └── ProductoDAO.java
│   ├── service/
│   │   ├── CategoriaService.java
│   │   ├── ClienteService.java
│   │   ├── PedidoService.java
│   │   └── ProductoService.java
│   └── utils/
│       ├── JsonUtils.java
│       ├── PasswordUtils.java
│       └── Validaciones.java
└── web/
    ├── WEB-INF/
    │   ├── web.xml
    │   └── lib/                         # Dependencias JAR
    ├── css/styles.css
    ├── js/
    │   ├── api.js
    │   ├── main.js
    │   ├── menu.js
    │   ├── carrito.js
    │   ├── carrito-page.js
    │   ├── pedido.js
    │   ├── historial.js
    │   ├── cocina.js
    │   └── validaciones.js
    ├── index.html
    ├── login.html
    ├── registro.html
    ├── menu.html
    ├── carrito.html
    ├── pedido.html
    ├── historial.html
    ├── cocina.html
    ├── error.html
    └── 404.html
```

---

## Requisitos previos

- **Java 25+** (JDK)
- **Apache Maven** 3.9+
- **MySQL** 8+
- **Apache Tomcat** 11+

## Cómo ejecutar

1. **Base de datos** — Ejecuta el script `coffeebreak_db.sql` en MySQL:
   ```bash
   mysql -u root -p < coffeebreak_db.sql
   ```

2. **Configurar conexión** — Copia `ConexionBD.java.template` a `ConexionBD.java` y ajusta credenciales.

3. **Compilar y empaquetar:**
   ```bash
   mvn clean package
   ```

4. **Desplegar** — Copia el archivo `target/CoffeeBreak.war` a la carpeta `webapps` de Tomcat e inicia el servidor.

5. **Abrir** — Navega a `http://localhost:8080/CoffeeBreak`

---

## API REST

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/sesion` | Estado de la sesión |
| POST | `/api/login` | Iniciar sesión |
| POST | `/api/registro` | Registrar usuario |
| POST | `/api/logout` | Cerrar sesión |
| GET | `/api/categorias` | Listar categorías |
| GET | `/api/productos` | Listar productos (`?categoria=` / `?busqueda=`) |
| GET | `/api/pedidos` | Pedidos del cliente |
| GET | `/api/pedido/{id}` | Detalle de pedido |
| POST | `/api/pedido` | Crear pedido |
| PUT | `/api/pedido/{id}` | Actualizar estado |
| DELETE | `/api/pedido/{id}` | Cancelar pedido |

---

## Licencia

Proyecto desarrollado con fines educativos.
