import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AppPage from './pages/AppPage';
import CollectionPage from './pages/CollectionPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
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
        <Route path="/login" element={<MobileLayout><LoginPage /></MobileLayout>} />
        <Route path="/register" element={<MobileLayout><RegisterPage /></MobileLayout>} />
        <Route
          path="/app"
          element={
            <MobileLayout>
              <ProtectedRoute>
                <AppPage />
              </ProtectedRoute>
            </MobileLayout>
          }
        />
        <Route
          path="/collection"
          element={
            <MobileLayout>
              <ProtectedRoute>
                <CollectionPage />
              </ProtectedRoute>
            </MobileLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;