import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Orders.css';

export default function Orders() {
  return (
    <main className="orders-page container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="section-title">Mis pedidos</h1>
        <p className="section-subtitle">Consulta el estado de tus pedidos</p>
      </motion.div>

      <motion.div
        className="empty-state"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <i className="bi bi-receipt" />
        <h2>No tienes pedidos aun</h2>
        <p>Inicia sesion para ver tu historial de pedidos</p>
        <Link to="/login" className="btn-primary-custom" style={{ marginTop: '1rem' }}>
          Iniciar sesion
        </Link>
      </motion.div>
    </main>
  );
}
