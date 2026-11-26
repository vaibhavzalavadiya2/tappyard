export const SITE_URL = 'https://tappyard.com';
export const SITE_NAME = 'TAPPYARD';

export function getContactEmail(): string {
  const envEmail = process.env.CONTACT_EMAIL?.trim();
  return envEmail && envEmail.length > 0 ? envEmail : 'support@tappyard.com';
}

export interface SiteFaqItem {
  question: string;
  answer: string;
}

export const HOME_FAQS: SiteFaqItem[] = [
  {
    question: 'Are all games on TAPPYARD completely free to play?',
    answer:
      'Yes. Every game on TAPPYARD is 100% free to play directly in your web browser with no paywalls, hidden in-app purchases, or subscription fees.',
  },
  {
    question: 'Do I need to download or install any files to play?',
    answer:
      'No download, install, or registration is required. All games run instantly using modern HTML5 Canvas and WebGL technology in Chrome, Safari, Firefox, Edge, and mobile browsers.',
  },
  {
    question: 'Can I play TAPPYARD games on mobile phones and tablets?',
    answer:
      'Yes. All TAPPYARD games are built mobile-first with responsive touch controls, full-screen support, and zero horizontal scrolling on iPhone, iPad, Android phones, and tablets.',
  },
  {
    question: 'Do I need an account to play?',
    answer:
      'No account, sign-up, or registration is required to play. Your highest scores, unlocked character skins, and diamond rewards save automatically to your local browser storage.',
  },
  {
    question: 'Are the games unblocked at school or work?',
    answer:
      'Yes. TAPPYARD games run safely over standard secure HTTPS in your browser with zero executable downloads, making them accessible for casual gaming breaks on school and work networks.',
  },
  {
    question: 'What are good quick games to play when bored?',
    answer:
      'For fast reflex fun, try Jump Jelly Jump! (3D runner), Conveyor Sort Rush (shape sorting arcade), or Cyber Dash (1-tap flight). If you want mental stimulation, play 2048 Neon Fusion, Cupcake 2048, or Block Grid Zen (10x10 spatial block puzzle). Every TAPPYARD game starts in under a second.',
  },
];
