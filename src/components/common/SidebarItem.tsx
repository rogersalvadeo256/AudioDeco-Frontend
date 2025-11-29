import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

interface SidebarItemProps {
    icon: React.ComponentType<any>;
    label: string;
    path: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, path }) => {
    const { t, theme } = useTheme();
    const location = useLocation();
    const active = location.pathname === path;

    return (
        <Link
            to={path}
            className={`
                group relative flex items-center w-full p-4 mb-2 transition-all duration-300
                ${active ? t.sidebarActive : `${t.textMuted} ${t.sidebarHover}`}
            `}
        >
            {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${t.sidebarDecor}`} />}
            <Icon size={20} strokeWidth={1.5} className="mr-4" />
            <span className="uppercase tracking-[0.2em] text-xs font-semibold">{label}</span>

            <div className={`absolute bottom-0 left-4 right-4 h-[1px] ${theme === 'dark' ? 'bg-red-500/20' : 'bg-amber-500/20'} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
        </Link>
    );
};

export default SidebarItem;