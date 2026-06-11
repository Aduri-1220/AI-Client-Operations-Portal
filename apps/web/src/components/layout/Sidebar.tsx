'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, FolderOpen, CheckSquare, FileText,
  ClipboardCheck, Bot, BarChart3, Settings, ChevronLeft
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/approvals', label: 'Approvals', icon: ClipboardCheck },
  { href: '/ai-assistant', label: 'AI Assistant', icon: Bot },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      'flex flex-col h-full bg-gray-900 text-white transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <span className="font-bold text-sm">AI Ops Portal</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn('p-1.5 rounded-lg hover:bg-gray-700 transition-colors', collapsed && 'mx-auto')}
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 py-4 border-t border-gray-700">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors',
            collapsed && 'justify-center px-2'
          )}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {!collapsed && 'Settings'}
        </Link>
      </div>
    </aside>
  );
}
