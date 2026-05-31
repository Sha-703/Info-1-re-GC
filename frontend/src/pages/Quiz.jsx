import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';

function Quiz() {
  const [searchParams] = useSearchParams();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    api.get('/quizzes/')
      .then((response) => {
        setQuizzes(response.data);
        const chapterId = searchParams.get('chapter');
        if (chapterId && response.data.length > 0) {
          const quiz = response.data.find(q => q.id === parseInt(chapterId)) || response.data[0];
          setSelectedQuiz(quiz);
        }
      })
      .catch(() => setQuizzes([]))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleSelectQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswerSelect = (answerId) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: answerId
    });
  };

  const handleNextQuestion = () => {
    if (answers[currentQuestionIndex] === undefined) {
      return;
    }
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    selectedQuiz.questions.forEach((question, index) => {
      const selectedAnswerId = answers[index];
      const correctAnswer = question.answers.find(a => a.is_correct);
      if (correctAnswer && selectedAnswerId === correctAnswer.id) {
        correctCount++;
      }
    });
    const finalScore = (correctCount / selectedQuiz.questions.length) * 10;
    setScore(finalScore);
    setShowResults(true);

    if (selectedQuiz.id) {
      api.post('/results/', {
        quiz: selectedQuiz.id,
        score: finalScore,
        answers: answers
      }).catch(err => console.log('Error saving score:', err));
    }
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (loading) {
    return (
      <section className="page">
        <div className="content-panel" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', color: '#1f2937' }}>Chargement des quiz...</p>
        </div>
      </section>
    );
  }

  if (!selectedQuiz) {
    return (
      <section className="page">
        <div className="courses-header">
          <h1>🎯 Quiz Interactifs</h1>
          <p>Testez vos connaissances avec nos quiz professionnels</p>
        </div>

        {quizzes.length === 0 ? (
          <div className="content-panel" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Aucun quiz disponible pour l'instant.</p>
          </div>
        ) : (
          <div className="list-grid">
            {quizzes.map((quiz) => (
              <article key={quiz.id} className="card card--clickable" style={{ borderTop: '4px solid #2563eb' }}>
                <div style={{ color: '#2563eb', fontSize: '2rem', marginBottom: '1rem' }}>📝</div>
                <h2 style={{ color: '#1f2937' }}>{quiz.title}</h2>
                <p>{quiz.description}</p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#6b7280' }}>
                  <span>📊 {quiz.questions?.length || 0} questions</span>
                </div>
                <button className="btn btn-primary button-full" onClick={() => handleSelectQuiz(quiz)}>
                  Commencer le quiz
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    );
  }

  if (showResults) {
    let correctCount = 0;
    selectedQuiz.questions.forEach((question, index) => {
      const selectedAnswerId = answers[index];
      const correctAnswer = question.answers.find(a => a.is_correct);
      if (selectedAnswerId === correctAnswer.id) {
        correctCount++;
      }
    });

    const getScoreColor = () => {
      if (score >= 8) return '#22c55e';
      if (score >= 6) return '#f59e0b';
      return '#ef4444';
    };

    const getScoreMessage = () => {
      if (score >= 9) return 'Excellent ! 🌟';
      if (score >= 7) return 'Très bien ! 👏';
      if (score >= 5) return 'Pas mal ! 📈';
      return 'À revoir 📚';
    };

    return (
      <section className="page">
        <div className="page-section page-section--narrow" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h1 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>Quiz terminé !</h1>
          
          <div style={{
            background: `${getScoreColor()}20`,
            borderRadius: '1rem',
            padding: '2rem',
            margin: '2rem 0',
            border: `2px solid ${getScoreColor()}`
          }}>
            <div style={{
              fontSize: '3.5rem',
              fontWeight: '700',
              color: getScoreColor(),
              marginBottom: '0.5rem'
            }}>
              {score.toFixed(1)}/10
            </div>
            <p style={{ fontSize: '1.2rem', color: getScoreColor(), fontWeight: '600', margin: 0 }}>
              {getScoreMessage()}
            </p>
          </div>

          <div className="summary-grid" style={{ margin: '0' }}>
            <div className="metric-card">
              <h3 style={{ color: '#22c55e' }}>{correctCount}</h3>
              <p>Correctes</p>
            </div>
            <div className="metric-card" style={{ background: '#fee2e2' }}>
              <h3 style={{ color: '#ef4444' }}>{selectedQuiz.questions.length - correctCount}</h3>
              <p>Incorrectes</p>
            </div>
            <div className="metric-card" style={{ background: '#dbeafe' }}>
              <h3 style={{ color: '#2563eb' }}>{selectedQuiz.questions.length}</h3>
              <p>Questions</p>
            </div>
          </div>

          <button className="btn btn-primary button-full" onClick={handleBackToQuizzes} style={{ marginTop: '1.5rem' }}>
            Retour aux quiz
          </button>
        </div>
      </section>
    );
  }

  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
  const totalQuestions = selectedQuiz.questions.length;
  const progressPercent = (currentQuestionIndex + 1) / totalQuestions * 100;

  return (
    <section className="page">
      <div className="page-section page-section--narrow">
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <h1 style={{ margin: 0, color: '#1f2937' }}>{selectedQuiz.title}</h1>
            <button className="btn btn-secondary" onClick={handleBackToQuizzes}>
              ← Retour
            </button>
          </div>

          <div className="progress-track" style={{ marginBottom: '0.5rem' }}>
            <div className="progress-bar" style={{ width: `${progressPercent}%` }} />
          </div>
          <p style={{ margin: '0.5rem 0 0', color: '#6b7280', fontSize: '0.95rem' }}>
            Question {currentQuestionIndex + 1} / {totalQuestions}
          </p>
        </div>

        <div className="quiz-card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#1f2937', marginBottom: '1.5rem', fontSize: '1.4rem', fontWeight: '600' }}>
            {currentQuestion.text}
          </h2>

          <div className="quiz-options">
            {currentQuestion.answers.map((answer) => {
              const isSelected = answers[currentQuestionIndex] === answer.id;
              return (
                <button
                  key={answer.id}
                  onClick={() => handleAnswerSelect(answer.id)}
                  className={`quiz-option ${isSelected ? 'selected' : ''}`}
                >
                  <span>{answer.text}</span>
                </button>
              );
            })}
          </div>
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

          {currentQuestionIndex === totalQuestions - 1 ? (
            <button
              onClick={calculateScore}
              disabled={answers[currentQuestionIndex] === undefined}
              className="btn btn-primary"
              style={{ width: 'calc(50% - 0.5rem)', minWidth: '140px' }}
            >
              ✓ Terminer le quiz
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              disabled={answers[currentQuestionIndex] === undefined}
              className="btn btn-primary"
              style={{ width: 'calc(50% - 0.5rem)', minWidth: '140px' }}
            >
              Suivant →
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default Quiz;
