import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';

// 비밀번호 유효성 검사 규칙
const PASSWORD_RULES = {
  minLength: { test: (pw: string) => pw.length >= 8, label: '8자 이상' },
  hasSpecial: {
    test: (pw: string) => /[!@#$%^&*(),.?":{}|<>\-_=+\[\]\\;'`~/]/.test(pw),
    label: '특수문자 포함',
  },
};

function getPasswordStrength(password: string): 'empty' | 'weak' | 'medium' | 'strong' {
  if (!password) return 'empty';
  const passed = Object.values(PASSWORD_RULES).filter((r) => r.test(password)).length;
  if (passed === 0) return 'weak';
  if (passed === 1) return 'medium';
  return 'strong';
}

const strengthConfig = {
  empty: { label: '', color: 'bg-gray-200', width: 'w-0', textColor: '' },
  weak: { label: '약함', color: 'bg-red-400', width: 'w-1/3', textColor: 'text-red-500' },
  medium: { label: '보통', color: 'bg-yellow-400', width: 'w-2/3', textColor: 'text-yellow-500' },
  strong: { label: '강함', color: 'bg-green-500', width: 'w-full', textColor: 'text-green-600' },
};

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const strength = getPasswordStrength(password);
  const strengthInfo = strengthConfig[strength];

  const isPasswordValid = Object.values(PASSWORD_RULES).every((r) => r.test(password));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 비밀번호 규칙 검사
    if (!isPasswordValid) {
      setError('비밀번호는 8자 이상이며 특수문자를 포함해야 합니다.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.register(email, password);
      setEmailSent(true);
    } catch (err: any) {
      setError(err.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await authApi.resendVerificationEmail(email);
      // 60초 쿨다운
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message || '재발송 중 오류가 발생했습니다.');
    }
  };

  // ── 이메일 인증 대기 화면 ──
  if (emailSent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 gap-8 md:gap-0 relative">
        <Helmet>
          <title>이메일 인증 - 하루마블</title>
        </Helmet>

        {/* 홈으로 돌아가기 */}
        <div className="w-full max-w-md md:w-auto md:absolute md:top-8 md:left-8">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity p-2 -ml-2 md:ml-0">
            <img src="/logo192.png" alt="하루마블 로고" className="w-8 h-8" />
            <span className="font-bold text-gray-900 text-lg">하루마블</span>
          </Link>
        </div>
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-6 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">이메일을 확인해주세요! 📬</h1>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              <span className="font-semibold text-gray-700">{email}</span>으로<br />
              인증 링크를 발송했습니다.<br />
              메일함을 확인하고 링크를 클릭해 인증을 완료해주세요.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg font-medium">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="w-full h-11 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0
                ? `재발송 가능까지 ${resendCooldown}초`
                : '인증 메일 다시 받기'}
            </button>

            <Link
              to="/login"
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center transition-all shadow-lg shadow-blue-200"
            >
              로그인 페이지로 이동
            </Link>
          </div>

          <p className="text-xs text-gray-400">
            스팸 메일함도 확인해보세요.
          </p>
        </div>
      </div>
    );
  }

  // ── 회원가입 폼 ──
  return (
    <div className="min-h-screen flex flex-col px-4 gap-0 md:gap-8">
      <Helmet>
        <title>회원가입 - 하루마블</title>
        <meta name="description" content="하루마블(Haru Marble)에 가입하고 오늘의 작은 성취들을 구슬로 기록해보세요." />
      </Helmet>

      {/* 홈으로 돌아가기 */}
      <div className="w-full max-w-md ">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity p-2 -ml-2 md:ml-0">
          <img src="/logo192.png" alt="하루마블 로고" className="w-8 h-8" />
          <span className="font-bold text-gray-900 text-lg">하루마블</span>
        </Link>
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">환영합니다!</h1>
          <p className="text-gray-500 mt-2">나만의 성취감을 기록할 준비가 되셨나요?</p>
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

            {/* 비밀번호 강도 인디케이터 */}
            {password && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strengthInfo.color} ${strengthInfo.width}`}
                    />
                  </div>
                  <span className={`text-xs font-medium ${strengthInfo.textColor}`}>
                    {strengthInfo.label}
                  </span>
                </div>

                {/* 규칙 체크리스트 */}
                <ul className="space-y-1">
                  {Object.entries(PASSWORD_RULES).map(([key, rule]) => {
                    const passed = rule.test(password);
                    return (
                      <li key={key} className={`flex items-center gap-1.5 text-xs ${passed ? 'text-green-600' : 'text-gray-400'}`}>
                        <span>{passed ? '✓' : '○'}</span>
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">비밀번호 확인</label>
            <input
              type="password"
              required
              className={`w-full px-4 py-3 rounded-xl border transition-all bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${confirmPassword && confirmPassword !== password
                ? 'border-red-300 focus:ring-red-400'
                : 'border-gray-200'
                }`}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPassword && confirmPassword !== password && (
              <p className="text-xs text-red-500">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-60"
          >
            {isLoading ? '처리 중...' : '가입하기'}
          </Button>
        </form>

        <div className="text-center text-gray-500 text-sm">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
