import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { LogOut, Users } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3 flex-1">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer" onClick={() => navigate({ to: '/tasks' })}>Tasks</h1>
          
          {/* Navigation Links */}
          <nav className="flex items-center gap-6 ml-8">
            <button 
              onClick={() => navigate({ to: '/tasks' })}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Tarefas
            </button>
            <button 
              onClick={() => navigate({ to: '/team' })}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Equipe
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-700">
            <p className="font-semibold">{user.displayName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            title="Sair"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
