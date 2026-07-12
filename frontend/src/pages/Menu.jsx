import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import './Menu.css';

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get('categoria') || 'all'
  );

  const { data: productos, loading } = useApi(() => api.productos.getAll(), []);

  const categories = [
    { id: 'all', name: 'Todos', icon: 'bi-grid-3x3-gap-fill' },
    { id: '1', name: 'Cafes', icon: 'bi-cup-hot-fill' },
    { id: '2', name: 'Bebidas', icon: 'bi-droplet-fill' },
    { id: '3', name: 'Bocadillos', icon: 'bi-hand-index-thumb-fill' },
    { id: '4', name: 'Bolleria', icon: 'bi-cake2-fill' },
  ];

  useEffect(() => {
    const cat = searchParams.get('categoria');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      searchParams.delete('categoria');
    } else {
      searchParams.set('categoria', catId);
    }
    setSearchParams(searchParams);
  };

  const filtered =
    activeCategory === 'all'
      ? productos || []
      : (productos || []).filter(
          (p) => String(p.idCategoria) === activeCategory
        );

  return (
    <main className="menu-page container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="section-title">Nuestro menu</h1>
        <p className="section-subtitle">{filtered.length} productos disponibles</p>
      </motion.div>

      <div className="category-filters">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat.id)}
          >
            <i className={`bi ${cat.icon}`} />
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="product-grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {filtered.map((p, i) => (
              <ProductCard key={p.id} producto={p} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <i className="bi bi-search" />
          <p>No hay productos en esta categoria</p>
        </div>
      )}
    </main>
  );
}
