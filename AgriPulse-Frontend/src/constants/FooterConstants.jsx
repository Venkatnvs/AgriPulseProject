import { Github, BriefcaseBusiness, LinkedinIcon, Instagram } from 'lucide-react';

const SocialLinks = [
    {
        title: 'Github',
        link: 'https://github.com/Venkatnvs/',
        icon: <Github />,
    },
    {
        title: 'Portfolio',
        link: 'https://nvsconnect.me/',
        icon: <BriefcaseBusiness />,
    },
    {
        title: 'LinkedIn',
        link: 'https://www.linkedin.com/in/n-venkat-swaroop/',
        icon: <LinkedinIcon />,
    },
    {
        title: 'Instagram',
        link: 'https://www.instagram.com/n.venkatswaroop/',
        icon: <Instagram />,
    },
];

const FooterLinks = [
    {
        title: 'Dashboard',
        link: '/dashboard',
    },
    {
        title: 'FAQ',
        link: '#',
    },
    {
        title: 'Contact',
        link: '/contact',
    },
];

export { SocialLinks, FooterLinks };