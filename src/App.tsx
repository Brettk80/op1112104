import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';

// Mock user data for development
const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  has2FAEnabled: true
};

export function App() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} mockUser={mockUser} />;
  }

  return <Dashboard user={user} />;
}