import React from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { WorkflowIcon } from './icons/WorkflowIcon';
import { CogIcon } from './icons/CogIcon';
import { ListIcon } from './icons/ListIcon';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    href: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, href }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.hash = href;
    };

    return (
        <a
            href={href}
            onClick={handleClick}
            className={`flex items-center px-4 py-3 text-lg font-medium rounded-lg transition-colors
                ${active
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
        >
            {icon}
            <span className="ml-4">{label}</span>
        </a>
    );
};

interface SidebarProps {
    currentPath: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
            <div className="h-20 flex items-center justify-center border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">
                    alpa <span className="text-red-600">v3</span>
                </h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <NavItem href="#dashboard" icon={<HomeIcon />} label="Dashboard" active={currentPath === '#dashboard'} />
                <NavItem href="#workflows" icon={<WorkflowIcon />} label="Workflows" active={currentPath === '#workflows'} />
                <NavItem href="#logs" icon={<ListIcon />} label="Logs" active={currentPath === '#logs'} />
                <NavItem href="#settings" icon={<CogIcon />} label="Settings" active={currentPath === '#settings'} />
            </nav>
            <div className="p-4 border-t border-gray-200">
                <p className="text-xs text-center text-gray-500">
                    &copy; {new Date().getFullYear()} AlpaV3 Industries
                </p>
            </div>
        </aside>
    );
};