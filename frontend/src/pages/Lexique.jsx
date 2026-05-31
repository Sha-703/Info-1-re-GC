function Lexique() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const entries = {
    A: [
      { term: 'API', definition: 'Interface de programmation d’applications qui permet à des logiciels de communiquer entre eux.' },
      { term: 'AI', definition: 'Intelligence artificielle, ensemble de techniques pour simuler l’intelligence humaine.' }
    ],
    B: [
      { term: 'BIOS', definition: 'Ensemble de programmes de démarrage du système dans l’ordinateur.' },
      { term: 'BYTE', definition: 'Unité de mesure de données équivalente à 8 bits.' }
    ],
    C: [
      { term: 'CPU', definition: 'Unité centrale de traitement, cœur de l’ordinateur.' },
      { term: 'CSS', definition: 'Feuilles de style en cascade utilisées pour présenter les pages web.' }
    ],
    D: [
      { term: 'DNS', definition: 'Système de noms de domaine qui traduit les adresses web en adresses IP.' },
      { term: 'DDoS', definition: 'Attaque informatique qui surcharge un service en envoyant beaucoup de requêtes.' }
    ],
    E: [
      { term: 'ETHERNET', definition: 'Norme de réseau filaire pour connecter des appareils entre eux.' },
      { term: 'EEPROM', definition: 'Mémoire programmable et effaçable électriquement.' }
    ],
    F: [
      { term: 'FTP', definition: 'Protocole de transfert de fichiers entre ordinateurs sur un réseau.' },
      { term: 'FPS', definition: 'Images par seconde, utilisé pour mesurer la fluidité des vidéos et jeux.' }
    ],
    G: [
      { term: 'GPU', definition: 'Processeur graphique dédié au rendu des images et calculs visuels.' },
      { term: 'GUI', definition: 'Interface graphique utilisateur, écran avec icônes et menus.' }
    ],
    H: [
      { term: 'HTML', definition: 'Langage de balisage utilisé pour structurer le contenu des pages web.' },
      { term: 'HTTP', definition: 'Protocole de communication pour transférer des pages web sur Internet.' }
    ],
    I: [
      { term: 'IP', definition: 'Adresse numérique attribuée à chaque appareil sur un réseau.' },
      { term: 'ISP', definition: 'Fournisseur d’accès à Internet.' }
    ],
    J: [
      { term: 'JSON', definition: 'Format de données léger utilisé pour échanger des informations entre applications.' },
      { term: 'JVM', definition: 'Machine virtuelle Java qui exécute les programmes Java.' }
    ],
    K: [
      { term: 'KB', definition: 'Kilooctet, unité de stockage équivalente à 1024 octets.' },
      { term: 'KVM', definition: 'Commutateur clavier/vidéo/souris ou machine virtuelle.' }
    ],
    L: [
      { term: 'LAN', definition: 'Réseau local qui connecte des appareils dans un même lieu.' },
      { term: 'LDAP', definition: 'Protocole pour accéder et gérer des annuaires d’utilisateurs.' }
    ],
    M: [
      { term: 'MAC', definition: 'Adresse matérielle unique assignée à un appareil réseau.' },
      { term: 'MBPS', definition: 'Mégabits par seconde, unité de vitesse de transmission de données.' }
    ],
    N: [
      { term: 'NFC', definition: 'Communication en champ proche pour l’échange de données à courte distance.' },
      { term: 'NAS', definition: 'Stockage en réseau accessible par plusieurs appareils.' }
    ],
    O: [
      { term: 'OS', definition: 'Système d’exploitation qui gère le matériel et les applications.' },
      { term: 'OCR', definition: 'Reconnaissance optique de caractères pour convertir des images en texte.' }
    ],
    P: [
      { term: 'PDF', definition: 'Format de document portable utilisé pour partager des fichiers conservant leur mise en page.' },
      { term: 'PHP', definition: 'Langage de programmation principalement utilisé pour le développement web.' }
    ],
    Q: [
      { term: 'QoS', definition: 'Qualité de service, mécanisme qui garantit la performance des réseaux.' },
      { term: 'QR', definition: 'Code à réponse rapide utilisé pour stocker et scanner des informations.' }
    ],
    R: [
      { term: 'RAM', definition: 'Mémoire vive utilisée pour stocker temporairement les données en cours d’utilisation.' },
      { term: 'ROM', definition: 'Mémoire permanente contenant des instructions qui ne disparaissent pas au redémarrage.' }
    ],
    S: [
      { term: 'SSD', definition: 'Disque de stockage flash rapide sans pièces mobiles.' },
      { term: 'SQL', definition: 'Langage de requêtes utilisé pour interroger une base de données.' }
    ],
    T: [
      { term: 'TCP', definition: 'Protocole de communication fiable sur Internet.' },
      { term: 'TLS', definition: 'Protocole de sécurité qui chiffre les communications sur le web.' }
    ],
    U: [
      { term: 'URL', definition: 'Adresse web qui indique où trouver une ressource sur Internet.' },
      { term: 'USB', definition: 'Norme de connexion universelle pour les périphériques.' }
    ],
    V: [
      { term: 'VPN', definition: 'Réseau privé virtuel qui sécurise les connexions à distance.' },
      { term: 'VGA', definition: 'Standard de connexion vidéo pour écrans.' }
    ],
    W: [
      { term: 'Wi-Fi', definition: 'Technologie sans fil pour connecter des appareils à un réseau.' },
      { term: 'WWW', definition: 'World Wide Web, ensemble des pages et services accessibles sur Internet.' }
    ],
    X: [
      { term: 'XML', definition: 'Langage de balisage pour structurer des données.' },
      { term: 'XSS', definition: 'Failles de sécurité qui permettent l’injection de scripts malveillants.' }
    ],
    Y: [
      { term: 'YAML', definition: 'Format lisible pour représenter des données structurées.' },
      { term: 'Y2K', definition: 'Problème lié au passage à l’an 2000 dans les anciens logiciels.' }
    ],
    Z: [
      { term: 'ZIP', definition: 'Format de compression de fichiers pour réduire leur taille.' },
      { term: 'Z-WAVE', definition: 'Protocole sans fil utilisé pour domotique et objets connectés.' }
    ]
  };

  return (
    <section className="page">
      <div className="courses-header">
        <h1>📖 Lexique Informatique</h1>
        <p>Un dictionnaire alphabétique des abréviations et termes informatiques.</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
        {letters.map((letter) => (
          <a
            key={letter}
            href={`#${letter}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#ffffff',
              color: '#1f2937',
              textDecoration: 'none',
              boxShadow: '0 5px 18px rgba(15, 23, 42, 0.08)',
              fontWeight: '700'
            }}
          >
            {letter}
          </a>
        ))}
      </div>

      {letters.map((letter) => (
        <div key={letter} id={letter} style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#2563eb', marginBottom: '0.8rem' }}>{letter}</h2>
          {entries[letter] ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {entries[letter].map((item) => (
                <div
                  key={item.term}
                  style={{
                    background: '#ffffff',
                    borderRadius: '1rem',
                    padding: '1rem 1.25rem',
                    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
                    border: '1px solid rgba(15, 23, 42, 0.05)'
                  }}
                >
                  <h3 style={{ margin: '0 0 0.5rem', color: '#1f2937' }}>{item.term}</h3>
                  <p style={{ margin: 0, color: '#475569' }}>{item.definition}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#475569' }}>Aucun terme répertorié pour cette lettre.</p>
          )}
        </div>
      ))}
    </section>
  );
}

export default Lexique;
