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
