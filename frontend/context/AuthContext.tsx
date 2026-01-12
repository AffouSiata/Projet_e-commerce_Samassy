'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { authApi, getAccessToken, clearTokens } from '@/lib/api';
import type { Admin } from '@/types/api';

// Interface du contexte d'authentification
interface AuthContextType {
  user: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mapping des erreurs API en français
const getErrorMessage = (error: string): string => {
  const errorMap: Record<string, string> = {
    'Email already registered': 'Cet email est déjà utilisé',
    'Invalid credentials': 'Email ou mot de passe incorrect',
    'Email not verified': 'Veuillez vérifier votre email',
    'User not found': 'Utilisateur non trouvé',
    'Password too weak': 'Le mot de passe n\'est pas assez fort',
    'Request failed': 'Erreur de connexion avec le serveur',
    'Network error': 'Erreur réseau, veuillez vérifier votre connexion',
  };

  return errorMap[error] || 'Une erreur est survenue, veuillez réessayer';
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Admin | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isInitialized = useRef(false);

  // Initialiser l'authentification au montage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getAccessToken();

        if (token) {
          // Ne pas mettre isLoading à true pour l'initialisation
          // pour ne pas bloquer l'interface
          try {
            // Vérifier la validité du token et charger l'utilisateur
            const userData = await authApi.getMe();
            setUser(userData);
            setIsAuthenticated(true);
          } catch (err) {
            // Token invalide ou expiré, nettoyer
            console.warn('Token invalide, déconnexion:', err);
            clearTokens();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (err: any) {
        console.error('Erreur d\'initialisation:', err);
        clearTokens();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        isInitialized.current = true;
      }
    };

    if (!isInitialized.current) {
      initializeAuth();
    }
  }, []);

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    console.log('🔐 Tentative de connexion pour:', email);
    try {
      setError(null);
      setIsLoading(true);
      console.log('⏳ isLoading set to true');

      console.log('📡 Appel de l\'API login...');
      const response = await authApi.login({ email, password });
      console.log('✅ Réponse API reçue:', { admin: response.admin, hasTokens: !!response.accessToken });

      setUser(response.admin);
      setIsAuthenticated(true);
      console.log('✅ Utilisateur connecté, isAuthenticated set to true');
    } catch (err: any) {
      console.error('❌ Login error:', err);

      let errorMsg = 'Erreur de connexion';

      // Gérer les différents types d'erreurs
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        errorMsg = 'Le serveur met trop de temps à répondre. Veuillez patienter quelques secondes et réessayer.';
        console.error('⏱️ Timeout détecté');
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        errorMsg = 'Erreur réseau. Vérifiez votre connexion internet.';
        console.error('🌐 Erreur réseau détectée');
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
        console.error('📝 Message d\'erreur API:', errorMsg);
      }

      setError(getErrorMessage(errorMsg));
      throw err;
    } finally {
      setIsLoading(false);
      console.log('✅ isLoading set to false (finally block)');
    }
  };

  // Fonction d'inscription
  const register = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authApi.register({ email, password, name, role: 'CLIENT' });
      setUser(response.admin);
      setIsAuthenticated(true);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erreur lors de l\'inscription';
      setError(getErrorMessage(errorMsg));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Effacer les erreurs
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur de AuthProvider');
  }
  return context;
}
