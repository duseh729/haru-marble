import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { socialApi } from '../api/social';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';

// Supabase 에러 메시지를 한국어로 변환
function translateError(message: string): string {
  if (message.includes('Invalid login credentials')) return '이메일 또는 비밀번호가 올바르지 않습니다.';
  if (message.includes('Email not confirmed')) return '이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.';
  if (message.includes('Too many requests') || message.includes('rate limit') || message.includes('over_email_send_rate_limit'))
    return '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.';
  if (message.includes('User not found')) return '등록되지 않은 이메일입니다.';
  return message;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authApi.login(email, password);
      navigate('/app');
    } catch (err: any) {
      const msg: string = err.message || '';
      const translated = translateError(msg);
      setError(translated);

      // Supabase rate limit 에러 감지
      if (
        msg.includes('Too many requests') ||
        msg.includes('rate limit') ||
        msg.includes('over_email_send_rate_limit') ||
        msg.includes('Request rate limit')
      ) {
        setIsRateLimited(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    try {
      await socialApi.kakaoLogin();
    } catch (err: any) {
      setError(err.message || '카카오 로그인 중 오류가 발생했습니다.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await socialApi.googleLogin();
    } catch (err: any) {
      setError(err.message || '구글 로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Helmet>
        <title>로그인 - Done List</title>
      </Helmet>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">돌아오셨군요! 👋</h1>
          <p className="text-gray-500 mt-2">오늘의 성취를 기록하러 가볼까요?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 에러 메시지 */}
          {error && (
            <div className={`text-sm p-3 rounded-lg text-center font-medium ${isRateLimited
                ? 'bg-orange-50 text-orange-600 border border-orange-200'
                : 'bg-red-50 text-red-500'
              }`}>
              {isRateLimited && (
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  <span className="font-semibold">로그인 일시 차단됨</span>
                </div>
              )}
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 focus:bg-white disabled:opacity-60"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 focus:bg-white disabled:opacity-60"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-60"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                로그인 중...
              </span>
            ) : '로그인하기'}
          </Button>
        </form>

        {/* 소셜 로그인 구분선 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">또는</span>
          </div>
        </div>

        {/* 소셜 로그인 버튼들 */}
        <div className="space-y-3">
          {/* 카카오 로그인 버튼 */}
          <button
            type="button"
            onClick={handleKakaoLogin}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl font-medium transition-all hover:brightness-95"
            style={{ backgroundColor: '#FEE500', color: '#000000' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.653 1.723 4.986 4.331 6.33-.187.693-.677 2.511-.775 2.902-.12.487.178.48.375.35.156-.104 2.471-1.677 3.473-2.356.51.072 1.034.11 1.596.11 5.523 0 10-3.463 10-7.336C21 6.463 17.523 3 12 3z" />
            </svg>
            카카오로 시작하기
          </button>

          {/* 구글 로그인 버튼 */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl font-medium border border-gray-300 bg-white text-gray-700 transition-all hover:bg-gray-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google로 시작하기
          </button>
        </div>

        <div className="text-center text-gray-500 text-sm">
          아직 계정이 없으신가요?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
