import type { ServiceCategory } from '../interfaces/service-category.interface';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'repair',
    title: 'Réparation & Maintenance',
    description: 'Services de réparation et de maintenance pour tous vos appareils électroniques et informatiques.',
    icon: 'https://img.icons8.com/fluency/96/maintenance.png',
    features: [
      "Réparation d'ordinateurs",
      'Réparation de smartphones',
      'Mise à niveau de matériel',
      'Diagnostic complet',
    ],
  },
  {
    id: 'network',
    title: 'Installation & Configuration',
    description: "Services d'installation et de configuration pour vos équipements et réseaux.",
    icon: 'https://img.icons8.com/fluency/96/wifi.png',
    features: [
      'Installation de systèmes',
      'Configuration de réseaux',
      'Installation de logiciels',
      'Configuration de serveurs',
    ],
  },
  {
    id: 'consultancy',
    title: 'Conseil & Formation',
    description: 'Services de conseil et de formation pour vous aider à tirer le meilleur parti de votre technologie.',
    icon: 'https://img.icons8.com/fluency/96/training.png',
    features: ['Conseil en achat', 'Formation personnalisée', 'Audit de sécurité', 'Optimisation de performance'],
  },
  {
    id: 'support',
    title: 'Support & Assistance',
    description: "Services de support et d'assistance continue pour tous vos besoins technologiques.",
    icon: 'https://img.icons8.com/fluency/96/technical-support.png',
    features: [
      'Support technique à distance',
      'Maintenance préventive',
      'Sauvegarde de données',
      "Dépannage d'urgence",
    ],
  },
];
