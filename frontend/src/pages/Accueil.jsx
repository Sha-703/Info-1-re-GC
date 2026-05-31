import { Link } from 'react-router-dom';

const backgroundImage = new URL('../../fond11.png', import.meta.url).href;

function Accueil() {
  return (
    <section
      className="page accueil-page"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="page-overlay">
        <div className="animated-text-container">
          <h1 className="animated-title">Bienvenue sur l'application éducative</h1>
          <p className="animated-subtitle">La plateforme moderne pour l'apprentissage numérique</p>
        </div>
        <div className="card-grid-centered">
          <Link to="/cours" className="card">
            <div className="card-icon">📚</div>
            <h2>Cours</h2>
            <p>Consultez les leçons disponibles pour la première commerciale de gestion.</p>
          </Link>

          <Link to="/lesson-quiz" className="card">
            <div className="card-icon">📝</div>
            <h2>Quiz Leçons</h2>
            <p>Testez vos connaissances leçon par leçon avec des quiz professionnels.</p>
          </Link>
        </div>
        <p className="accueil-slogan">Apprendre aujourd'hui réussir demain !</p>
      </div>
    </section>
  );
}

export default Accueil;
