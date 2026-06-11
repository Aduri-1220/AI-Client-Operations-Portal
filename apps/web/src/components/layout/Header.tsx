'use client';
import { Bell, Search, LogOut, User } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {title && <h1 className="text-lg font-semibold text-gray-900">{title}</h1>}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </button>

          {showMenu && (
            <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-lg w-48 py-1 z-50">
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/auth/login';
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
