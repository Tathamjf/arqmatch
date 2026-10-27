import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Princ.css';
import { useAuth } from './context/useAuth';
import { useCart } from './context/useCart';

function Header({ className = '' }: { className?: string }) {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const firstName = currentUser?.fullName.trim().split(/\s+/)[0];

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className={`navbar ${className}`.trim()}>
      <Link className="logo" to="/" aria-label="ArqMatch - início">
        Arq<strong>Match</strong>
      </Link>

      <button
        className="mobile-menu-btn"
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
        aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/sobre">Sobre</Link></li>
        <li><Link to="/projetos">Projetos</Link></li>
        <li><Link to="/contato">Contato</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to="/carrinho">Carrinho ({itemCount})</Link></li>
            <li><Link to="/pedidos">Pedidos</Link></li>
            <li className="nav-user">Olá, {firstName}</li>
            <li>
              <button className="nav-action" type="button" onClick={handleLogout}>
                Sair
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Entrar</Link></li>
            <li><Link to="/cadastro">Cadastrar</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Header;
