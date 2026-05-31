import { Link, NavLink, useNavigate } from 'react-router-dom';

const logoImage = new URL('../../logoapp.png', import.meta.url).href;

function NavBar({ isAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Accueil', icon: '🏠' },
    { path: '/cours', label: 'Cours', icon: '📚' },
    { path: '/lesson-quiz', label: 'Quiz Leçon', icon: '📝' },
    { path: '/lexique', label: 'Lexique', icon: '🗂️' },
    { path: '/score', label: 'Score', icon: '📊' },
    { path: '/apropos', label: 'À propos', icon: 'ℹ️' },
  ];

  return (
    <>
      <header className="navbar-sidebar">
        <div className="sidebar-header">
          <img src={logoImage} alt="Logo Info 1ère GC" className="sidebar-logo" />
          <span className="sidebar-title">Info 1ère GC</span>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </header>

      <div className="auth-button-top-right">
        {isAuthenticated ? (
          <button type="button" onClick={handleLogout} className="btn-top-logout">
            🚪 Déconnexion
          </button>
        ) : (
          <Link to="/login" className="btn-top-login">
            🔐 Connexion
          </Link>
        )}
      </div>
    </>
  );
}

export default NavBar;
