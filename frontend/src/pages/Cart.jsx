import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import './Cart.css';

export default function Cart() {
  const { items, removeItem, updateCantidad, clearCart, total, count } = useCart();

  if (items.length === 0) {
    return (
      <main className="cart-page container">
        <motion.div
          className="empty-cart"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <i className="bi bi-bag" />
          <h2>Tu carrito esta vacio</h2>
          <p>Anade algun producto del menu para empezar</p>
          <Link to="/menu" className="btn-primary-custom">
            Ver el menu
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="cart-page container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="section-title">Tu carrito</h1>
        <p className="section-subtitle">{count} {count === 1 ? 'producto' : 'productos'}</p>
      </motion.div>

      <div className="cart-layout">
        <div className="cart-items">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                className="cart-item glass-card"
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0, padding: 0 }}
                transition={{ duration: 0.3 }}
              >
                <img className="cart-item-img" src={item.imagen} alt={item.nombre} />
                <div className="cart-item-info">
                  <h3>{item.nombre}</h3>
                  <div className="cart-item-price">{item.precio.toFixed(2)} &euro;</div>
                </div>
                <div className="cart-item-controls">
                  <button
                    className="qty-btn"
                    onClick={() => updateCantidad(item.id, item.cantidad - 1)}
                  >
                    <i className="bi bi-dash" />
                  </button>
                  <span className="qty-value">{item.cantidad}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateCantidad(item.id, item.cantidad + 1)}
                  >
                    <i className="bi bi-plus" />
                  </button>
                </div>
                <div className="cart-item-subtotal">
                  {(item.precio * item.cantidad).toFixed(2)} &euro;
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => removeItem(item.id)}
                >
                  <i className="bi bi-x-lg" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          <button className="btn-ghost clear-cart-btn" onClick={clearCart}>
            <i className="bi bi-trash3" style={{ marginRight: '0.5rem' }} />
            Vaciar carrito
          </button>
        </div>

        <div className="cart-summary glass-card">
          <h2>Resumen</h2>
          <div className="summary-row">
            <span>Subtotal ({count} productos)</span>
            <span>{total.toFixed(2)} &euro;</span>
          </div>
          <div className="summary-row">
            <span>Gastos de envio</span>
            <span className="free-shipping">Gratis</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>{total.toFixed(2)} &euro;</span>
          </div>
          <button className="btn-primary-custom checkout-btn">
            <i className="bi bi-credit-card" style={{ marginRight: '0.5rem' }} />
            Tramitar pedido
          </button>
        </div>
      </div>
    </main>
  );
}
