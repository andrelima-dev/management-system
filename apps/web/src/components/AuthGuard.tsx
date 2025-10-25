import React from 'react';
import { useAuth } from '@/stores/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return fallback || <div className="p-4">Você precisa estar autenticado</div>;
  }

  return <>{children}</>;
}
