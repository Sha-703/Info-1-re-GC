import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import '../styles.css';

function LessonQuiz() {
  const [lessons, setLessons] = useState([]);
  const [lessonOrderMap, setLessonOrderMap] = useState({});
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    fetchLessons();
  }, []);

  useEffect(() => {
    const lessonId = Number(new URLSearchParams(location.search).get('lessonId'));
    if (lessonId && lessons.length > 0) {
      fetchLessonQuestions(resolveLessonId(lessonId));
    }
  }, [location.search, lessons]);

  const resolveLessonId = (lessonId) => {
    if (!lessonId) return null;
    if (lessons.some((lesson) => lesson.id === lessonId)) {
      return lessonId;
    }
    const resolved = lessonOrderMap[lessonId];
    if (!resolved) {
      console.warn('Lesson order mapping missing for lessonId:', lessonId, 'map:', lessonOrderMap);
      return null;
    }
    console.log('Resolved lesson id', { input: lessonId, resolved });
    return resolved;
  };

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await api.get('/lessons/');
      setLessons(response.data);
      const map = {};
      response.data.forEach((lesson) => {
        if (lesson.order != null) {
          map[lesson.order] = lesson.id;
        }
      });
      setLessonOrderMap(map);
      console.log('Loaded lesson order map:', map);
    } catch (error) {
      console.error('Erreur lors du chargement des leçons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessonQuestions = async (lessonId) => {
    const resolvedLessonId = resolveLessonId(lessonId);
    if (!resolvedLessonId) return;
    console.log('Fetching lesson questions for resolved id:', resolvedLessonId);
    try {
      setLoading(true);
      const response = await api.get(`/lessons/${resolvedLessonId}/questions/`);
      setQuestions(response.data);
      setSelectedLesson(resolvedLessonId);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setShowResults(false);
      setResults(null);
    } catch (error) {
      console.error('Erreur lors du chargement des questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResults = async () => {
    try {
      setLoading(true);
      const response = await api.post('/lessons/submit_quiz/', {
        lesson_id: selectedLesson,
        answers: answers
      });
      setResults(response.data);
      saveLocalLessonQuizResult({
        id: `${response.data.lesson_id}-${Date.now()}`,
        lesson_title: response.data.lesson_title,
        score: response.data.score,
        max_score: response.data.max_score,
        taken_at: new Date().toISOString(),
        details: response.data.details
      });
      setShowResults(true);
    } catch (error) {
      console.error('Erreur lors de la soumission du quiz:', error);
      alert('Erreur lors de la soumission du quiz');
    } finally {
      setLoading(false);
    }
  };

  const getLesson = () => {
    return lessons.find(l => l.id === selectedLesson);
  };
  const LOCAL_SCORE_KEY = 'lessonQuizLocalResults';

  const saveLocalLessonQuizResult = (result) => {
    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_SCORE_KEY)) || [];
      const updated = [result, ...existing].slice(0, 20);
      localStorage.setItem(LOCAL_SCORE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Erreur de sauvegarde locale du score :', error);
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      'remember': '#2563eb',
      'understand': '#7c3aed',
      'apply': '#f59e0b',
      'analyze': '#ef4444',
      'evaluate': '#06b6d4'
    };
    return colors[level] || '#6366f1';
  };

  const getLevelLabel = (level) => {
    const labels = {
      'remember': 'Se souvenir',
      'understand': 'Comprendre',
      'apply': 'Appliquer',
      'analyze': 'Analyser',
      'evaluate': 'Évaluer'
    };
    return labels[level] || level;
  };

  const computeWeakAreas = (details) => {
    const weak = {};
    (details || []).forEach((detail) => {
      if (!detail.is_correct) {
        weak[detail.level] = (weak[detail.level] || 0) + 1;
      }
    });
    return weak;
  };

  const renderTeacherAdvice = (score, details = []) => {
    let title = '';
    let advice = '';
    let color = '';
    const weakAreas = computeWeakAreas(details);
    const observations = [];

    if (score >= 9) {
      title = 'Expert en devenir';
      advice = 'Excellent travail ! Votre maîtrise est très solide. Consolidez vos acquis en relisant rapidement les notions les plus avancées et soyez prêt à expliquer ces points à un pair.';
      color = '#22c55e';
    } else if (score >= 7.5) {
      title = 'Très bonne performance';
      advice = 'Très bon résultat. Vous comprenez bien les concepts clés. Identifiez les questions moins fortes et relisez ces notions pour atteindre l’excellence.';
      color = '#10b981';
    } else if (score >= 6) {
      title = 'Bonne progression';
      advice = 'Bon travail. Vous maîtrisez plusieurs notions, mais certains détails restent à améliorer. Revoyez les explications et refaites le quiz après une courte révision.';
      color = '#06b6d4';
    } else if (score >= 4) {
      title = 'À renforcer';
      advice = 'Résultat acceptable. Vous avez saisi les bases, mais il est important de clarifier les idées clés et de pratiquer davantage.';
      color = '#f59e0b';
    } else {
      title = 'Besoin de consolidation';
      advice = 'Ce score indique qu’il faut reprendre la leçon plus en détail. Travaillez point par point et refaites le quiz après chaque session de révision.';
      color = '#ef4444';
    }

    if (weakAreas.remember) {
      observations.push('Revenez sur les notions clés et les définitions de base.');
    }
    if (weakAreas.understand) {
      observations.push('Travaillez la compréhension des concepts et des relations entre eux.');
    }
    if (weakAreas.apply) {
      observations.push('Entraînez-vous avec des exemples concrets pour mieux appliquer les concepts.');
    }
    if (weakAreas.analyze) {
      observations.push('Analysez les situations et les cas pratiques pour renforcer votre raisonnement.');
    }
    if (weakAreas.evaluate) {
      observations.push('Faites des exercices d’évaluation et comparez les choix pour mieux distinguer les bonnes réponses.');
    }

    if (observations.length > 0) {
      advice += ' ' + observations.join(' ');
    }

    return { title, advice, color };
  };

  // Vue d'accueil des leçons
  if (!selectedLesson) {
    return (
      <section className="page">
        <div className="page-header">
          <h1>🎯 Quiz par Leçon</h1>
          <p>Testez votre compréhension avec 10 questions par leçon</p>
        </div>

        {loading ? (
          <div className="content-panel" style={{ textAlign: 'center' }}>
            <p>Chargement des leçons...</p>
          </div>
        ) : lessons.length === 0 ? (
          <div className="content-panel" style={{ textAlign: 'center' }}>
            <p>Aucune leçon n'a été trouvée. Le backend ne semble pas encore avoir de données publiées.</p>
            <p>Veuillez vérifier la population de la base de données et redéployer le backend.</p>
          </div>
        ) : (
          <div className="list-grid">
            {lessons.map((lesson) => (
              <article
                key={lesson.id}
                className="card card--clickable"
                onClick={() => fetchLessonQuestions(lesson.id)}
                style={{ borderTop: `4px solid #7c3aed` }}
              >
                <div className="card-icon" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }}>
                  📝
                </div>
                <h2 style={{ color: '#7c3aed' }}>{lesson.title}</h2>
                <p className="card-description">{lesson.content?.substring(0, 100)}...</p>
                <div className="card-buttons">
                  <button className="btn btn-primary button-full">
                    🎯 Commencer le Quiz (10 questions)
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    );
  }

  // Vue du quiz en cours
  if (!showResults) {
    const lesson = getLesson();
    const currentQuestion = questions[currentQuestionIndex];
    const isAnswered = answers[currentQuestion?.id];
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <section className="page">
        <div className="page-section page-section--narrow">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ color: '#7c3aed', margin: '0 0 0.5rem 0' }}>📚 {lesson.title}</h1>
              <p style={{ margin: 0, color: '#6b7280' }}>Question {currentQuestionIndex + 1} sur {questions.length}</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedLesson(null)}>
                ← Retour
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/cours')}>
                📘 Voir le cours
              </button>
            </div>
          </div>

          <div className="progress-track" style={{ marginBottom: '2rem' }}>
            <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
          </div>

          {currentQuestion && (
            <div className="quiz-card" style={{ marginBottom: '2rem' }}>
              <div style={{ marginBottom: '1.5rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '1.5rem' }}>
                <div style={{
                  display: 'inline-block',
                  background: `${getLevelColor(currentQuestion.level)}20`,
                  color: getLevelColor(currentQuestion.level),
                  padding: '0.35rem 0.9rem',
                  borderRadius: '0.35rem',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  marginBottom: '1rem'
                }}>
                  {getLevelLabel(currentQuestion.level)}
                </div>
                <h2 style={{
                  margin: '1rem 0 0 0',
                  color: '#111827',
                  fontSize: '1.3rem',
                  lineHeight: '1.7'
                }}>
                  {currentQuestion.text}
                </h2>
              </div>

              <div className="quiz-options" style={{ marginBottom: '2rem' }}>
                {['a', 'b', 'c'].map((option) => {
                  const optionKey = `option_${option}`;
                  const isSelected = answers[currentQuestion.id] === option;
                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                      className={`quiz-option ${isSelected ? 'selected' : ''}`}
                      style={{
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{currentQuestion[optionKey]}</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: isSelected ? '#1d4ed8' : '#6b7280' }}>
                        {option.toUpperCase()}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="btn btn-secondary"
                  style={{ width: 'calc(50% - 0.5rem)', minWidth: '140px' }}
                >
                  ← Précédent
                </button>

                <button
                  onClick={handleNextQuestion}
                  disabled={!isAnswered}
                  className="btn btn-primary"
                  style={{ width: 'calc(50% - 0.5rem)', minWidth: '140px' }}
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Voir les résultats' : 'Suivant →'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Vue des résultats
  const lesson = getLesson();
  const score = results?.score ?? 0;
  const correctCount = results?.correct_count ?? results?.details?.filter((detail) => detail.is_correct).length ?? 0;
  const { title: adviceTitle, advice, color } = renderTeacherAdvice(score, results?.details || []);

  return (
    <section className="page">
      <div className="page-section page-section--narrow">
        <h1 style={{ color: '#1f2937', textAlign: 'center', marginBottom: '2rem' }}>
          📊 Résultats - {lesson.title}
        </h1>

        <div style={{
          background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
          border: `2px solid ${color}`,
          borderRadius: '1.5rem',
          padding: '2.5rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '4rem',
            fontWeight: '700',
            color: color,
            marginBottom: '0.5rem'
          }}>
            {score.toFixed(1)}/10
          </div>
          <div style={{
            fontSize: '1.25rem',
            color: '#6b7280',
            marginBottom: '1rem'
          }}>
            {correctCount} sur {questions.length} bonnes réponses
          </div>
          <div style={{
            display: 'inline-block',
            background: color,
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontWeight: '600'
          }}>
            {score >= 7.5 ? '✓ Réussi' : score >= 6 ? '◐ À améliorer' : '✗ À revoir'}
          </div>
        </div>

        <div className="content-panel" style={{ marginBottom: '2rem', overflowX: 'auto' }}>
          <h2 style={{ color: '#1f2937', marginTop: 0, marginBottom: '1.5rem' }}>
            📋 Détails des réponses
          </h2>
          
          {results?.details?.map((detail, index) => {
            const isCorrect = detail.is_correct;
            const studentAnswerKey = `option_${detail.student_answer}`;
            const correctAnswerKey = `option_${detail.correct_answer}`;
            
            return (
              <div 
                key={detail.question_id}
                style={{
                  marginBottom: '1.5rem',
                  paddingBottom: '1.5rem',
                  borderBottom: index !== (results.details.length - 1) ? '1px solid #e5e7eb' : 'none'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  marginBottom: '0.75rem',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    background: isCorrect ? '#22c55e' : '#ef4444',
                    color: 'white',
                    fontWeight: '700',
                    flexShrink: 0
                  }}>
                    {isCorrect ? '✓' : '✗'}
                  </div>
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#111827', fontWeight: '600' }}>
                      Q{index + 1}: {detail.text}
                    </p>
                    <p style={{
                      margin: '0 0 0.5rem 0',
                      color: isCorrect ? '#22c55e' : '#ef4444'
                    }}>
                      <strong>Votre réponse:</strong> {detail[studentAnswerKey]}
                    </p>
                    {!isCorrect && (
                      <p style={{ margin: '0 0 0.5rem 0', color: '#22c55e' }}>
                        <strong>Bonne réponse:</strong> {detail[correctAnswerKey]}
                      </p>
                    )}
                    {detail.explanation && (
                      <p style={{
                        margin: '0.5rem 0 0 0',
                        padding: '0.75rem',
                        background: '#f3f4f6',
                        borderRadius: '0.5rem',
                        color: '#4b5563',
                        fontSize: '0.9rem',
                        borderLeft: `3px solid ${color}`
                      }}>
                        💡 <strong>Explication:</strong> {detail.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
          border: `2px solid ${color}`,
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: color, marginTop: 0, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            👨‍🏫 Conseil de votre professeur
          </h2>
          <h3 style={{ margin: '0 0 1rem 0', color: '#1f2937', fontSize: '1.1rem' }}>{adviceTitle}</h3>
          <p style={{
            margin: 0,
            color: '#4b5563',
            fontSize: '1rem',
            lineHeight: '1.6'
          }}>
            {advice}
          </p>
          {results?.saved && (
            <p style={{
              marginTop: '1rem',
              color: '#065f46',
              fontSize: '0.95rem',
              fontWeight: '600'
            }}>
              ✅ Votre note a bien été enregistrée dans votre tableau de bord Score.
            </p>
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button className="btn btn-secondary" onClick={() => setSelectedLesson(null)}>
            ← Autre leçon
          </button>
          
          <button className="btn btn-primary" onClick={() => {
              setCurrentQuestionIndex(0);
              setAnswers({});
              setShowResults(false);
              setResults(null);
            }}
          >
            🔄 Refaire le quiz
          </button>

          <button className="btn btn-secondary" onClick={() => navigate('/cours')}>
            📚 Retour aux cours
          </button>
        </div>
      </div>
    </section>
  );}

export default LessonQuiz;
