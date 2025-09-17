import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { authService } from '../services/authService';

export interface User {
  uk_usuario: string;
  s_nombre: string;
  s_usuario: string;
  s_correo_electronico: string;
  tipo_usuario: number;
  uk_cliente?: string;
  token: string;
}

export interface LoginCredentials {
  s_usuario: string;
  s_contrasena: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshToken: () => Promise<void>;
  hasPermission: (requiredRole?: number[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay un token guardado al inicializar
  useEffect(() => {
    const initializeAuth = async () => {
      const token = Cookies.get('authToken');
      if (token) {
        try {
          const response = await authService.refreshToken(token);
          
          const userData: User = {
            uk_usuario: response.uk_usuario,
            s_nombre: response.s_nombre,
            s_usuario: response.s_usuario,
            s_correo_electronico: response.s_correo_electronico,
            tipo_usuario: response.tipo_usuario,
            uk_cliente: response.uk_cliente,
            token: response.token
          };

          setUser(userData);
          
          // Actualizar token en cookies
          Cookies.set('authToken', response.token, { 
            expires: 7, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          });
          
          localStorage.setItem('userData', JSON.stringify(userData));
        } catch (error) {
          console.error('Error initializing auth:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      const userData: User = {
        uk_usuario: response.uk_usuario,
        s_nombre: response.s_nombre,
        s_usuario: response.s_usuario,
        s_correo_electronico: response.s_correo_electronico,
        tipo_usuario: response.tipo_usuario,
        uk_cliente: response.uk_cliente,
        token: response.token
      };

      setUser(userData);
      
      // Guardar token en cookies (7 días)
      Cookies.set('authToken', response.token, { 
        expires: 7, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      // Guardar datos del usuario en localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/signin';
  };

  const refreshToken = async () => {
    try {
      const token = Cookies.get('authToken');
      if (!token) {
        throw new Error('No token available');
      }

      const response = await authService.refreshToken(token);
      
      const userData: User = {
        uk_usuario: response.uk_usuario,
        s_nombre: response.s_nombre,
        s_usuario: response.s_usuario,
        s_correo_electronico: response.s_correo_electronico,
        tipo_usuario: response.tipo_usuario,
        uk_cliente: response.uk_cliente,
        token: response.token
      };

      setUser(userData);
      
      // Actualizar token en cookies
      Cookies.set('authToken', response.token, { 
        expires: 7, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      // Actualizar datos del usuario en localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
      
    } catch (error) {
      console.error('Refresh token error:', error);
      logout();
      throw error;
    }
  };

  // Verificar permisos basado en tipo de usuario
  const hasPermission = (requiredRole?: number[]): boolean => {
    if (!user) return false;
    if (!requiredRole || requiredRole.length === 0) return true;
    return requiredRole.includes(user.tipo_usuario);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
    refreshToken,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 