import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import MobileLayout from './components/MobileLayout';
import { authApi } from './api/auth';

// 코드 스플리팅: 각 페이지를 별도 청크로 분리하여 초기 번들 크기 감소
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AppPage = lazy(() => import('./pages/AppPage'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const GuidePage = lazy(() => import('./pages/GuidePage'));
const GuideDetailPage = lazy(() => import('./pages/GuideDetailPage'));

// 페이지 로딩 중 표시할 스피너
const PageLoader = () => (
  <div className="w-full min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

// 보호된 라우트 컴포넌트 (비동기 세션 확인)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<'loading' | 'auth' | 'unauth'>('loading');

  useEffect(() => {
    authApi.isAuthenticated()
      .then((ok) => {
        setStatus(ok ? 'auth' : 'unauth');
      })
      .catch((err) => {
        console.error("인증 확인 실패:", err);
        setStatus('unauth'); // 에러 발생 시 로그인 페이지로 유도
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
  const [isRedirected, setIsRedirected] = useState(false);

  // 카카오톡 인앱 브라우저 감지 및 외부 브라우저(크롬/사파리) 오픈 유도
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isKakaoTalk = userAgent.indexOf('kakaotalk') !== -1;
    
    if (isKakaoTalk) {
      const url = window.location.href;
      setIsRedirected(true); // 안내 화면으로 상태 전환
      
      // 안드로이드: intent:// 스키마를 사용하여 크롬 브라우저 호출 유도
      if (userAgent.indexOf('android') !== -1) {
        window.location.href = `intent://${url.replace(/https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
      } 
      // 아이폰(iOS): 카카오톡 전용 클로즈 스키마 사용
      else if (userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('ipad') !== -1 || userAgent.indexOf('ipod') !== -1) {
        window.location.href = 'kakaotalk://inappbrowser/close?url=' + encodeURIComponent(url);
      }
    }
  }, []);

  // 카카오톡 브라우저에서 리다이렉트된 경우 안내 화면 렌더링
  if (isRedirected) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">외부 브라우저로 이동 중</h2>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          더 안전하고 쾌적한 로그인을 위해<br />기본 브라우저(크롬/사파리)로 이동합니다.
        </p>
        <div className="p-4 bg-gray-50 rounded-2xl w-full max-w-[280px]">
          <p className="text-xs text-gray-400">
            화면이 바뀌지 않았다면,<br />우측 상단 또는 하단의 메뉴 버튼( ⋮ )을 눌러 <br /><b>'다른 브라우저로 열기'</b>를 선택해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/guide/:slug" element={<GuideDetailPage />} />
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;