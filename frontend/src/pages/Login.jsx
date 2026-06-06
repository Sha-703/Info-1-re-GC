import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Validation du formulaire
  const validateForm = () => {
    if (!username.trim()) {
      setError('Le nom d\'utilisateur est requis');
      return false;
    }
    if (!password) {
      setError('Le mot de passe est requis');
      return false;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/token/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Identifiants invalides. Vérifiez votre nom d\'utilisateur et mot de passe.');
      } else if (err.response?.status === 400) {
        setError('Données invalides. Veuillez réessayer.');
      } else {
        setError('Erreur de connexion. Veuillez réessayer ultérieurement.');
      }
    } finally {
      setLoading(false);
    }
  };

  const backgroundImage = new URL('../../pg.jpg', import.meta.url).href;

  return (
    <section className="page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'scroll', backgroundRepeat: 'no-repeat', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', zIndex: 1 }} />
      <div style={{ width: '100%', maxWidth: '450px', padding: '1.5rem', position: 'relative', zIndex: 2 }}>
        {/* Conteneur principal */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden'
        }}>
          {/* Header gradient */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎓</div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem', fontWeight: '700' }}>
              Connexion
            </h1>
            <p style={{ margin: 0, fontSize: '0.95rem', opacity: '0.95' }}>
              Accédez à votre espace d'apprentissage
            </p>
          </div>

          {/* Contenu du formulaire */}
          <div style={{ padding: '2rem 1.5rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Champ Username */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#374151'
                }}>
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Entrez votre nom d'utilisateur"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: error && !username ? '2px solid #ef4444' : '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                    background: loading ? '#f9fafb' : 'white',
                    cursor: loading ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Champ Password */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#374151'
                }}>
                  Mot de passe
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Entrez votre mot de passe"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      paddingRight: '2.5rem',
                      border: error && !password ? '2px solid #ef4444' : '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                      background: loading ? '#f9fafb' : 'white',
                      cursor: loading ? 'not-allowed' : 'text'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      background: 'none',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '1.2rem',
                      opacity: 0.6,
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '1'}
                    onMouseLeave={(e) => e.target.style.opacity = '0.6'}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div style={{
                  background: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  color: '#991b1b',
                  fontSize: '0.9rem',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center'
                }}>
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.75rem 1rem',
                  background: loading ? '#d1d5db' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: loading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)',
                  opacity: loading ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                  }
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '1rem',
                      height: '1rem',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    Connexion en cours...
                  </span>
                ) : (
                  'Se connecter'
                )}
              </button>

              {/* Liens de navigation */}
              <div style={{
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280', textAlign: 'center' }}>Vous n'avez pas de compte ?</p>
                <Link
                  to="/signup"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '0.5rem',
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    borderRadius: '0.375rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f0f4ff';
                    e.target.style.color = '#764ba2';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#667eea';
                  }}
                >
                  👤 Créer un compte
                </Link>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#6b7280', textAlign: 'center' }}>Mot de passe oublié ?</p>
                <Link
                  to="/forgot-password"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '0.5rem',
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    borderRadius: '0.375rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f0f4ff';
                    e.target.style.color = '#764ba2';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#667eea';
                  }}
                >
                  🔐 Récupérer l'accès
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          color: 'white',
          fontSize: '0.9rem',
          opacity: 0.9,
          position: 'relative',
          zIndex: 2
        }}>
          © 2024 Application Éducative • Plateforme d'apprentissage numériques
        </p>
      </div>

      {/* Animation CSS */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}

export default Login;
