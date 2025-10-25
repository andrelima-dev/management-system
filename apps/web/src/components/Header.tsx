import React from 'react';
import { useAuth } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-primary">📋 Jungle Tasks</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">{user.displayName}</p>
            <p className="text-xs">{user.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
