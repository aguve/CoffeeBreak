import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import './ProductCard.css';

export default function ProductCard({ producto, index = 0 }) {
  const { addItem } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isAdding, setIsAdding] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -10, y: x * 10 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const handleAdd = () => {
    addItem({
      id: producto.id,
      nombre: producto.nombre_producto,
      precio: producto.precio,
      imagen: producto.imagen,
    });
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      <div className="product-img-wrap">
        {!imageLoaded && <div className="skeleton product-img-skeleton" />}
        <img
          className={`product-img ${imageLoaded ? 'loaded' : ''}`}
          src={producto.imagen}
          alt={producto.nombre_producto}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
        <div className="product-img-overlay" />
      </div>

      <div className="product-body">
        <span className="product-category-badge">{producto.categoria?.nombre || 'Sin categoria'}</span>
        <h3 className="product-name">{producto.nombre_producto}</h3>
        <p className="product-desc">{producto.descripcion}</p>

        <div className="product-footer">
          <span className="product-price">
            {producto.precio.toFixed(2)} &euro;
          </span>
          <motion.button
            className={`btn-add ${isAdding ? 'adding' : ''}`}
            onClick={handleAdd}
            whileTap={{ scale: 0.9 }}
          >
            {isAdding ? (
              <i className="bi bi-check-lg" />
            ) : (
              <i className="bi bi-plus-lg" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
