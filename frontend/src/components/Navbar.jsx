import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';
import './Navbar.css';

export default function Navbar() {
  const { count } = useCart();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const links = [
    { to: '/', label: 'Inicio' },
    { to: '/menu', label: 'Menu' },
    { to: '/pedidos', label: 'Pedidos' },
  ];

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">☕</span>
          <span className="brand-text">
            Coffee<span className="brand-accent">Break</span>
          </span>
        </Link>

        <div className="navbar-links">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.label}
              {location.pathname === link.to && (
                <motion.div className="nav-indicator" layoutId="nav-indicator" />
              )}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="Cambiar tema">
            {theme === 'dark' ? (
              <i className="bi bi-sun-fill"></i>
            ) : (
              <i className="bi bi-moon-fill"></i>
            )}
          </button>

          <Link to="/carrito" className="cart-btn">
            <i className="bi bi-bag-fill"></i>
            {count > 0 && (
              <motion.span
                className="cart-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={count}
              >
                {count}
              </motion.span>
            )}
          </Link>

          <Link to="/login" className="btn-ghost btn-sm">
            Iniciar sesion
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
