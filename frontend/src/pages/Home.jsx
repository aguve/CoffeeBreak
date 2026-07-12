import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import './Home.css';

const categories = [
  { id: 1, name: 'Cafes', icon: 'bi-cup-hot-fill', desc: 'El alma del cafe' },
  { id: 2, name: 'Bebidas', icon: 'bi-droplet-fill', desc: 'Refrescate' },
  { id: 3, name: 'Bocadillos', icon: 'bi-hand-index-thumb-fill', desc: 'Para el hambre' },
  { id: 4, name: 'Bolleria', icon: 'bi-cake2-fill', desc: 'Dulces tentaciones' },
];

export default function Home() {
  const { data: productos, loading } = useApi(() => api.productos.getAll(), []);

  const featured = productos ? productos.slice(0, 4) : [];

  return (
    <main className="home-page">
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-blobs">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>
        <div className="container hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="hero-title">
              Tu pausa
              <br />
              <span className="gradient-text">universitaria</span>
            </h1>
            <p className="hero-subtitle">
              Cafes de especialidad, bocadillos artesanales y bolleria fresca.
              Todo lo que necesitas para recargar energias entre clase y clase.
            </p>
            <div className="hero-actions">
              <Link to="/menu" className="btn-primary-custom">
                <i className="bi bi-grid-3x3-gap-fill" style={{ marginRight: '0.5rem' }} />
                Ver el menu
              </Link>
              <Link to="/registro" className="btn-ghost">
                Crear cuenta
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-card glass-card">
              <div className="hero-card-icon">☕</div>
              <div className="hero-card-label">Cafe del dia</div>
              <div className="hero-card-name">Latte Macchiato</div>
              <div className="hero-card-price">2.50 &euro;</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Explora por categoria</h2>
          <p className="section-subtitle">Encuentra exactamente lo que buscas</p>
        </motion.div>

        <div className="categories-grid">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link to={`/menu?categoria=${cat.id}`} className="category-card glass-card">
                <div className="category-icon">
                  <i className={`bi ${cat.icon}`} />
                </div>
                <div className="category-info">
                  <h3>{cat.name}</h3>
                  <p>{cat.desc}</p>
                </div>
                <i className="bi bi-arrow-right category-arrow" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Lo mas pedido</h2>
          <p className="section-subtitle">Nuestros favoritos entre los estudiantes</p>
        </motion.div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="product-grid">
            {featured.map((p, i) => (
              <ProductCard key={p.id} producto={p} index={i} />
            ))}
          </div>
        )}

        <motion.div
          className="section-cta"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link to="/menu" className="btn-primary-custom">
            Ver todo el menu
            <i className="bi bi-arrow-right" style={{ marginLeft: '0.5rem' }} />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
