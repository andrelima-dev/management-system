import React from 'react';
import { Outlet } from "@tanstack/react-router"
import { useAuth } from './stores/authStore';
import { Header } from './components/Header';
// import { SocketListener } from './components/SocketListener';

export function App() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {isAuthenticated && <Header />}
      {/* {isAuthenticated && <SocketListener />} */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
