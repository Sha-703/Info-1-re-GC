import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const logoImage = new URL('../../logoapp.png', import.meta.url).href;

function NavBar({ isAuthenticated }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const toggleMenu = () => setIsOpen((current) => !current);
  const closeMenu = () => setIsOpen(false);

  const navItems = [
    { path: '/', label: 'Accueil', icon: '🏠' },
    { path: '/cours', label: 'Cours', icon: '📚' },
    { path: '/lesson-quiz', label: 'Quiz Leçon', icon: '📝' },
    { path: '/lexique', label: 'Lexique', icon: '🗂️' },
    { path: '/score', label: 'Score', icon: '📊' },
    { path: '/apropos', label: 'À propos', icon: 'ℹ️' },
  ];

  return (
    <header className="navbar-top">
      <div className="navbar-brand">
        <img src={logoImage} alt="Logo Info 1er CG" className="brand-logo" />
        <div className="brand-text">
          <span className="brand-title">Info 1er CG</span>
          <span className="brand-subtitle">Support scolaire</span>
        </div>
      </div>

      <button
        className={`navbar-toggle${isOpen ? ' open' : ''}`}
        onClick={toggleMenu}
        aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      <nav className={`navbar-links${isOpen ? ' visible' : ''}`}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            onClick={closeMenu}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {isAuthenticated && (
        <div className="auth-actions">
          <button type="button" onClick={handleLogout} className="btn-top-logout">
            🚪 Déconnexion
          </button>
        </div>
      )}
    </header>
  );
}

export default NavBar;
