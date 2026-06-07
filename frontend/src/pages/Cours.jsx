import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { API_BASE_URL } from '../services/api';

function Cours() {
  const chapters = [3, 4, 1, 2, 5, 6];
  const [modalLesson, setModalLesson] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [activeSection, setActiveSection] = useState('content');
  const [lessonDetails, setLessonDetails] = useState({});
  const [lessonOrderMap, setLessonOrderMap] = useState({});
  const [lessonsLoaded, setLessonsLoaded] = useState(false);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await api.get('/lessons/');
        const map = {};
        response.data.forEach((lesson) => {
          if (lesson.order != null) {
            map[lesson.order] = lesson.id;
          }
        });
        setLessonOrderMap(map);
        console.log('Loaded lesson order map:', map);
      } catch (error) {
        console.error('Erreur lors du chargement des leçons pour la carte de correspondance :', error);
      } finally {
        setLessonsLoaded(true);
      }
    };

    fetchLessons();
  }, []);

  const resolveLessonId = (lessonNumber) => {
    const resolved = lessonOrderMap[lessonNumber];
    if (!resolved) {
      console.warn('Lesson order mapping missing for lessonNumber:', lessonNumber, 'map:', lessonOrderMap);
      return null;
    }
    return resolved;
  };

  const fetchLessonDetail = async (lessonId) => {
    if (!lessonId || lessonDetails[lessonId]) return;
    try {
      setLoadingLesson(true);
      const response = await api.get(`/lessons/${lessonId}/`);
      console.log('Lesson details loaded:', { lessonId, videos: response.data?.videos });
      setLessonDetails((prev) => ({ ...prev, [lessonId]: response.data }));
    } catch (error) {
      console.error('Erreur lors du chargement de la leçon :', error);
    } finally {
      setLoadingLesson(false);
    }
  };

  const openLessonModal = (content, lessonNumber, number) => {
    setModalLesson(content);
    setCurrentChapter(number);
    setActiveSection('content');
    console.log('Opening lesson modal', { lessonNumber });
    fetchLessonDetail(lessonNumber);
  };

  const apiRootUrl = API_BASE_URL.replace(/\/api\/?$/, '');

  const getVideoUrl = (videoUrl) => {
    if (!videoUrl) return '';
    // Si l'URL est déjà absolue (commence par http), retourner telle quelle
    if (videoUrl.startsWith('http')) return videoUrl;
    // Sinon, construire l'URL absolue en utilisant l'URL de base du backend
    return `${apiRootUrl}${videoUrl}`;
  };

  const isYouTube = (url) => {
    if (!url) return false;
    const youtubePatterns = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)/i;
    return youtubePatterns.test(url);
  };

  const toYouTubeEmbed = (url) => {
    if (!url) return '';
    try {
      // Si déjà embed
      if (url.includes('youtube.com/embed/')) return url;
      // youtu.be short link
      const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
      if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
      // standard watch?v= link
      const vMatch = url.match(/[?&]v=([^&]+)/);
      if (vMatch) return `https://www.youtube.com/embed/${vMatch[1]}`;
      // youtube.com/v/ format
      const vMatch2 = url.match(/\/v\/([^?&]+)/);
      if (vMatch2) return `https://www.youtube.com/embed/${vMatch2[1]}`;
      return url;
    } catch (e) {
      console.warn('Error converting YouTube URL:', url, e);
      return url;
    }
  };

  const getIconAndColor = (number) => {
    const icons = {
      1: { icon: '🔌', color: '#2563eb', lightBg: 'rgba(37, 99, 235, 0.1)' },
      2: { icon: '🔗', color: '#7c3aed', lightBg: 'rgba(124, 58, 237, 0.1)' },
      3: { icon: '💡', color: '#22c55e', lightBg: 'rgba(34, 197, 94, 0.1)' },
      4: { icon: '🖥️', color: '#f59e0b', lightBg: 'rgba(245, 158, 11, 0.1)' },
      5: { icon: '🧠', color: '#ef4444', lightBg: 'rgba(239, 68, 68, 0.1)' },
      6: { icon: '🔐', color: '#06b6d4', lightBg: 'rgba(6, 182, 212, 0.1)' }
    };
    return icons[number] || { icon: '📚', color: '#6366f1', lightBg: 'rgba(99, 102, 241, 0.1)' };
  };

  const getChapterContent = (number) => {
    switch (number) {
      case 1:
        return {
          title: "Chapitre 1: Le Bus",
          shortTitle: "Le Bus",
          description: "Découvrez les concepts fondamentaux du bus dans l'informatique.",
          lesson: "/nouveaubus.pdf",
          fullContent: (
            <div style={{ color: '#111827' }}>
              <h2 style={{ color: '#2563eb', fontSize: '1.8rem', marginBottom: '1rem', borderBottom: '2px solid #2563eb', paddingBottom: '0.5rem' }}>🔌 Le Bus en Informatique</h2>
              <h3 style={{ color: '#1f2937', fontSize: '1.3rem', marginTop: '1.5rem', marginBottom: '0.8rem' }}>1. Définition du bus</h3>
              <p>Le bus est un ensemble de lignes de communication qui permettent aux différentes parties de l'ordinateur d'échanger des informations.</p>
              <p><strong>Les composants de l'ordinateur qui utilisent le bus pour communiquer sont :</strong></p>
              <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.5rem' }}><span style={{ position: 'absolute', left: '0', color: '#2563eb', fontWeight: 'bold' }}>•</span>le processeur</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.5rem' }}><span style={{ position: 'absolute', left: '0', color: '#2563eb', fontWeight: 'bold' }}>•</span>la mémoire</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.5rem' }}><span style={{ position: 'absolute', left: '0', color: '#2563eb', fontWeight: 'bold' }}>•</span>les périphériques</li>
              </ul>
              <p style={{ marginTop: '1rem' }}><strong>Le bus relie :</strong></p>
              <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.5rem' }}><span style={{ position: 'absolute', left: '0', color: '#2563eb', fontWeight: 'bold' }}>→</span><strong>Le processeur :</strong> traite les informations.</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.5rem' }}><span style={{ position: 'absolute', left: '0', color: '#2563eb', fontWeight: 'bold' }}>→</span><strong>La mémoire :</strong> stocke les données.</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.5rem' }}><span style={{ position: 'absolute', left: '0', color: '#2563eb', fontWeight: 'bold' }}>→</span><strong>Les périphériques :</strong> permettent l'entrée et la sortie des informations.</li>
              </ul>
              <div style={{ background: '#ede6ff', padding: '1rem', borderRadius: '0.75rem', marginTop: '1rem', borderLeft: '4px solid #7c3aed' }}>
                <p style={{ marginTop: '0', fontStyle: 'italic', fontWeight: 'bold', color: '#7c3aed' }}>"Le bus transporte les informations entre ces éléments"</p>
              </div>
              <h3 style={{ color: '#1f2937', fontSize: '1.3rem', marginTop: '1.5rem', marginBottom: '0.8rem' }}>2. Les caractéristiques d'un bus</h3>
              <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem' }}><span style={{ position: 'absolute', left: '0', color: '#2563eb', fontWeight: 'bold' }}>▪</span><strong>Largeur :</strong> c'est le nombre de bits qu'il peut transporter à la fois.</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem' }}><span style={{ position: 'absolute', left: '0', color: '#2563eb', fontWeight: 'bold' }}>▪</span><strong>Fréquence :</strong> c'est la vitesse de transmission des données.</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem' }}><span style={{ position: 'absolute', left: '0', color: '#2563eb', fontWeight: 'bold' }}>▪</span><strong>Débit :</strong> c'est la quantité des données qu'il peut transporter à la fois.</li>
              </ul>
              <h3 style={{ color: '#1f2937', fontSize: '1.3rem', marginTop: '1.5rem', marginBottom: '0.8rem' }}>3. Il existe deux principaux bus en informatique :</h3>
              <h4 style={{ color: '#2563eb', fontSize: '1.1rem', marginBottom: '0.5rem' }}>1️⃣ Le bus système :</h4>
              <p>c'est le bus qui relie les composants principaux de l'ordinateur.</p>
              <p><strong>Exemple :</strong> le processeur, la mémoire, les unités internes.</p>
              <p><strong>Le bus système est composé de :</strong></p>
              <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.5rem' }}><span style={{ position: 'absolute', left: '0', color: '#2563eb' }}>✓</span>bus de données ;</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.5rem' }}><span style={{ position: 'absolute', left: '0', color: '#2563eb' }}>✓</span>bus d'adresses ;</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.5rem' }}><span style={{ position: 'absolute', left: '0', color: '#2563eb' }}>✓</span>bus de contrôle.</li>
              </ul>
              <h4 style={{ color: '#2563eb', fontSize: '1.1rem', marginTop: '1rem', marginBottom: '0.5rem' }}>2️⃣ Le bus d'extension :</h4>
              <p>c'est le bus qui relie des périphériques ou des cartes supplémentaires à la carte mère.</p>
              <p><strong>Exemples :</strong></p>
              <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.5rem' }}><span style={{ position: 'absolute', left: '0', color: '#2563eb' }}>✓</span>carte graphique ;</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.5rem' }}><span style={{ position: 'absolute', left: '0', color: '#2563eb' }}>✓</span>carte son ;</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.5rem' }}><span style={{ position: 'absolute', left: '0', color: '#2563eb' }}>✓</span>imprimante ;</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.5rem' }}><span style={{ position: 'absolute', left: '0', color: '#2563eb' }}>✓</span>disque dur.</li>
              </ul>
              <p style={{ marginTop: '1rem' }}><strong>Exemples de bus d'extension :</strong></p>
              <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.5rem' }}><span style={{ position: 'absolute', left: '0', color: '#2563eb' }}>◆</span>USB ;</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.5rem' }}><span style={{ position: 'absolute', left: '0', color: '#2563eb' }}>◆</span>PCI Express ;</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative' }}><span style={{ position: 'absolute', left: '0', color: '#2563eb' }}>◆</span>SATA.</li>
              </ul>
            </div>
          )
        };
      case 2:
        return {
          title: "Chapitre 2: Les Ports",
          shortTitle: "Les Ports",
          description: "Apprenez tout sur les ports informatiques et leur utilisation.",
          lesson: "/nouveauport.pdf",
          fullContent: (
            <div style={{ color: '#111827' }}>
              <h2 style={{ color: '#7c3aed', fontSize: '1.8rem', marginBottom: '1rem', borderBottom: '2px solid #7c3aed', paddingBottom: '0.5rem' }}>🔗 Les Ports en Informatique</h2>
              <h3 style={{ color: '#1f2937', fontSize: '1.3rem', marginTop: '1.5rem', marginBottom: '0.8rem' }}>1. Définition du port</h3>
              <p>Un port est un point de connexion sur l'ordinateur qui permet de relier des périphériques ou des composants internes.</p>
              <p><strong>Rôle du port :</strong> le port sert donc à échanger des données ou de l'énergie entre l'ordinateur et d'autres équipements.</p>
              <h3 style={{ color: '#1f2937', fontSize: '1.3rem', marginTop: '1.5rem', marginBottom: '0.8rem' }}>2. Les types de ports</h3>
              <h4 style={{ color: '#7c3aed', fontSize: '1.1rem', marginBottom: '0.5rem' }}>2.1 Ports internes</h4>
              <p><strong>Définition :</strong></p>
              <p>ce sont les ports à l'intérieur de l'unité centrale, utilisés pour connecter les composants internes.</p>
              <p style={{ marginTop: '1rem' }}><strong>Quelques ports internes :</strong></p>
              <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem', background: 'rgba(124, 58, 237, 0.05)', padding: '0.75rem', borderRadius: '0.5rem' }}><span style={{ position: 'absolute', left: '0.5rem', color: '#7c3aed' }}>⚡</span><strong>port SATA :</strong> pour les disques durs et lecteur CD/DVD</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem', background: 'rgba(124, 58, 237, 0.05)', padding: '0.75rem', borderRadius: '0.5rem' }}><span style={{ position: 'absolute', left: '0.5rem', color: '#7c3aed' }}>⚡</span><strong>port PCI :</strong> pour les cartes son, graphique, etc.</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem', background: 'rgba(124, 58, 237, 0.05)', padding: '0.75rem', borderRadius: '0.5rem' }}><span style={{ position: 'absolute', left: '0.5rem', color: '#7c3aed' }}>⚡</span><strong>port RAM (slot mémoire) :</strong> pour insérer la mémoire vive.</li>
              </ul>
              <h4 style={{ color: '#7c3aed', fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>2.2 Ports Externes</h4>
              <p><strong>Définition :</strong></p>
              <p>Ce sont les ports visibles à l'extérieur de l'unité centrale.</p>
              <p>Ils permettent de brancher des périphériques.</p>
              <p style={{ marginTop: '1rem' }}><strong>Quelques ports Externes :</strong></p>
              <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem', background: 'rgba(124, 58, 237, 0.05)', padding: '0.75rem', borderRadius: '0.5rem' }}><span style={{ position: 'absolute', left: '0.5rem', color: '#7c3aed' }}>🔌</span><strong>port USB :</strong> pour les périphériques</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem', background: 'rgba(124, 58, 237, 0.05)', padding: '0.75rem', borderRadius: '0.5rem' }}><span style={{ position: 'absolute', left: '0.5rem', color: '#7c3aed' }}>🔌</span><strong>port HDMI/VGA :</strong> pour l'écran, ou projecteur.</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem', background: 'rgba(124, 58, 237, 0.05)', padding: '0.75rem', borderRadius: '0.5rem' }}><span style={{ position: 'absolute', left: '0.5rem', color: '#7c3aed' }}>🔌</span><strong>port Ethernet :</strong> pour le câble réseau (internet).</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem', background: 'rgba(124, 58, 237, 0.05)', padding: '0.75rem', borderRadius: '0.5rem' }}><span style={{ position: 'absolute', left: '0.5rem', color: '#7c3aed' }}>🔌</span><strong>port audio :</strong> pour les écouteurs, micro, haut-parleurs.</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem', background: 'rgba(124, 58, 237, 0.05)', padding: '0.75rem', borderRadius: '0.5rem' }}><span style={{ position: 'absolute', left: '0.5rem', color: '#7c3aed' }}>🔌</span><strong>port d'alimentation :</strong> pour brancher l'ordinateur au courant.</li>
              </ul>
            </div>
          )
        };
      case 3:
        return {
          title: "Chapitre 3: Notions sur l'informatique",
          shortTitle: "Notions Informatique",
          description: "Comprenez l'origine, la définition, et l'importance de l'informatique.",
          lesson: "/notions-sur-informatique.pdf",
          fullContent: (
            <div style={{ color: '#111827' }}>
              <h2 style={{ color: '#22c55e', fontSize: '1.8rem', marginBottom: '1rem', borderBottom: '2px solid #22c55e', paddingBottom: '0.5rem' }}>💡 Notions sur l'Informatique</h2>
              <p>Aujourd’hui, l’informatique est utilisée partout : dans les écoles, les banques, les entreprises, les hôpitaux et même dans les téléphones portables.</p>
              <p>Elle permet de traiter rapidement les informations grâce à l’ordinateur.</p>
              <h3 style={{ color: '#1f2937', fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.8rem' }}>I. Origine du mot informatique</h3>
              <p>Le mot informatique vient de deux mots :</p>
              <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.5rem' }}><span style={{ position: 'absolute', left: '0', color: '#22c55e', fontWeight: 'bold' }}>•</span>Information</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.5rem' }}><span style={{ position: 'absolute', left: '0', color: '#22c55e', fontWeight: 'bold' }}>•</span>Automatique</li>
              </ul>
              <p><strong>Donc :</strong> Informatique = traitement automatique de l’information.</p>
              <h3 style={{ color: '#1f2937', fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.8rem' }}>II. Définition de l'informatique</h3>
              <p>L’informatique est la science qui permet de traiter automatiquement les informations à l’aide d’un ordinateur.</p>
              <h3 style={{ color: '#1f2937', fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.8rem' }}>III. Quelques termes informatiques</h3>
              <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem' }}><span style={{ position: 'absolute', left: '0', color: '#22c55e', fontWeight: 'bold' }}>•</span><strong>Information :</strong> un renseignement ou un message.</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem' }}><span style={{ position: 'absolute', left: '0', color: '#22c55e', fontWeight: 'bold' }}>•</span><strong>Donnée :</strong> une information enregistrée dans l’ordinateur.</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem' }}><span style={{ position: 'absolute', left: '0', color: '#22c55e', fontWeight: 'bold' }}>•</span><strong>Automatique :</strong> qui fonctionne seul avec l’aide d’une machine.</li>
              </ul>
              <h4 style={{ color: '#22c55e', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Exemples :</h4>
              <p>Le nom d’un élève, une note, une adresse, une photo, un document Word, un numéro de téléphone.</p>
              <h3 style={{ color: '#1f2937', fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.8rem' }}>IV. Importance de l'informatique</h3>
              <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem' }}><span style={{ position: 'absolute', left: '0', color: '#22c55e', fontWeight: 'bold' }}>✓</span>Dans l’éducation : recherche d’informations, préparation des travaux, apprentissage.</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem' }}><span style={{ position: 'absolute', left: '0', color: '#22c55e', fontWeight: 'bold' }}>✓</span>Dans les entreprises : gestion des clients, comptabilité, communication.</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem' }}><span style={{ position: 'absolute', left: '0', color: '#22c55e', fontWeight: 'bold' }}>✓</span>Dans les banques : retrait d’argent, envoi d’argent, conservation des informations.</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem' }}><span style={{ position: 'absolute', left: '0', color: '#22c55e', fontWeight: 'bold' }}>✓</span>Dans la communication : WhatsApp, Facebook, e-mails.</li>
              </ul>
              <h3 style={{ color: '#1f2937', fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.8rem' }}>V. Avantages de l'informatique</h3>
              <p>Elle permet de gagner du temps, conserver les données, communiquer rapidement et faire des calculs rapidement.</p>
              <h3 style={{ color: '#1f2937', fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.8rem' }}>VI. Inconvénients de l'informatique</h3>
              <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem' }}><span style={{ position: 'absolute', left: '0', color: '#22c55e', fontWeight: 'bold' }}>•</span>piratage</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem' }}><span style={{ position: 'absolute', left: '0', color: '#22c55e', fontWeight: 'bold' }}>•</span>perte des données</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem' }}><span style={{ position: 'absolute', left: '0', color: '#22c55e', fontWeight: 'bold' }}>•</span>dépendance à Internet</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem' }}><span style={{ position: 'absolute', left: '0', color: '#22c55e', fontWeight: 'bold' }}>•</span>virus informatiques</li>
              </ul>
              <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '0.75rem', marginTop: '1rem', borderLeft: '4px solid #22c55e' }}>
                <p style={{ margin: '0', fontWeight: '700' }}>Conclusion : L’informatique est une science très importante dans la vie moderne. Elle facilite le travail dans plusieurs domaines grâce à l’ordinateur et aux nouvelles technologies.</p>
              </div>
            </div>
          )
        };
      case 4:
        return {
          title: "Chapitre 4: L'ordinateur et ses parties",
          shortTitle: "Ordinateur & Parties",
          description: "Étudiez les composants et périphériques principaux de l’ordinateur.",
          lesson: "/ordinateur-et-ses-parties.pdf",
          fullContent: (
            <div style={{ color: '#111827' }}>
              <h2 style={{ color: '#f59e0b', fontSize: '1.8rem', marginBottom: '1rem', borderBottom: '2px solid #f59e0b', paddingBottom: '0.5rem' }}>🖥️ L’Ordinateur et ses Parties</h2>
              <p>L’ordinateur est un appareil électronique utilisé dans plusieurs domaines : écoles, banques, commerces, entreprises et maisons. Il permet de traiter les informations rapidement.</p>
              <h3 style={{ color: '#1f2937', fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.8rem' }}>I. Définition de l’ordinateur</h3>
              <p>Un ordinateur est une machine électronique capable de recevoir, traiter, conserver et afficher les informations.</p>
              <h3 style={{ color: '#1f2937', fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.8rem' }}>II. Les parties principales de l’ordinateur</h3>
              <p>L’ordinateur possède deux grandes parties :</p>
              <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem' }}><span style={{ position: 'absolute', left: '0', color: '#f59e0b', fontWeight: 'bold' }}>•</span><strong>Le Hardware :</strong> parties physiques qu’on peut toucher.</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem' }}><span style={{ position: 'absolute', left: '0', color: '#f59e0b', fontWeight: 'bold' }}>•</span><strong>Le Software :</strong> programmes ou logiciels utilisés dans l’ordinateur.</li>
              </ul>
              <p><strong>Exemples de Hardware :</strong> écran, clavier, souris, unité centrale.</p>
              <p><strong>Exemples de Software :</strong> Windows, Word, Excel, Paint.</p>
              <h3 style={{ color: '#1f2937', fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.8rem' }}>III. Les périphériques</h3>
              <p>Les périphériques sont des appareils reliés à l’ordinateur.</p>
              <h4 style={{ color: '#f59e0b', fontSize: '1.1rem', marginBottom: '0.5rem' }}>1. Les périphériques d’entrée</h4>
              <p>Ils servent à introduire les informations dans l’ordinateur.</p>
              <p>Exemples : clavier, souris, scanner, microphone.</p>
              <h4 style={{ color: '#f59e0b', fontSize: '1.1rem', marginBottom: '0.5rem' }}>2. Les périphériques de sortie</h4>
              <p>Ils servent à faire sortir les informations.</p>
              <p>Exemples : écran, imprimante, haut-parleur.</p>
              <h4 style={{ color: '#f59e0b', fontSize: '1.1rem', marginBottom: '0.5rem' }}>3. Les périphériques de stockage</h4>
              <p>Ils servent à conserver les informations.</p>
              <p>Exemples : clé USB, disque dur, carte mémoire, CD.</p>
              <h3 style={{ color: '#1f2937', fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.8rem' }}>IV. Description de quelques parties</h3>
              <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem' }}><span style={{ position: 'absolute', left: '0', color: '#f59e0b', fontWeight: 'bold' }}>✓</span><strong>Le clavier :</strong> périphérique d’entrée utilisé pour écrire.</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem' }}><span style={{ position: 'absolute', left: '0', color: '#f59e0b', fontWeight: 'bold' }}>✓</span><strong>La souris :</strong> périphérique pour déplacer le pointeur, cliquer et glisser.</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem' }}><span style={{ position: 'absolute', left: '0', color: '#f59e0b', fontWeight: 'bold' }}>✓</span><strong>L’écran :</strong> affiche les informations.</li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative', marginBottom: '0.8rem' }}><span style={{ position: 'absolute', left: '0', color: '#f59e0b', fontWeight: 'bold' }}>✓</span><strong>L’imprimante :</strong> imprime les documents sur papier.</li>
              </ul>
              <h3 style={{ color: '#1f2937', fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.8rem' }}>V. Importance de l’ordinateur</h3>
              <p>L’ordinateur permet d’écrire des documents, de faire des calculs, d’apprendre, de communiquer et de conserver des données.</p>
              <h3 style={{ color: '#1f2937', fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.8rem' }}>VI. Avantages de l’ordinateur</h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                <li>rapidité</li>
                <li>précision</li>
                <li>grande capacité de stockage</li>
                <li>facilité de communication</li>
              </ul>
              <h3 style={{ color: '#1f2937', fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.8rem' }}>VII. Inconvénients de l’ordinateur</h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                <li>panne</li>
                <li>virus</li>
                <li>dépendance</li>
                <li>fatigue des yeux</li>
              </ul>
              <div style={{ background: '#ffedd5', padding: '1rem', borderRadius: '0.75rem', marginTop: '1rem', borderLeft: '4px solid #f59e0b' }}>
                <p style={{ margin: '0', fontWeight: '700' }}>Conclusion : L’ordinateur est un outil très important dans la société moderne. Il aide l’homme dans plusieurs travaux grâce à ses différentes parties et périphériques.</p>
              </div>
            </div>
          )
        };
      case 5:
        return {
          title: "Chapitre 5: Générations d'ordinateurs",
          shortTitle: "Générations",
          description: "Comprenez les différentes générations d'ordinateurs et leur évolution.",
          lesson: "/generations-ordinateurs-1ere-commerciale.pdf",
          fullContent: (
            <div style={{ color: '#111827' }}>
              <h2 style={{ color: '#ef4444', fontSize: '1.8rem', marginBottom: '1rem', borderBottom: '2px solid #ef4444', paddingBottom: '0.5rem' }}>🧠 Générations d'ordinateurs</h2>
              <p>Découvrez comment les ordinateurs ont évolué au fil des générations, de l'ère des tubes électroniques aux systèmes modernes.</p>
              <p>Chaque génération a apporté des améliorations en vitesse, fiabilité et capacité de stockage.</p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                <li>1ère génération : tubes à vide</li>
                <li>2ème génération : transistors</li>
                <li>3ème génération : circuits intégrés</li>
                <li>4ème génération : microprocesseur</li>
              </ul>
              <p>Ces évolutions montrent l'importance des avancées techniques pour l'informatique moderne.</p>
            </div>
          )
        };
      case 6:
        return {
          title: "Chapitre 6: Mémoire informatique",
          shortTitle: "Mémoire",
          description: "Apprenez les bases de la mémoire en informatique.",
          lesson: "/memoire-informatique.pdf",
          fullContent: (
            <div style={{ color: '#111827' }}>
              <h2 style={{ color: '#06b6d4', fontSize: '1.8rem', marginBottom: '1rem', borderBottom: '2px solid #06b6d4', paddingBottom: '0.5rem' }}>🔐 Mémoire informatique</h2>
              <p>La mémoire est l'un des éléments clés de l'ordinateur, elle stocke les données et les programmes utilisés par le système.</p>
              <p>Il existe plusieurs types de mémoire, comme la mémoire vive (RAM) et la mémoire permanente (ROM).</p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                <li>RAM : mémoire temporaire et rapide.</li>
                <li>ROM : mémoire permanente utilisée pour démarrer l'ordinateur.</li>
                <li>Mémoire de stockage : disques durs, SSD, clés USB.</li>
              </ul>
              <p>La bonne gestion de la mémoire est essentielle pour la performance et le fonctionnement de l'ordinateur.</p>
            </div>
          )
        };
      default:
        return {
          title: `Chapitre ${number}`,
          shortTitle: `Chapitre ${number}`,
          description: "Contenu à définir pour ce chapitre.",
          lesson: null,
          fullContent: null
        };
    }
  };

  return (
    <section className="page">
      <div className="courses-header">
        <h1>📚 Cours d'Informatique</h1>
        <p>Explorez nos leçons professionnelles et apprenez les concepts clés de l'informatique</p>
        <button
          onClick={() => navigate('/lesson-quiz')}
          style={{
            marginTop: '1rem',
            padding: '0.85rem 1.5rem',
            background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            cursor: 'pointer',
            fontWeight: '700'
          }}
        >
          🎯 Voir les Quiz par Leçon
        </button>
      </div>
      <div className="list-grid">
        {chapters.map((number) => {
          const content = getChapterContent(number);
          const { icon, color, lightBg } = getIconAndColor(number);
          return (
            <article key={number} className="card" style={{ borderTop: `4px solid ${color}` }}>
              <div className="card-icon" style={{ background: lightBg, color }}>
                {icon}
              </div>
              <h2 style={{ color }}>{content.shortTitle}</h2>
              <p className="card-description">{content.description}</p>
              {content.lesson && (
                <div className="card-buttons" style={{ gap: '0.75rem' }}>
                  <a href={content.lesson} download className="btn btn-download" style={{ borderColor: color, color }}>
                    📥 Télécharger
                  </a>
                  <button onClick={() => openLessonModal(content.fullContent, number, number)} className="btn btn-view" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` }}>
                    👁️ Voir le cours
                  </button>
                  <button onClick={() => navigate(`/lesson-quiz?lessonOrder=${number}`)} className="btn btn-quiz" style={{ background: `linear-gradient(135deg, #22c55e 0%, #16a34a 100%)` }}>
                    🎯 Quiz du chapitre
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
      {modalLesson && (
        <div className="lesson-modal-overlay" onClick={() => { setModalLesson(null); setCurrentChapter(null); }}>
          <div className="lesson-modal-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => { setModalLesson(null); setCurrentChapter(null); }} className="lesson-modal-close">
              ✕
            </button>

            <div className="lesson-modal-body">
              <aside className="lesson-modal-sidebar">
                <div>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Espace cours</p>
                  <h2 style={{ margin: '0.75rem 0 0 0', fontSize: '1.55rem', color: '#1f2937' }}>Contenu de la leçon</h2>
                </div>
                <button
                  onClick={() => setActiveSection('content')}
                  style={{
                    padding: '1rem 1.2rem',
                    textAlign: 'left',
                    border: '1px solid rgba(37, 99, 235, 0.16)',
                    borderRadius: '1rem',
                    background: activeSection === 'content' ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(59, 130, 246, 0.06))' : 'white',
                    color: '#111827',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: activeSection === 'content' ? '0 10px 24px rgba(37, 99, 235, 0.14)' : 'none'
                  }}
                >
                  📘 Contenu du cours
                </button>
                <button
                  onClick={() => setActiveSection('video')}
                  style={{
                    padding: '1rem 1.2rem',
                    textAlign: 'left',
                    border: '1px solid rgba(37, 99, 235, 0.16)',
                    borderRadius: '1rem',
                    background: activeSection === 'video' ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(59, 130, 246, 0.06))' : 'white',
                    color: '#111827',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: activeSection === 'video' ? '0 10px 24px rgba(37, 99, 235, 0.14)' : 'none'
                  }}
                >
                  🎥 Vidéos / Tutoriels
                </button>
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(148, 163, 184, 0.16)', color: '#475569' }}>
                  <p style={{ margin: 0, fontWeight: 700 }}>Chapitre {currentChapter}</p>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>Accédez au contenu pédagogique et à la vidéo de la leçon.</p>
                </div>
              </aside>

              <main className="lesson-modal-main">
                {activeSection === 'video' ? (
                  <div className="lesson-modal-video-section">
                    {loadingLesson ? (
                      <div style={{
                        padding: '4rem 3rem',
                        borderRadius: '1.25rem',
                        background: 'rgba(255, 255, 255, 0.8)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%'
                      }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>⏳</div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#2563eb', fontWeight: '700', fontSize: '1.25rem' }}>Chargement de la vidéo...</h3>
                      </div>
                    ) : lessonDetails[currentChapter] && lessonDetails[currentChapter].videos?.length > 0 ? (
                      <div style={{ display: 'grid', gap: '1.5rem', width: '100%' }}>
                        {lessonDetails[currentChapter].videos.map((video) => {
                          console.log('Rendering video:', { id: video.id, title: video.title, url: video.video_url, isYouTube: isYouTube(video.video_url) });
                          return (
                            <div key={video.id} style={{ borderRadius: '1.25rem', overflow: 'hidden', background: 'white', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)', maxWidth: '100%' }}>
                              {isYouTube(video.video_url) ? (
                                <iframe
                                  title={video.title}
                                  src={toYouTubeEmbed(video.video_url)}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="lesson-video-iframe"
                                  onError={() => console.error('YouTube iframe failed to load:', video.video_url)}
                                />
                              ) : video.video_url ? (
                                <video
                                  controls
                                  className="lesson-video-element"
                                  src={getVideoUrl(video.video_url)}
                                  onError={() => console.error('Video failed to load:', getVideoUrl(video.video_url))}
                                />
                              ) : (
                                <div style={{ padding: '2rem', textAlign: 'center', background: '#fee2e2' }}>
                                  <p style={{ color: '#991b1b', margin: 0 }}>⚠️ Pas d'URL vidéo fournie</p>
                                </div>
                              )}
                            <div style={{ padding: '1.75rem', textAlign: 'left' }}>
                              <h3 style={{ margin: '0 0 0.75rem 0', color: '#1f2937', fontSize: '1.35rem', fontWeight: '700' }}>{video.title}</h3>
                              <p style={{ margin: 0, color: '#6b7280', fontSize: '1rem', lineHeight: '1.6' }}>{video.description || 'Vidéo tutorielle intégrée depuis le backend.'}</p>
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%)',
                        borderRadius: '1.25rem',
                        padding: '4rem 3rem',
                        border: '2px dashed rgba(37, 99, 235, 0.3)',
                        minHeight: '300px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🎥</div>
                        <h3 style={{ margin: '0 0 0.75rem 0', color: '#2563eb', fontWeight: '700', fontSize: '1.5rem' }}>Zone Vidéo/Tutoriel</h3>
                        <p style={{ margin: '0', color: '#6b7280', fontSize: '1.05rem', maxWidth: '500px', lineHeight: '1.6' }}>Aucune vidéo disponible pour cette leçon. Ajoutez une vidéo depuis le backend pour l'intégrer ici.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="lesson-modal-content-section">
                    {modalLesson}
                  </div>
                )}

                <div className="lesson-modal-footer">
                  <div style={{ color: '#6b7280', fontSize: '1rem' }}>
                    <strong style={{ color: '#1f2937', fontSize: '1.1rem' }}>Chapitre {currentChapter}</strong> — Testez vos connaissances sur la page Quiz Leçon.
                  </div>
                  <button
                    onClick={() => navigate(`/lesson-quiz?lessonId=${currentChapter}`)}
                    style={{
                      padding: '0.85rem 1.75rem',
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    🎯 Accéder au Quiz
                  </button>
                </div>
              </main>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Cours;
