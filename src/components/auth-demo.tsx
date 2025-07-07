'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores';

export function AuthDemo() {
  // Use separate translation hooks for different namespaces
  const tAuth = useTranslations('auth');
  const tCommon = useTranslations('common');
  const { user, isAuthenticated, isLoading, login, logout } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setEmail('');
    setPassword('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tAuth('signIn')} Demo</CardTitle>
      </CardHeader>
      <CardContent>
        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                {tCommon('welcome')}, {user?.firstName} {user?.lastName}!
              </p>
              <p className="text-xs text-green-600 mt-1">
                {tAuth('email')}: {user?.email}
              </p>
            </div>
            <Button onClick={handleLogout} className="w-full">
              {tAuth('signOut')}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {tAuth('email')}
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {tAuth('password')}
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? tCommon('loading') : tAuth('signIn')}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Use any email and password to demo the login
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
