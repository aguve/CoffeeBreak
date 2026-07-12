import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-icon">☕</span>
          <span className="brand-text">
            Coffee<span className="brand-accent">Break</span>
          </span>
          <p className="footer-tagline">Tu pausa universitaria favorita</p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Navegacion</h4>
            <Link to="/">Inicio</Link>
            <Link to="/menu">Menu</Link>
            <Link to="/pedidos">Pedidos</Link>
          </div>
          <div className="footer-col">
            <h4>Cuenta</h4>
            <Link to="/login">Iniciar sesion</Link>
            <Link to="/registro">Registrarse</Link>
            <Link to="/carrito">Carrito</Link>
          </div>
          <div className="footer-col">
            <h4>Contacto</h4>
            <span>campus@coffeebreak.es</span>
            <span>Edificio B, Planta Baja</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        <span>&copy; 2026 CoffeeBreak. Todos los derechos reservados.</span>
      </div>
    </footer>
  );
}
