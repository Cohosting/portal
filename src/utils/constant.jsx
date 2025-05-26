import {
  AiOutlineFile,
  AiOutlineHome,
  AiOutlineRotateLeft,
  AiOutlineSetting,
} from 'react-icons/ai';
import { BiCustomize, BiMessageMinus } from 'react-icons/bi';
import { FaRegUserCircle, FaVoicemail } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import { GiSettingsKnobs } from 'react-icons/gi';
import { MdPayment } from 'react-icons/md';
import { RiTeamLine } from 'react-icons/ri';

export const foundOn = [
  'Tiktok',
  'Event or conference',
  'Google',
  'Reddit',
  'Sales email',
  'Youtube',
  'Review site',
  'Podcast',
  'Referral or friend',
  'Previous user',
  'Newsletter',
  'LinkedIn',
  'Twitter',
  'Press',
  'Facebook or Instragram',
  'Used as client or another business',
  'Product Hunt',
  'Other',
];
export const industries = [
  'Accounting and bookkeeping',
  'Construction',
  'Consulting',
  'Design',
  'Ecommerce',
  'Education',
  'Engineering',
  'Entertainment',
  'Finance',
  'Healthcare',
  'Insurance',
  'Legal',
  'Logisctics and transportation',
  'Manufacturing',
  'Marketing',
  'Nonprofit',
  'Real estate',
  'Recruiting and staffing',
  'Technology',
  'Travel and tourism',
  'Other',
];
export const sizes = ['Just me', '2-5', '6-10', '11-50', '51-100', '100+'];
export const clients = [
  "I don't have any clients yet",
  '1-10',
  '11-50',
  '51-100',
  '101-250',
  '251-1,000',
  '1,001-10,000',
  '10,001+',
];

export const types = ['Companies', 'Individuals', 'A mix of both'];

export const defaultAppList = [
  {
    name: 'Messages',
    icon: 'messages',
    index: 0,
    is_default: true,
  },
  {
    name: 'Billing',
    icon: 'billing',
    index: 1,
    is_default: true,
  },
  {
    name: 'Files',
    icon: 'files',
    index: 2,
    is_default: true,
  },
];

export const property = [
  {
    id: 1,
    title: 'Email',
    icon: <FaVoicemail />,
  },
  {
    id: 2,
    title: 'Phone',
    icon: <FaVoicemail />,
  },
  {
    id: 3,
    title: 'Address',
    icon: <FaVoicemail />,
  },
  {
    id: 4,
    title: 'URL',
    icon: <FaVoicemail />,
  },
  {
    id: 5,
    title: 'Custom',
    icon: <FaVoicemail />,
  },
  {
    id: 6,
    title: 'Number',
    icon: <FaVoicemail />,
  },
  {
    id: 7,
    title: 'Text',
    icon: <FaVoicemail />,
  },
];
// Step 1: Modify navItemList to include groups and a property for additional content
export const navItemList = [
  {
    group: 'Main',
    items: [
      { icon: <AiOutlineHome />, label: 'Home', path: '/' },
      { icon: <FiUsers />, label: 'Client', path: '/client' },
      // Other main items...
    ],
  },
  {
    group: 'Apps',
    items: [
      { icon: <AiOutlineFile />, label: 'Files', path: '/files' },
      { icon: <BiMessageMinus />, label: 'Messages', path: '/messages' },
      { icon: <MdPayment />, label: 'Billing', path: '/billing' },
      {
        icon: <MdPayment />,
        label: 'Extentions',
        path: '/extentions',
      },
    ],
  },
  {
    group: 'Preferences',
    items: [
      {
        icon: <GiSettingsKnobs />,
        label: 'App settings',
        path: '/module-management',
      },
      {
        icon: <BiCustomize />,
        label: 'Customise',
        path: '/customize',
      },
      {
        icon: <RiTeamLine />,
        label: 'Team',
        path: '/team',
      },
      {
        icon: <AiOutlineRotateLeft />,
        label: 'Subscription',
        path: '/subscription',
      },
      {
        icon: <AiOutlineSetting />,
        label: 'Portal settings',
        path: '/settings',
      },
      {
        icon: <FaRegUserCircle />,
        label: 'Profile',
        path: '/settings/me',
      },
    ],
  },
];
export const portalTexts = {
  customizePortalView: 'Customize portal view',
  brandName: {
    heading: 'Brand name',
    subText:
      'Your brand name is the name your customers use to refer to you. It doesn’t need to be your legal business name.',
  },
  imageAsset: {
    heading: 'Image asset',
    subText:
      'Your icon and login images are used in various places to customize the experience for you and your clients',
    squareIcon: 'Square icon',
    squareIconSubText: 'Used in the navbar and on mobile',
    fullLogo: 'Full logo',
    fullLogoSubText: 'Used on login pages and invoices',
    squareLoginImage: 'Login image',
    squareLoginImageSubText: 'Used on the side of your login page',
  },
  brandColors: {
    heading: 'Brand colors',
    subText:
      'Customize the colors in your portal. Note that these colors only affect your portal and not the internal user experience. The accent is used for buttons, tags, and other UI elements.',
    sidebarBgColor: 'Sidebar background color',
    sidebarTextColor: 'Sidebar text color',
    sidebarActiveTextColor: 'Sidebar active text color',
    accentColor: 'Accent color',
    loginFormTextColor: 'Login form label and text color',
    loginButtonColor: 'Login button background color',
    loginButtonTextColor: 'Login button text color',

 
  },
  poweredBy: {
    heading: 'Powered by Copilot badge',
    subText:
      'The Powered by Copilot badge shows on the sign in and sign up pages of your portal.',
  },
  // Add more text constants here
};



export const tiers = [
  {
    id: 1,
    name: 'Starter',
    description: 'For small teams just getting started',
    monthly: {
      price: 89,
      priceId: 'price_1Ppot2G6ekPTMWCwZM8MR58c',
    },
    yearly: {
      price: 828,
      priceId: 'price_1Ppot2G6ekPTMWCwJP5tlcod',
    },
    features: [
      '10 users included',
      '2 GB of storage',
      'Email support',
      'Help center access',
    ],
    featured: false,
    href: '#',
  },
  {
    id: 2,
    name: 'Pro',
    description: 'For growing teams',
    monthly: {
      price: 199,
      priceId: 'price_1PpotSG6ekPTMWCw3ulBiPa9',
    },
    yearly: {
      price: 1908,
      priceId: 'price_1PpotxG6ekPTMWCwFjy8Gr8V',
    },
    features: [
      '20 users included',
      '10 GB of storage',
      'Priority email support',
      'Help center access',
      'Custom branding',
      '2FA',
    ],
    featured: true,
    href: '#',
  },
];