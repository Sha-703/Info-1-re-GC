function Apropos() {
  const logoImage = new URL('../../logoapp.png', import.meta.url).href;

  return (
    <section className="page">
      <div className="apropos-container">
        <div className="apropos-header">
          <div>
            <h1>À propos</h1>
          </div>
          <img src={logoImage} alt="Logo Info 1ère GC" className="apropos-logo" />
        </div>
        
        <div className="apropos-content">
          <p>
            Notre application web éducative a été conçue dans le cadre d'un projet tutoré de fin d'études en Licence d'informatique de gestion. Elle vise à accompagner les élèves de 1ère commerciale en leur offrant un accès simple, interactif et moderne aux contenus pédagogiques essentiels.
          </p>

          <p>
            Développée par des étudiants de l'Institut Supérieur Pédagogique de Mbanza-Ngungu, cette plateforme a pour objectif de faciliter l'apprentissage, renforcer la compréhension des notions clés et promouvoir l'utilisation du numérique dans l'éducation.
          </p>

          <h2>L'équipe derrière le projet</h2>
          <p>Ce projet est le fruit du travail et de la collaboration de :</p>
          
          <ul className="team-list">
            <li>LESA ZIKENGI Nana</li>
            <li>LUZOLO LUANZAMBI Sacré</li>
            <li>LUBONDO LUWIZANA Laeticia</li>
          </ul>

          <h2>Encadrement et conception</h2>
          <p>Ce projet a été réalisé sous l'encadrement de :</p>
          <ul className="team-list">
            <li>Assitant Jean NGUNDA - Encadreur</li>
            <li>NTEMO SIVI PASCAL - Concepteur Programmeur</li>
          </ul>

          <h2>Notre mission</h2>
          <p>
            À travers cette initiative, nous contribuons à l'amélioration de l'enseignement en mettant la technologie au service des apprenants.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Apropos;
