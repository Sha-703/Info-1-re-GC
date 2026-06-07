#!/usr/bin/env python
import os
import django


def setup_django():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    django.setup()


def populate_lessons_and_questions():
        from main.models import Lesson, LessonQuestion
    
        lessons_data = {
        "Le Bus": 1,
        "Les Ports": 2,
        "Notions sur l'informatique": 3,
        "L'ordinateur et ses parties": 4,
        "Générations d'ordinateurs": 5,
        "Mémoire informatique": 6,
        }
    
        # Créer ou mettre à jour les leçons
        for title, order in lessons_data.items():
        lesson, created = Lesson.objects.update_or_create(
            title=title,
            defaults={
                'content': f'Contenu pour {title}',
                'order': order,
                'published': True
            }
        )
        if created:
            print(f"✓ Leçon créée: {title}")
        else:
            print(f"✓ Leçon mise à jour: {title}")
    
        # Questions pour le Bus (Chapitre 1)
        bus_questions = [
        {
            'lesson_title': 'Le Bus',
            'order': 1,
            'level': 'remember',
            'text': 'Que est le bus en informatique ?',
            'option_a': 'Un ensemble de lignes de communication entre les parties de l\'ordinateur',
            'option_b': 'Un type de processeur',
            'option_c': 'Un système d\'exploitation',
            'correct_answer': 'a',
            'explanation': 'Le bus est un ensemble de lignes de communication qui permettent aux différentes parties de l\'ordinateur d\'échanger des informations.',
            'points': 1
        },
        {
            'lesson_title': 'Le Bus',
            'order': 2,
            'level': 'remember',
            'text': 'Lesquels des éléments suivants communiquent via le bus ?',
            'option_a': 'Le clavier et la souris',
            'option_b': 'Le processeur, la mémoire et les périphériques',
            'option_c': 'Uniquement la mémoire et le disque dur',
            'correct_answer': 'b',
            'explanation': 'Le bus relie le processeur, la mémoire et les périphériques pour permettre l\'échange d\'informations.',
            'points': 1
        },
        {
            'lesson_title': 'Le Bus',
            'order': 3,
            'level': 'understand',
            'text': 'Quel est le rôle principal du bus d\'adresses ?',
            'option_a': 'Transporter les données entre les composants',
            'option_b': 'Identifier l\'emplacement des données en mémoire',
            'option_c': 'Contrôler le fonctionnement du processeur',
            'correct_answer': 'b',
            'explanation': 'Le bus d\'adresses transporte les adresses mémoire, permettant d\'identifier où les données doivent être lues ou écrites.',
            'points': 1
        },
        {
            'lesson_title': 'Le Bus',
            'order': 4,
            'level': 'understand',
            'text': 'Quel est la différence entre le bus système et le bus d\'extension ?',
            'option_a': 'Le bus système est plus rapide que le bus d\'extension',
            'option_b': 'Le bus système relie les composants internes, le bus d\'extension relie les périphériques externes',
            'option_c': 'Le bus d\'extension est utilisé uniquement pour la mémoire',
            'correct_answer': 'b',
            'explanation': 'Le bus système relie les composants principaux comme le processeur et la mémoire, tandis que le bus d\'extension relie les périphériques supplémentaires.',
            'points': 1
        },
        {
            'lesson_title': 'Le Bus',
            'order': 5,
            'level': 'remember',
            'text': 'Quels sont les trois types de bus qui composent le bus système ?',
            'option_a': 'Bus USB, SATA et Ethernet',
            'option_b': 'Bus de données, bus d\'adresses et bus de contrôle',
            'option_c': 'Bus rapide, bus lent et bus moyen',
            'correct_answer': 'b',
            'explanation': 'Le bus système est composé du bus de données (pour les données), du bus d\'adresses (pour les adresses) et du bus de contrôle (pour les signaux de contrôle).',
            'points': 1
        },
        {
            'lesson_title': 'Le Bus',
            'order': 6,
            'level': 'apply',
            'text': 'Si la largeur d\'un bus est de 32 bits, cela signifie :',
            'option_a': 'Le bus peut transporter 32 bits d\'information à la fois',
            'option_b': 'Le bus a 32 connecteurs',
            'option_c': 'Le bus fonctionne à 32 MHz',
            'correct_answer': 'a',
            'explanation': 'La largeur du bus détermine le nombre de bits qu\'il peut transporter simultanément. Un bus de 32 bits transporte 32 bits d\'information à la fois.',
            'points': 1
        },
        {
            'lesson_title': 'Le Bus',
            'order': 7,
            'level': 'understand',
            'text': 'Quel composant du bus système est responsable de l\'envoi de signaux de contrôle ?',
            'option_a': 'Le bus de données',
            'option_b': 'Le bus de contrôle',
            'option_c': 'Le bus d\'adresses',
            'correct_answer': 'b',
            'explanation': 'Le bus de contrôle envoie les signaux de contrôle qui synchronisent et dirigent le fonctionnement des autres composants.',
            'points': 1
        },
        {
            'lesson_title': 'Le Bus',
            'order': 8,
            'level': 'remember',
            'text': 'USB, PCI Express et SATA sont des exemples de :',
            'option_a': 'Bus système',
            'option_b': 'Bus d\'extension',
            'option_c': 'Bus de données',
            'correct_answer': 'b',
            'explanation': 'USB, PCI Express et SATA sont des bus d\'extension utilisés pour connecter des périphériques externes ou des cartes supplémentaires à la carte mère.',
            'points': 1
        },
        {
            'lesson_title': 'Le Bus',
            'order': 9,
            'level': 'apply',
            'text': 'Si vous voulez connecter une carte son à votre ordinateur, quel type de bus utiliserez-vous ?',
            'option_a': 'Le bus système',
            'option_b': 'Le bus de données',
            'option_c': 'Le bus d\'extension (PCI Express)',
            'correct_answer': 'c',
            'explanation': 'Une carte son est un périphérique supplémentaire qui se connecte via un bus d\'extension comme PCI Express, pas via le bus système.',
            'points': 1
        },
        {
            'lesson_title': 'Le Bus',
            'order': 10,
            'level': 'analyze',
            'text': 'Pourquoi est-il important que le bus d\'adresses ait une largeur suffisante ?',
            'option_a': 'Pour transporter plus de données rapidement',
            'option_b': 'Pour pouvoir adresser une plus grande quantité de mémoire',
            'option_c': 'Pour éviter les erreurs de transmission',
            'correct_answer': 'b',
            'explanation': 'La largeur du bus d\'adresses détermine la quantité maximale de mémoire adressable. Par exemple, un bus de 32 bits peut adresser jusqu\'à 4 GB de mémoire.',
            'points': 1
        },
        ]
    
        # Questions pour les Ports (Chapitre 2)
        ports_questions = [
        {
            'lesson_title': 'Les Ports',
            'order': 1,
            'level': 'remember',
            'text': 'Qu\'est-ce qu\'un port informatique ?',
            'option_a': 'Un point de connexion permettant de relier des périphériques ou composants',
            'option_b': 'Un type de mémoire',
            'option_c': 'Un logiciel de communication',
            'correct_answer': 'a',
            'explanation': 'Un port est un point de connexion sur l\'ordinateur qui permet de relier des périphériques ou des composants internes et d\'échanger des données.',
            'points': 1
        },
        {
            'lesson_title': 'Les Ports',
            'order': 2,
            'level': 'understand',
            'text': 'Quelle est la différence principale entre les ports internes et les ports externes ?',
            'option_a': 'Les ports internes sont plus rapides',
            'option_b': 'Les ports internes sont à l\'intérieur de l\'unité centrale, les ports externes sont visibles à l\'extérieur',
            'option_c': 'Les ports internes utilisent des câbles, les ports externes ne les utilisent pas',
            'correct_answer': 'b',
            'explanation': 'Les ports internes sont situés à l\'intérieur de l\'unité centrale et servent à connecter les composants internes, tandis que les ports externes sont visibles de l\'extérieur.',
            'points': 1
        },
        {
            'lesson_title': 'Les Ports',
            'order': 3,
            'level': 'remember',
            'text': 'Quel port interne est utilisé pour connecter un disque dur ?',
            'option_a': 'Port PCI',
            'option_b': 'Port SATA',
            'option_c': 'Port RAM',
            'correct_answer': 'b',
            'explanation': 'Le port SATA est utilisé pour connecter les disques durs et les lecteurs optiques à la carte mère.',
            'points': 1
        },
        {
            'lesson_title': 'Les Ports',
            'order': 4,
            'level': 'remember',
            'text': 'Quel port externe est utilisé pour connecter un écran ou un projecteur ?',
            'option_a': 'USB',
            'option_b': 'HDMI/VGA',
            'option_c': 'Ethernet',
            'correct_answer': 'b',
            'explanation': 'Les ports HDMI et VGA sont utilisés pour connecter les écrans, moniteurs ou projecteurs à l\'ordinateur.',
            'points': 1
        },
        {
            'lesson_title': 'Les Ports',
            'order': 5,
            'level': 'apply',
            'text': 'Vous devez connecter une imprimante, une souris et un clavier à votre ordinateur. Quel port utiliseriez-vous ?',
            'option_a': 'Port SATA',
            'option_b': 'Port USB',
            'option_c': 'Port Ethernet',
            'correct_answer': 'b',
            'explanation': 'Le port USB est un port externe universel utilisé pour connecter une variété de périphériques comme imprimantes, souris, claviers, etc.',
            'points': 1
        },
        {
            'lesson_title': 'Les Ports',
            'order': 6,
            'level': 'understand',
            'text': 'À quel port externe se connectent les câbles du réseau (internet) ?',
            'option_a': 'Port audio',
            'option_b': 'Port Ethernet',
            'option_c': 'Port USB',
            'correct_answer': 'b',
            'explanation': 'Le port Ethernet (RJ45) est utilisé pour connecter le câble réseau (internet) à l\'ordinateur.',
            'points': 1
        },
        {
            'lesson_title': 'Les Ports',
            'order': 7,
            'level': 'remember',
            'text': 'Lequel des ports suivants est utilisé pour insérer la mémoire vive (RAM) ?',
            'option_a': 'Port SATA',
            'option_b': 'Port slot mémoire',
            'option_c': 'Port PCI',
            'correct_answer': 'b',
            'explanation': 'Le port slot mémoire (slot RAM) est un port interne utilisé pour insérer les barrettes de mémoire vive dans la carte mère.',
            'points': 1
        },
        {
            'lesson_title': 'Les Ports',
            'order': 8,
            'level': 'understand',
            'text': 'Quel port est utilisé pour connecter les périphériques audio comme les écouteurs ou les microphones ?',
            'option_a': 'Port USB',
            'option_b': 'Port audio',
            'option_c': 'Port SATA',
            'correct_answer': 'b',
            'explanation': 'Le port audio est utilisé pour connecter les écouteurs, les microphones et les haut-parleurs à l\'ordinateur.',
            'points': 1
        },
        {
            'lesson_title': 'Les Ports',
            'order': 9,
            'level': 'apply',
            'text': 'Pour connecter une carte graphique à la carte mère, quel port interne faut-il utiliser ?',
            'option_a': 'Port SATA',
            'option_b': 'Port PCI Express',
            'option_c': 'Port slot mémoire',
            'correct_answer': 'b',
            'explanation': 'Le port PCI Express est utilisé pour connecter les cartes d\'extension comme les cartes graphiques, cartes son, etc., à la carte mère.',
            'points': 1
        },
        {
            'lesson_title': 'Les Ports',
            'order': 10,
            'level': 'analyze',
            'text': 'Pourquoi le port USB est-il considéré comme un standard universel ?',
            'option_a': 'Parce qu\'il est le plus rapide',
            'option_b': 'Parce qu\'il peut être utilisé pour connecter une variété de périphériques différents',
            'option_c': 'Parce qu\'il est compatible uniquement avec les ordinateurs récents',
            'correct_answer': 'b',
            'explanation': 'Le USB est un standard universel car il peut être utilisé pour connecter et communiquer avec de nombreux types de périphériques différents.',
            'points': 1
        },
        ]
    
        # Questions pour Notions sur l'informatique (Chapitre 3)
        notions_questions = [
        {
            'lesson_title': 'Notions sur l\'informatique',
            'order': 1,
            'level': 'remember',
            'text': 'Que signifie le mot "informatique" ?',
            'option_a': 'Science de l\'ordinateur',
            'option_b': 'Traitement automatique de l\'information',
            'option_c': 'Communication électronique',
            'correct_answer': 'b',
            'explanation': 'Le mot informatique vient de "information" et "automatique", ce qui signifie le traitement automatique de l\'information.',
            'points': 1
        },
        {
            'lesson_title': 'Notions sur l\'informatique',
            'order': 2,
            'level': 'remember',
            'text': 'Quel est le domaine principal d\'utilisation de l\'informatique dans les banques ?',
            'option_a': 'Divertissement',
            'option_b': 'Retrait d\'argent, envoi d\'argent et conservation des informations',
            'option_c': 'Fabrication de matériel',
            'correct_answer': 'b',
            'explanation': 'L\'informatique dans les banques est utilisée pour gérer les transactions, les retraits, les virements et stocker les données financières.',
            'points': 1
        },
        {
            'lesson_title': 'Notions sur l\'informatique',
            'order': 3,
            'level': 'understand',
            'text': 'Qu\'elle est la différence entre une information et une donnée ?',
            'option_a': 'Il n\'y a pas de différence',
            'option_b': 'Une information est un renseignement, une donnée est une information enregistrée dans l\'ordinateur',
            'option_c': 'Une donnée est plus importante qu\'une information',
            'correct_answer': 'b',
            'explanation': 'Une information est un renseignement ou un message, tandis qu\'une donnée est une information qui a été enregistrée et stockée dans un ordinateur.',
            'points': 1
        },
        {
            'lesson_title': 'Notions sur l\'informatique',
            'order': 4,
            'level': 'remember',
            'text': 'Lesquels de ces éléments sont des données informatiques ?',
            'option_a': 'Uniquement les photos et vidéos',
            'option_b': 'Le nom d\'un élève, une note, une adresse, une photo, un document Word',
            'option_c': 'Uniquement les documents texte',
            'correct_answer': 'b',
            'explanation': 'Les données informatiques incluent toutes les informations enregistrées : noms, notes, adresses, photos, documents, numéros de téléphone, etc.',
            'points': 1
        },
        {
            'lesson_title': 'Notions sur l\'informatique',
            'order': 5,
            'level': 'apply',
            'text': 'Dans quel domaine l\'informatique aide-t-elle à la recherche d\'informations et à la préparation des travaux ?',
            'option_a': 'L\'agriculture',
            'option_b': 'L\'éducation',
            'option_c': 'L\'industrie automobile',
            'correct_answer': 'b',
            'explanation': 'Dans le domaine de l\'éducation, l\'informatique permet la recherche d\'informations en ligne, la préparation des travaux et l\'apprentissage en ligne.',
            'points': 1
        },
        {
            'lesson_title': 'Notions sur l\'informatique',
            'order': 6,
            'level': 'understand',
            'text': 'Quel avantage principal l\'informatique offre-t-elle à une entreprise ?',
            'option_a': 'Augmenter les coûts',
            'option_b': 'Gagner du temps, conserver les données et communiquer rapidement',
            'option_c': 'Réduire la productivité',
            'correct_answer': 'b',
            'explanation': 'L\'informatique permet aux entreprises de gagner du temps, de stocker et gérer efficacement les données, et de communiquer rapidement.',
            'points': 1
        },
        {
            'lesson_title': 'Notions sur l\'informatique',
            'order': 7,
            'level': 'remember',
            'text': 'Lequel des risques suivants est un inconvénient de l\'informatique ?',
            'option_a': 'Augmentation de la vitesse',
            'option_b': 'Piratage et perte des données',
            'option_c': 'Amélioration de la communication',
            'correct_answer': 'b',
            'explanation': 'Les inconvénients incluent le piratage, la perte de données, les virus informatiques et la dépendance à Internet.',
            'points': 1
        },
        {
            'lesson_title': 'Notions sur l\'informatique',
            'order': 8,
            'level': 'apply',
            'text': 'Quel service d\'informatique utiliseriez-vous pour communiquer rapidement avec quelqu\'un loin de vous ?',
            'option_a': 'Calculatrice',
            'option_b': 'Système d\'exploitation',
            'option_c': 'Courrier électronique ou WhatsApp',
            'correct_answer': 'c',
            'explanation': 'Le courrier électronique (email) et les applications de messagerie comme WhatsApp ou Facebook sont des services informatiques utilisés pour communiquer rapidement.',
            'points': 1
        },
        {
            'lesson_title': 'Notions sur l\'informatique',
            'order': 9,
            'level': 'understand',
            'text': 'Comment l\'informatique aide-t-elle dans le domaine médical (hôpitaux) ?',
            'option_a': 'Elle remplace complètement les médecins',
            'option_b': 'Elle aide à la gestion des patients et de leurs dossiers médicaux',
            'option_c': 'Elle n\'a aucun rôle dans la santé',
            'correct_answer': 'b',
            'explanation': 'L\'informatique dans les hôpitaux aide à gérer les dossiers patients, les résultats d\'examens, les traitements prescrits et améliore la qualité des soins.',
            'points': 1
        },
        {
            'lesson_title': 'Notions sur l\'informatique',
            'order': 10,
            'level': 'analyze',
            'text': 'Pourquoi est-il important de comprendre les inconvénients de l\'informatique ?',
            'option_a': 'Pour ne pas l\'utiliser',
            'option_b': 'Pour prendre des mesures de sécurité appropriées et minimiser les risques',
            'option_c': 'Parce que c\'est ennuyeux',
            'correct_answer': 'b',
            'explanation': 'Comprendre les inconvénients (piratage, virus, perte de données) est essentiel pour mettre en place des mesures de sécurité appropriées.',
            'points': 1
        },
        ]
    
        # Questions pour L'ordinateur et ses parties (Chapitre 4)
        ordinateur_questions = [
        {
            'lesson_title': 'L\'ordinateur et ses parties',
            'order': 1,
            'level': 'remember',
            'text': 'Qu\'est-ce qu\'un ordinateur ?',
            'option_a': 'Un appareil électronique capable de recevoir, traiter, conserver et afficher les informations',
            'option_b': 'Un type de téléphone',
            'option_c': 'Un appareil pour la photographie',
            'correct_answer': 'a',
            'explanation': 'Un ordinateur est une machine électronique capable de recevoir des informations, les traiter, les conserver en mémoire et les afficher.',
            'points': 1
        },
        {
            'lesson_title': 'L\'ordinateur et ses parties',
            'order': 2,
            'level': 'remember',
            'text': 'Quelles sont les deux grandes parties d\'un ordinateur ?',
            'option_a': 'Le clavier et la souris',
            'option_b': 'Le Hardware (parties physiques) et le Software (programmes)',
            'option_c': 'Le processeur et la mémoire',
            'correct_answer': 'b',
            'explanation': 'Un ordinateur se compose du Hardware (éléments physiques qu\'on peut toucher) et du Software (programmes et logiciels).',
            'points': 1
        },
        {
            'lesson_title': 'L\'ordinateur et ses parties',
            'order': 3,
            'level': 'understand',
            'text': 'Lequel des éléments suivants est un exemple de Hardware ?',
            'option_a': 'Microsoft Word',
            'option_b': 'Windows',
            'option_c': 'L\'écran',
            'correct_answer': 'c',
            'explanation': 'L\'écran est une partie physique de l\'ordinateur (Hardware). Word et Windows sont des logiciels (Software).',
            'points': 1
        },
        {
            'lesson_title': 'L\'ordinateur et ses parties',
            'order': 4,
            'level': 'remember',
            'text': 'Quel périphérique sert à introduire les informations dans l\'ordinateur ?',
            'option_a': 'L\'écran',
            'option_b': 'Le clavier et la souris',
            'option_c': 'L\'imprimante',
            'correct_answer': 'b',
            'explanation': 'Le clavier et la souris sont des périphériques d\'entrée qui permettent d\'introduire des informations dans l\'ordinateur.',
            'points': 1
        },
        {
            'lesson_title': 'L\'ordinateur et ses parties',
            'order': 5,
            'level': 'understand',
            'text': 'À quoi servent les périphériques de sortie ?',
            'option_a': 'À stocker les informations',
            'option_b': 'À faire sortir les informations de l\'ordinateur',
            'option_c': 'À connecter d\'autres ordinateurs',
            'correct_answer': 'b',
            'explanation': 'Les périphériques de sortie (écran, imprimante, haut-parleur) servent à afficher ou faire sortir les informations de l\'ordinateur.',
            'points': 1
        },
        {
            'lesson_title': 'L\'ordinateur et ses parties',
            'order': 6,
            'level': 'remember',
            'text': 'Lesquels des éléments suivants sont des périphériques de stockage ?',
            'option_a': 'Clavier, souris et écran',
            'option_b': 'Clé USB, disque dur, carte mémoire et CD',
            'option_c': 'Imprimante et scanner',
            'correct_answer': 'b',
            'explanation': 'Les périphériques de stockage conservent les informations : clés USB, disques durs, cartes mémoire, CD, DVD.',
            'points': 1
        },
        {
            'lesson_title': 'L\'ordinateur et ses parties',
            'order': 7,
            'level': 'apply',
            'text': 'Vous avez besoin de sauvegarder un document important. Quel périphérique utiliserez-vous ?',
            'option_a': 'L\'écran',
            'option_b': 'L\'imprimante',
            'option_c': 'Une clé USB ou un disque dur externe',
            'correct_answer': 'c',
            'explanation': 'Pour sauvegarder un document, vous utiliseriez un périphérique de stockage comme une clé USB ou un disque dur externe.',
            'points': 1
        },
        {
            'lesson_title': 'L\'ordinateur et ses parties',
            'order': 8,
            'level': 'understand',
            'text': 'Quel avantage principal l\'ordinateur offre-t-il ?',
            'option_a': 'C\'est un appareil lourd et lent',
            'option_b': 'Rapidité, précision et grande capacité de stockage',
            'option_c': 'Il consomme très peu d\'électricité',
            'correct_answer': 'b',
            'explanation': 'Les avantages de l\'ordinateur incluent sa rapidité de traitement, sa précision et sa grande capacité de stockage de données.',
            'points': 1
        },
        {
            'lesson_title': 'L\'ordinateur et ses parties',
            'order': 9,
            'level': 'remember',
            'text': 'Lequel des risques suivants est un inconvénient de l\'utilisation prolongée de l\'ordinateur ?',
            'option_a': 'Amélioration de la vision',
            'option_b': 'Fatigue des yeux',
            'option_c': 'Augmentation de la concentration',
            'correct_answer': 'b',
            'explanation': 'Un inconvénient de l\'usage prolongé de l\'ordinateur est la fatigue des yeux due à la lumière de l\'écran.',
            'points': 1
        },
        {
            'lesson_title': 'L\'ordinateur et ses parties',
            'order': 10,
            'level': 'analyze',
            'text': 'Pourquoi est-il important de connaître les différents types de périphériques ?',
            'option_a': 'Pour les collectionner',
            'option_b': 'Pour utiliser efficacement l\'ordinateur selon vos besoins',
            'option_c': 'Parce que c\'est obligatoire à l\'école',
            'correct_answer': 'b',
            'explanation': 'Connaître les périphériques permet de choisir et d\'utiliser les bons outils pour accomplir vos tâches informatiques efficacement.',
            'points': 1
        },
        ]
    
        # Questions pour Générations d'ordinateurs (Chapitre 5)
        generations_questions = [
        {
            'lesson_title': 'Générations d\'ordinateurs',
            'order': 1,
            'level': 'remember',
            'text': 'Combien de générations d\'ordinateurs existent-elles en général ?',
            'option_a': '2 générations',
            'option_b': '4 générations',
            'option_c': '7 générations',
            'correct_answer': 'b',
            'explanation': 'On compte généralement 4 (ou parfois 5) générations d\'ordinateurs selon les avancées technologiques majeures.',
            'points': 1
        },
        {
            'lesson_title': 'Générations d\'ordinateurs',
            'order': 2,
            'level': 'remember',
            'text': 'Quel élément caractérise la première génération d\'ordinateurs ?',
            'option_a': 'Les transistors',
            'option_b': 'Les tubes à vide (ou lampes)',
            'option_c': 'Les circuits intégrés',
            'correct_answer': 'b',
            'explanation': 'La première génération d\'ordinateurs (1945-1955) était caractérisée par l\'utilisation de tubes à vide comme éléments de base.',
            'points': 1
        },
        {
            'lesson_title': 'Générations d\'ordinateurs',
            'order': 3,
            'level': 'understand',
            'text': 'Quel est l\'principal avantage de la deuxième génération par rapport à la première ?',
            'option_a': 'Plus d\'espace',
            'option_b': 'L\'utilisation de transistors au lieu de tubes à vide, plus petits et plus fiables',
            'option_c': 'Plus de couleurs d\'affichage',
            'correct_answer': 'b',
            'explanation': 'La deuxième génération (1955-1965) a remplacé les tubes à vide par des transistors, ce qui a rendu les ordinateurs plus petits, plus rapides et plus fiables.',
            'points': 1
        },
        {
            'lesson_title': 'Générations d\'ordinateurs',
            'order': 4,
            'level': 'remember',
            'text': 'Quel élément électronique caractérise la troisième génération d\'ordinateurs ?',
            'option_a': 'Les tubes à vide',
            'option_b': 'Les transistors',
            'option_c': 'Les circuits intégrés',
            'correct_answer': 'c',
            'explanation': 'La troisième génération (1965-1971) était caractérisée par l\'utilisation de circuits intégrés (IC) regroupant plusieurs transistors.',
            'points': 1
        },
        {
            'lesson_title': 'Générations d\'ordinateurs',
            'order': 5,
            'level': 'understand',
            'text': 'Quel progrès majeur la quatrième génération a-t-elle apporté ?',
            'option_a': 'L\'invention du clavier',
            'option_b': 'L\'invention du microprocesseur',
            'option_c': 'L\'invention de la souris',
            'correct_answer': 'b',
            'explanation': 'La quatrième génération (1971-1981) a marqué l\'arrivée du microprocesseur, révolutionnant la conception des ordinateurs.',
            'points': 1
        },
        {
            'lesson_title': 'Générations d\'ordinateurs',
            'order': 6,
            'level': 'remember',
            'text': 'Quelle était approximativement la taille des ordinateurs de la première génération ?',
            'option_a': 'La taille d\'un téléphone portable',
            'option_b': 'La taille d\'une grande pièce',
            'option_c': 'La taille d\'une calculatrice',
            'correct_answer': 'b',
            'explanation': 'Les ordinateurs de la première génération étaient énormes, occupant une grande pièce et consommant beaucoup d\'électricité.',
            'points': 1
        },
        {
            'lesson_title': 'Générations d\'ordinateurs',
            'order': 7,
            'level': 'apply',
            'text': 'Si vous aviez besoin d\'un ordinateur portable au travail, quelle génération minimum faudrait-il ?',
            'option_a': 'La première génération',
            'option_b': 'La deuxième génération',
            'option_c': 'La quatrième génération ou plus',
            'correct_answer': 'c',
            'explanation': 'Les ordinateurs portables (laptops) ont pu être développés à partir de la quatrième génération avec l\'invention du microprocesseur.',
            'points': 1
        },
        {
            'lesson_title': 'Générations d\'ordinateurs',
            'order': 8,
            'level': 'understand',
            'text': 'Quel aspect de performance s\'est amélioré le plus entre les générations ?',
            'option_a': 'Uniquement la taille',
            'option_b': 'La vitesse, la fiabilité et la capacité de stockage',
            'option_c': 'Uniquement le prix',
            'correct_answer': 'b',
            'explanation': 'À chaque génération, la vitesse de traitement, la fiabilité et la capacité de stockage se sont considérablement améliorées.',
            'points': 1
        },
        {
            'lesson_title': 'Générations d\'ordinateurs',
            'order': 9,
            'level': 'remember',
            'text': 'À quelle génération appartient probablement votre ordinateur ou téléphone personnel ?',
            'option_a': 'Deuxième génération',
            'option_b': 'Troisième génération',
            'option_c': 'Quatrième génération ou plus (5ème)',
            'correct_answer': 'c',
            'explanation': 'Les ordinateurs et smartphones modernes appartiennent à la quatrième ou cinquième génération, avec des microprocesseurs avancés.',
            'points': 1
        },
        {
            'lesson_title': 'Générations d\'ordinateurs',
            'order': 10,
            'level': 'analyze',
            'text': 'Pourquoi l\'évolution des générations d\'ordinateurs est-elle importante pour la société ?',
            'option_a': 'Parce que les anciens ordinateurs prenaient trop de place',
            'option_b': 'Parce qu\'elle a permis aux ordinateurs de devenir accessibles et utiles à tous',
            'option_c': 'Parce qu\'elle a rendu les ordinateurs plus difficiles à utiliser',
            'correct_answer': 'b',
            'explanation': 'L\'évolution générationnel a rendu les ordinateurs plus petits, plus rapides, plus fiables et moins chers, les rendant accessibles au grand public.',
            'points': 1
        },
        ]
    
        # Questions pour Mémoire informatique (Chapitre 6)
        memoire_questions = [
        {
            'lesson_title': 'Mémoire informatique',
            'order': 1,
            'level': 'remember',
            'text': 'Quel est le rôle principal de la mémoire en informatique ?',
            'option_a': 'Traiter les données',
            'option_b': 'Stocker les données et les programmes',
            'option_c': 'Afficher les informations',
            'correct_answer': 'b',
            'explanation': 'La mémoire stocke temporairement ou permanemment les données et les programmes utilisés par l\'ordinateur.',
            'points': 1
        },
        {
            'lesson_title': 'Mémoire informatique',
            'order': 2,
            'level': 'remember',
            'text': 'Qu\'est-ce que la RAM ?',
            'option_a': 'Une mémoire permanente',
            'option_b': 'Une mémoire temporaire et rapide',
            'option_c': 'Un disque dur',
            'correct_answer': 'b',
            'explanation': 'La RAM (Random Access Memory) est une mémoire vive qui stocke temporairement les données du programme en cours et se vide au redémarrage.',
            'points': 1
        },
        {
            'lesson_title': 'Mémoire informatique',
            'order': 3,
            'level': 'understand',
            'text': 'Quel est l\'principal inconvénient de la RAM ?',
            'option_a': 'Elle est trop rapide',
            'option_b': 'Elle perd son contenu quand l\'ordinateur s\'éteint',
            'option_c': 'Elle est trop grande',
            'correct_answer': 'b',
            'explanation': 'Un inconvénient de la RAM est qu\'elle est volatile : elle perd toutes les données quand l\'ordinateur est éteint.',
            'points': 1
        },
        {
            'lesson_title': 'Mémoire informatique',
            'order': 4,
            'level': 'remember',
            'text': 'Qu\'est-ce que la ROM ?',
            'option_a': 'Une mémoire qui peut être modifiée',
            'option_b': 'Une mémoire permanente utilisée pour démarrer l\'ordinateur',
            'option_c': 'Un type de disque dur',
            'correct_answer': 'b',
            'explanation': 'La ROM (Read-Only Memory) est une mémoire permanente qui contient les instructions pour démarrer l\'ordinateur.',
            'points': 1
        },
        {
            'lesson_title': 'Mémoire informatique',
            'order': 5,
            'level': 'understand',
            'text': 'Quel type de mémoire utiliseriez-vous pour stocker permanemment des photos et des documents ?',
            'option_a': 'La RAM',
            'option_b': 'La ROM',
            'option_c': 'Un disque dur ou un SSD',
            'correct_answer': 'c',
            'explanation': 'Pour stocker permanemment des fichiers, on utilise le disque dur ou le SSD, qui conservent les données même quand l\'ordinateur est éteint.',
            'points': 1
        },
        {
            'lesson_title': 'Mémoire informatique',
            'order': 6,
            'level': 'remember',
            'text': 'Quels éléments font partie de la "mémoire de stockage" ?',
            'option_a': 'Clavier et souris',
            'option_b': 'Disques durs, SSD, clés USB et cartes mémoire',
            'option_c': 'Processeur et circuits intégrés',
            'correct_answer': 'b',
            'explanation': 'La mémoire de stockage comprend les disques durs, les SSD (Solid State Drives), les clés USB et les cartes mémoire.',
            'points': 1
        },
        {
            'lesson_title': 'Mémoire informatique',
            'order': 7,
            'level': 'apply',
            'text': 'Vous avez besoin d\'une grande quantité de mémoire pour jouer à des jeux vidéo modernes. Quel type augmenteriez-vous ?',
            'option_a': 'La ROM',
            'option_b': 'La RAM',
            'option_c': 'La mémoire cache',
            'correct_answer': 'b',
            'explanation': 'Pour les jeux vidéo et les applications exigeantes, il faut augmenter la RAM pour une meilleure performance en temps réel.',
            'points': 1
        },
        {
            'lesson_title': 'Mémoire informatique',
            'order': 8,
            'level': 'understand',
            'text': 'Qu\'est-ce qu\'un SSD et quel est son avantage par rapport à un disque dur mécanique ?',
            'option_a': 'C\'est une mémoire RAM additionnelle',
            'option_b': 'C\'est un disque dur sans pièces mobiles, plus rapide et plus fiable',
            'option_c': 'C\'est une mémoire ROM améliorée',
            'correct_answer': 'b',
            'explanation': 'Un SSD (Solid State Drive) n\'a pas de pièces mobiles, ce qui le rend beaucoup plus rapide, plus durable et plus fiable qu\'un disque dur mécanique.',
            'points': 1
        },
        {
            'lesson_title': 'Mémoire informatique',
            'order': 9,
            'level': 'remember',
            'text': 'Combien de RAM est généralement recommandée pour un ordinateur de bureau moderne ?',
            'option_a': '1 GB',
            'option_b': '4-8 GB minimum, 16 GB ou plus pour les tâches exigeantes',
            'option_c': '512 MB',
            'correct_answer': 'b',
            'explanation': 'Un ordinateur moderne devrait avoir au minimum 4-8 GB de RAM, et 16 GB ou plus pour le gaming ou la création de contenu.',
            'points': 1
        },
        {
            'lesson_title': 'Mémoire informatique',
            'order': 10,
            'level': 'analyze',
            'text': 'Pourquoi est-il important de gérer efficacement la mémoire d\'un ordinateur ?',
            'option_a': 'Pour le divertissement',
            'option_b': 'Pour assurer une bonne performance, éviter les ralentissements et prolonger la durée de vie du matériel',
            'option_c': 'Parce que c\'est obligatoire',
            'correct_answer': 'b',
            'explanation': 'Une bonne gestion de la mémoire assure une meilleure performance, évite les ralentissements et prolonge la durée de vie de l\'ordinateur.',
            'points': 1
        },
        ]
    
        # Tous les questions
        all_questions = [
        *bus_questions,
        *ports_questions,
        *notions_questions,
        *ordinateur_questions,
        *generations_questions,
        *memoire_questions
        ]
    
        # Ajouter les questions à la base de données
        for q in all_questions:
        lesson = Lesson.objects.get(title=q['lesson_title'])
        
        LessonQuestion.objects.get_or_create(
            lesson=lesson,
            text=q['text'],
            defaults={
                'option_a': q['option_a'],
                'option_b': q['option_b'],
                'option_c': q['option_c'],
                'correct_answer': q['correct_answer'],
                'explanation': q['explanation'],
                'level': q['level'],
                'points': q['points'],
                'order': q['order']
            }
        )
    
        print("\n✅ All 60 lesson questions have been created successfully!")
        print("✓ 10 questions for each of the 6 lessons")
        print("✓ All questions have explanations and follow Bloom's taxonomy")
    
    
if __name__ == '__main__':
    setup_django()
    populate_lessons_and_questions()
