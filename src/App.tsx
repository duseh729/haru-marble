import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

// 보호된 라우트 컴포넌트
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!authApi.isAuthenticated()) {
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
              </Routes>
            </MobileLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;