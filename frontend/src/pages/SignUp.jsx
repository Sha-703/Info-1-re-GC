import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    } else if (username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    }

    if (!email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Veuillez entrer une adresse email valide';
    }

    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    } else if (!/(?=.*[A-Z])/.test(password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins une lettre majuscule';
    } else if (!/(?=.*[0-9])/.test(password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins un chiffre';
    }

    if (!password2) {
      newErrors.password2 = 'Veuillez confirmer votre mot de passe';
    } else if (password !== password2) {
      newErrors.password2 = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/register/', {
        username,
        email,
        role,
        password,
        password2
      });

      if (response.status === 201 || response.status === 200) {
        setSuccessMessage('✅ Inscription réussie ! Redirection vers la connexion...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        if (typeof errorData === 'object') {
          const newErrors = {};
          Object.keys(errorData).forEach(key => {
            newErrors[key] = Array.isArray(errorData[key]) ? errorData[key][0] : errorData[key];
          });
          setErrors(newErrors);
        } else {
          setErrors({ general: 'Erreur lors de l\'inscription. Veuillez réessayer.' });
        }
      } else {
        setErrors({ general: 'Erreur de connexion. Veuillez réessayer ultérieurement.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const FieldError = ({ field }) => {
    return errors[field] ? (
      <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem', margin: 0 }}>
        {errors[field]}
      </p>
    ) : null;
  };

  const backgroundImage = new URL('../../pg.jpg', import.meta.url).href;

  return (
    <section
      className="page"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        padding: '1.5rem 1rem',
        position: 'relative'
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', zIndex: 1 }} />
      <div style={{ width: '100%', maxWidth: '500px', position: 'relative', zIndex: 2 }}>
        {/* Conteneur principal */}
        <div
          style={{
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden'
          }}
        >
          {/* Header gradient */}
          <div
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              color: 'white'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📝</div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem', fontWeight: '700' }}>
              Créer un compte
            </h1>
            <p style={{ margin: 0, fontSize: '0.95rem', opacity: '0.95' }}>
              Rejoignez notre plateforme d'apprentissage
            </p>
          </div>

          {/* Contenu du formulaire */}
          <div style={{ padding: '2rem 1.5rem' }}>
            {/* Message de succès */}
            {successMessage && (
              <div
                style={{
                  background: '#dcfce7',
                  border: '1px solid #86efac',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  color: '#166534',
                  marginBottom: '1.5rem',
                  fontSize: '0.9rem',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center'
                }}
              >
                <span>{successMessage}</span>
              </div>
            )}

            {/* Message d'erreur général */}
            {errors.general && (
              <div
                style={{
                  background: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  color: '#991b1b',
                  marginBottom: '1.5rem',
                  fontSize: '0.9rem',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center'
                }}
              >
                <span>⚠️</span>
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Champ Username */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors({ ...errors, username: '' });
                  }}
                  placeholder="Choisissez un nom d'utilisateur"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: errors.username ? '2px solid #ef4444' : '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                    background: loading ? '#f9fafb' : 'white',
                    cursor: loading ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => {
                    if (!errors.username) {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }
                  }}
                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                />
                <FieldError field="username" />
              </div>

              {/* Champ Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  Adresse email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="votre@email.com"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: errors.email ? '2px solid #ef4444' : '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                    background: loading ? '#f9fafb' : 'white',
                    cursor: loading ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => {
                    if (!errors.email) {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }
                  }}
                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                />
                <FieldError field="email" />
              </div>

              {/* Champ Role */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  Rôle
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                    background: loading ? '#f9fafb' : 'white',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  <option value="student">👤 Élève</option>
                  <option value="teacher">👨‍🏫 Enseignant</option>
                </select>
              </div>

              {/* Champ Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  Mot de passe
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    placeholder="Au moins 6 caractères (1 majuscule + 1 chiffre)"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      paddingRight: '2.5rem',
                      border: errors.password ? '2px solid #ef4444' : '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                      background: loading ? '#f9fafb' : 'white',
                      cursor: loading ? 'not-allowed' : 'text'
                    }}
                    onFocus={(e) => {
                      if (!errors.password) {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
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
                <FieldError field="password" />
              </div>

              {/* Champ Confirm Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  Confirmer le mot de passe
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showPassword2 ? 'text' : 'password'}
                    value={password2}
                    onChange={(e) => {
                      setPassword2(e.target.value);
                      if (errors.password2) setErrors({ ...errors, password2: '' });
                    }}
                    placeholder="Confirmez votre mot de passe"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      paddingRight: '2.5rem',
                      border: errors.password2 ? '2px solid #ef4444' : '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                      background: loading ? '#f9fafb' : 'white',
                      cursor: loading ? 'not-allowed' : 'text'
                    }}
                    onFocus={(e) => {
                      if (!errors.password2) {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword2(!showPassword2)}
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
                    {showPassword2 ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <FieldError field="password2" />
              </div>

              {/* Bouton d'inscription */}
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
                    <span
                      style={{
                        display: 'inline-block',
                        width: '1rem',
                        height: '1rem',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                      }}
                    />
                    Création du compte...
                  </span>
                ) : (
                  'S\'inscrire'
                )}
              </button>

              {/* Lien vers la connexion */}
              <p style={{ textAlign: 'center', margin: '1rem 0 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
                Vous avez déjà un compte ?{' '}
                <Link
                  to="/login"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#764ba2'}
                  onMouseLeave={(e) => e.target.style.color = '#667eea'}
                >
                  Se connecter
                </Link>
              </p>
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

export default SignUp;
