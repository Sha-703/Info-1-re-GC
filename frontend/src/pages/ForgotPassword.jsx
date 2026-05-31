import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    if (!email.trim()) {
      setError('L\'email est requis');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Veuillez entrer une adresse email valide');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/forgot-password/', { email });

      if (response.status === 200) {
        setSuccessMessage(response.data.message);
        setEmail('');
      }
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.error) {
        setError(errorData.error);
      } else {
        setError('Erreur lors de la récupération du mot de passe. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="page"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${new URL('../../pg.jpg', import.meta.url).href})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        padding: '1.5rem 1rem',
        position: 'relative'
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', zIndex: 1 }} />
      <div style={{ width: '100%', maxWidth: '450px', position: 'relative', zIndex: 2 }}>
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
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔐</div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem', fontWeight: '700' }}>
              Récupérer le mot de passe
            </h1>
            <p style={{ margin: 0, fontSize: '0.95rem', opacity: '0.95' }}>
              Entrez votre adresse email pour recevoir un lien de réinitialisation
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
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.9rem',
                  color: '#166534',
                  lineHeight: '1.5'
                }}
              >
                <p style={{ margin: '0 0 0.75rem 0', fontWeight: '600' }}>✅ {successMessage}</p>
                <p style={{ margin: 0 }}>Consultez votre email et suivez les instructions pour réinitialiser votre mot de passe.</p>
              </div>
            )}

            {/* Message d'erreur */}
            {error && (
              <div
                style={{
                  background: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  marginBottom: '1.5rem',
                  color: '#991b1b',
                  fontSize: '0.9rem',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center'
                }}
              >
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Champ Email */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: '#374151'
                  }}
                >
                  Adresse email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="votre@email.com"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: error && !email ? '2px solid #ef4444' : '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                    background: loading ? '#f9fafb' : 'white',
                    cursor: loading ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => {
                    if (!error) {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Informations utiles */}
              <div
                style={{
                  background: '#f0f9ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  fontSize: '0.85rem',
                  color: '#1e40af',
                  lineHeight: '1.6'
                }}
              >
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>ℹ️ Information</p>
                <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                  <li>Nous enverrons un lien de réinitialisation à votre email</li>
                  <li>Vérifiez votre dossier spam ou indésirables</li>
                  <li>Le lien expire après 24 heures</li>
                </ul>
              </div>

              {/* Bouton d'envoi */}
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
                    Envoi en cours...
                  </span>
                ) : (
                  'Envoyer le lien de réinitialisation'
                )}
              </button>

              {/* Liens de navigation */}
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  marginTop: '1rem',
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '1rem'
                }}
              >
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
                  ← Se connecter
                </Link>
                <span style={{ color: '#d1d5db' }}>•</span>
                <Link
                  to="/signup"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#764ba2'}
                  onMouseLeave={(e) => e.target.style.color = '#667eea'}
                >
                  Créer un compte →
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            color: 'white',
            fontSize: '0.9rem',
            opacity: 0.9
          }}
        >
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

export default ForgotPassword;
