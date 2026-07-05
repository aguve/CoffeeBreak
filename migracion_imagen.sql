USE coffeebreak_db;

ALTER TABLE PRODUCTO ADD COLUMN imagen VARCHAR(500) AFTER descripcion;

UPDATE PRODUCTO SET imagen = 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=300&h=300&fit=crop' WHERE id_producto = 1;
UPDATE PRODUCTO SET imagen = 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300&h=300&fit=crop' WHERE id_producto = 2;
UPDATE PRODUCTO SET imagen = 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=300&fit=crop' WHERE id_producto = 3;
UPDATE PRODUCTO SET imagen = 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=300&h=300&fit=crop' WHERE id_producto = 4;
UPDATE PRODUCTO SET imagen = 'https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=300&h=300&fit=crop' WHERE id_producto = 5;
UPDATE PRODUCTO SET imagen = 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=300&fit=crop' WHERE id_producto = 6;
UPDATE PRODUCTO SET imagen = 'https://images.unsplash.com/photo-1596803244618-8d5cca6c68ba?w=300&h=300&fit=crop' WHERE id_producto = 7;
UPDATE PRODUCTO SET imagen = 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=300&fit=crop' WHERE id_producto = 8;
UPDATE PRODUCTO SET imagen = 'https://images.unsplash.com/photo-1485963631004-f2f00b1d6606?w=300&h=300&fit=crop' WHERE id_producto = 9;
UPDATE PRODUCTO SET imagen = 'https://images.unsplash.com/photo-1555507036-ab1f4038028a?w=300&h=300&fit=crop' WHERE id_producto = 10;
UPDATE PRODUCTO SET imagen = 'https://images.unsplash.com/photo-1609505848912-b78c2c14e1e4?w=300&h=300&fit=crop' WHERE id_producto = 11;
UPDATE PRODUCTO SET imagen = 'https://images.unsplash.com/photo-1609501078723-6bd52f6e48f9?w=300&h=300&fit=crop' WHERE id_producto = 12;
