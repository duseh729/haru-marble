import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AppPage from './pages/AppPage';
import CollectionPage from './pages/CollectionPage';
import SettingsPage from './pages/SettingsPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import MobileLayout from './components/MobileLayout';
import { authApi } from './api/auth';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import NotFoundPage from './pages/NotFoundPage';

// 보호된 라우트 컴포넌트 (비동기 세션 확인)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<'loading' | 'auth' | 'unauth'>('loading');

  useEffect(() => {
    authApi.isAuthenticated().then((ok) => {
      setStatus(ok ? 'auth' : 'unauth');
    });
  }, []);

  if (status === 'loading') {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === 'unauth') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="*"
          element={
            <MobileLayout>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/about-us" element={<AboutUsPage />} />
                <Route path="/contact-us" element={<ContactUsPage />} />
                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <AppPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/collection"
                  element={
                    <ProtectedRoute>
                      <CollectionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                {/* 404 Not Found */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </MobileLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;