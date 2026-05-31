import { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import '../styles.css';

function Score() {
  const [lessonResults, setLessonResults] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'lesson', 'quiz'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'score'
  const isAuthenticated = Boolean(localStorage.getItem('access_token'));
  const LOCAL_SCORE_KEY = 'lessonQuizLocalResults';

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      const localResults = JSON.parse(localStorage.getItem(LOCAL_SCORE_KEY) || '[]');
      if (localResults.length > 0) {
        setLessonResults(localResults);
      } else {
        setError('Connectez-vous ou passez un quiz pour voir vos résultats ici.');
      }
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        const [lessonRes, quizRes] = await Promise.all([
          api.get('/lesson-quiz-results/'),
          api.get('/results/').catch(() => ({ data: [] }))
        ]);

        const lessonData = Array.isArray(lessonRes.data) ? lessonRes.data : [];
        const quizData = Array.isArray(quizRes.data) ? quizRes.data : [];

        setLessonResults(lessonData);
        setQuizResults(quizData);
      } catch (err) {
        console.error('Erreur de chargement des scores:', err);
        setError('Impossible de charger vos résultats personnels pour le moment.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Filtre et tri des résultats
  const displayedResults = useMemo(() => {
    let combined = [];

    if (filter === 'all' || filter === 'lesson') {
      combined = combined.concat(
        lessonResults.map(r => ({ ...r, type: 'lesson', title: r.lesson_title || 'Quiz Leçon' }))
      );
    }
    if (filter === 'all' || filter === 'quiz') {
      combined = combined.concat(
        quizResults.map(r => ({ ...r, type: 'quiz', title: r.quiz_title || 'Quiz' }))
      );
    }

    if (sortBy === 'date') {
      combined.sort((a, b) => new Date(b.taken_at) - new Date(a.taken_at));
    } else if (sortBy === 'score') {
      combined.sort((a, b) => b.score - a.score);
    }

    return combined;
  }, [lessonResults, quizResults, filter, sortBy]);

  // Statistiques globales
  const stats = useMemo(() => {
    const allResults = [...lessonResults, ...quizResults];
    if (allResults.length === 0) {
      return { avgScore: 0, totalAttempts: 0, perfectScores: 0, passRate: 0 };
    }

    const avgScore = (allResults.reduce((sum, r) => sum + (r.score || 0), 0) / allResults.length).toFixed(1);
    const perfectScores = allResults.filter(r => r.score >= (r.max_score || 10) * 0.95).length;
    const passRate = ((allResults.filter(r => r.score >= 6).length / allResults.length) * 100).toFixed(0);

    return {
      avgScore,
      totalAttempts: allResults.length,
      perfectScores,
      passRate
    };
  }, [lessonResults, quizResults]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score, maxScore = 10) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 75) return { bg: '#d1fae5', text: '#059669', label: 'Excellent' };
    if (percentage >= 60) return { bg: '#dbeafe', text: '#1d4ed8', label: 'Bon' };
    return { bg: '#fee2e2', text: '#b91c1c', label: 'À améliorer' };
  };

  const scoreStyle = getScoreColor(stats.avgScore);

  return (
    <section className="page">
      <div className="page-section page-section--narrow">
        <div className="page-header">
          <h1>📊 Historique de mes quiz</h1>
          <p>
            Retrouvez tous vos résultats, statistiques et votre progression au fil du temps.
          </p>
        </div>

        {error ? (
          <div className="placeholder-card">
            <p>{error}</p>
          </div>
        ) : !isAuthenticated && displayedResults.length > 0 ? (
          <div className="placeholder-card" style={{ background: '#fef3c7', border: '1px solid #fcd34d' }}>
            <p style={{ margin: 0 }}>
              ⚠️ Résultats affichés depuis votre session locale. Connectez-vous pour les sauvegarder sur votre compte.
            </p>
          </div>
        ) : null}

        {loading ? (
          <div className="placeholder-card" style={{ textAlign: 'center' }}>
            <p>⏳ Chargement de vos résultats...</p>
          </div>
        ) : displayedResults.length === 0 ? (
          <div className="placeholder-card">
            <p>Vous n'avez pas encore passé de quiz. Commencez par un quiz pour voir vos scores ici.</p>
          </div>
        ) : (
          <>
            {/* Statistiques récapitulatives */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: '#f3f4f6', padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.9rem' }}>Moyenne générale</p>
                <h3 style={{ margin: 0, fontSize: '2rem', background: scoreStyle.bg, color: scoreStyle.text, padding: '0.5rem', borderRadius: '0.375rem' }}>
                  {stats.avgScore}/10
                </h3>
                <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280', fontSize: '0.9rem' }}>{scoreStyle.label}</p>
              </div>
              <div style={{ background: '#f3f4f6', padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.9rem' }}>Quiz passés</p>
                <h3 style={{ margin: 0, fontSize: '2rem', color: '#7c3aed' }}>
                  {stats.totalAttempts}
                </h3>
              </div>
              <div style={{ background: '#f3f4f6', padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.9rem' }}>Taux de réussite</p>
                <h3 style={{ margin: 0, fontSize: '2rem', color: '#10b981' }}>
                  {stats.passRate}%
                </h3>
              </div>
              <div style={{ background: '#f3f4f6', padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.9rem' }}>Parfait (≥95%)</p>
                <h3 style={{ margin: 0, fontSize: '2rem', color: '#f59e0b' }}>
                  {stats.perfectScores}
                </h3>
              </div>
            </div>

            {/* Filtres et tri */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Type</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.95rem'
                  }}
                >
                  <option value="all">Tous les quiz</option>
                  <option value="lesson">Quiz leçons</option>
                  <option value="quiz">Quiz classiques</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Trier par</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.95rem'
                  }}
                >
                  <option value="date">Date (plus récent)</option>
                  <option value="score">Score (plus haut)</option>
                </select>
              </div>
            </div>

            {/* Liste des résultats */}
            <div style={{ display: 'grid', gap: '1rem' }}>
              {displayedResults.map((result) => {
                const colors = getScoreColor(result.score, result.max_score || 10);
                return (
                  <article
                    key={`${result.type}-${result.id}`}
                    style={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      padding: '1.5rem',
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: '1.5rem',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', background: '#e0e7ff', color: '#4338ca', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
                          {result.type === 'lesson' ? '📚 Leçon' : '📝 Quiz'}
                        </span>
                        <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>{formatDate(result.taken_at)}</span>
                      </div>
                      <h3 style={{ margin: '0.5rem 0', color: '#111827', fontSize: '1.1rem' }}>
                        {result.title}
                      </h3>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem' }}>
                        Score : <strong>{result.score.toFixed(1)}</strong> / {result.max_score || 10}
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          background: colors.bg,
                          color: colors.text,
                          padding: '1rem',
                          borderRadius: '0.5rem',
                          minWidth: '80px'
                        }}
                      >
                        <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
                          {((result.score / (result.max_score || 10)) * 100).toFixed(0)}%
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: '600', marginTop: '0.25rem' }}>
                          {colors.label}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Score;
