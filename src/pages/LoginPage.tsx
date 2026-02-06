import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { socialApi } from '../api/social';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await authApi.login(email, password);
      navigate('/app');
    } catch (err: any) {
      setError(err.message || '로그인 중 오류가 발생했습니다.');
    }
  };

  const handleKakaoLogin = async () => {
    try {
      await socialApi.kakaoLogin();
    } catch (err: any) {
      setError(err.message || '카카오 로그인 중 오류가 발생했습니다.');
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
          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 focus:bg-white"
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 focus:bg-white"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full h-12 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
            로그인하기
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
