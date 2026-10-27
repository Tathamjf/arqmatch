import { useState, type ReactNode } from 'react';
import { authService } from '../services/auth';
import type { User } from '../types/domain';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(
    authService.getCurrentUser(),
  );

  const login = async (email: string, password: string): Promise<User> => {
    const user = await authService.login(email, password);
    setCurrentUser(user);
    return user;
  };

  const register = async (
    fullName: string,
    email: string,
    password: string,
  ): Promise<User> => {
    const user = await authService.register(fullName, email, password);
    return user;
  };

  const logout = (): void => {
    authService.logout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
