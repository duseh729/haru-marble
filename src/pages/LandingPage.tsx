import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { authApi } from '@/api/auth';
import { Gem, Star, CalendarDays, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleStartClick = async () => {
    try {
      const isLoggined = await authApi.isAuthenticated();
      if (isLoggined) {
        navigate('/app');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error("인증 확인 중 오류 발생:", error);
      navigate('/login');
    }
  };

  return (
    <div className="w-full min-h-dvh bg-white overflow-y-auto">
      <Helmet>
        <title>하루마블 - 오늘의 성취를 구슬로 시각화하다</title>
        <meta name="description" content="오늘 한 일을 기록하고 유리병에 구슬을 채워보세요. 시각적인 성취감을 드립니다." />
        <meta property="og:title" content="하루마블" />
        <meta property="og:description" content="오늘의 성취를 구슬로 시각화하다" />
      </Helmet>

      {/* --- 네비게이션 --- */}
      <nav className="flex items-center justify-between px-5 md:px-12 lg:px-24 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
            <Gem className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">하루마블</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-6 mr-4">
            <span className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer transition-colors">기능</span>
            <span className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer transition-colors">스크린샷</span>
            <span className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer transition-colors">다운로드</span>
          </div>
          <button
            onClick={handleStartClick}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            시작하기 →
          </button>
        </div>
      </nav>

      {/* --- 히어로 섹션 --- */}
      <section className="px-5 md:px-12 lg:px-24 pt-10 md:pt-20 pb-12 md:pb-20 text-center max-w-4xl mx-auto">
        <h1 className="text-[2rem] md:text-5xl leading-tight font-extrabold text-gray-900 mb-4 md:mb-6">
          오늘의 성취를<br />
          <span className="text-blue-500">구슬로 시각화</span>하다
        </h1>
        <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-8 max-w-[320px] md:max-w-md mx-auto">
          체크리스트가 아닌, 유리구슬로 기록합니다.<br />
          할 일을 완료할 때마다 유리구슬이 쌓이는<br className="md:hidden" />
          시각적 즐거움을 경험하세요.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleStartClick}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-1.5 text-sm shadow-lg shadow-blue-500/25"
          >
            <Gem className="w-4 h-4" />
            무료로 시작하기
          </button>
          <button
            onClick={handleStartClick}
            className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-1.5 text-sm border border-gray-200"
          >
            <ChevronRight className="w-4 h-4" />
            데모 보기
          </button>
        </div>

        {/* 앱 스크린샷 미리보기 */}
        <div className="mt-10 md:mt-16 mx-auto w-full max-w-[500px] h-[200px] md:h-[300px] bg-gradient-to-b from-blue-50 to-blue-100/50 rounded-2xl flex items-center justify-center border border-blue-100">
          <div className="text-center">
            <div className="text-4xl md:text-6xl mb-2">🏺</div>
            <p className="text-xs md:text-sm text-blue-400">앱 스크린샷 영역</p>
          </div>
        </div>
      </section>

      {/* --- 특별한 이유 섹션 --- */}
      <section className="px-5 md:px-12 lg:px-24 py-12 md:py-20 bg-gray-50">
        <div className="text-center mb-8 md:mb-12 max-w-4xl mx-auto">
          <span className="text-xs font-semibold text-blue-500 tracking-wider uppercase">핵심 기능</span>
          <h2 className="text-xl md:text-3xl font-extrabold text-gray-900 mt-2">하루마블이 특별한 이유</h2>
          <p className="text-xs md:text-sm text-gray-400 mt-2">단순한 투두리스트를 넘어선 시각적 성취 경험</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5 max-w-4xl mx-auto">
          {/* 기능 1 */}
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
              <Gem className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1">유리구슬 비주얼</h3>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              할 일을 완료할 때마다 예쁜 유리구슬을 모아 구슬을 모으는 즐거움을 느껴요.
            </p>
          </div>

          {/* 기능 2 */}
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-50 rounded-xl flex items-center justify-center mb-3">
              <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1">퀵 액션</h3>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              자주 하는 일을 빠르게 등록하고 효율적으로 한 일을 기록해요.
            </p>
          </div>

          {/* 기능 3 */}
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-xl flex items-center justify-center mb-3">
              <CalendarDays className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1">컬렉션 보관</h3>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              한 병이 차면 선반에 보관하고 특별한 컬렉션을 확인하는 즐거움도 있어요.
            </p>
          </div>
        </div>
      </section>

      {/* --- 스크린샷 미리보기 섹션 --- */}
      <section className="px-5 md:px-12 lg:px-24 py-12 md:py-20">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-xs font-semibold text-blue-500 tracking-wider uppercase">스크린샷</span>
          <h2 className="text-xl md:text-3xl font-extrabold text-gray-900 mt-2">직관적이고 아름다운 디자인</h2>
        </div>

        <div className="flex gap-3 md:gap-5 overflow-x-auto md:overflow-visible md:justify-center pb-2 -mx-1 px-1 snap-x">
          {[
            { label: '구슬 모으기', emoji: '🔮', bg: 'from-blue-50 to-indigo-50' },
            { label: '컬렉션 보기', emoji: '🏺', bg: 'from-purple-50 to-pink-50' },
            { label: '통계 확인', emoji: '📊', bg: 'from-green-50 to-emerald-50' },
          ].map((item) => (
            <div
              key={item.label}
              className={`shrink-0 w-[140px] md:w-[200px] h-[200px] md:h-[280px] bg-gradient-to-b ${item.bg} rounded-2xl flex flex-col items-center justify-center snap-start border border-gray-100`}
            >
              <div className="text-3xl md:text-5xl mb-3">{item.emoji}</div>
              <span className="text-xs md:text-sm font-medium text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- CTA 섹션 --- */}
      <section className="mx-5 md:mx-auto mb-8 md:mb-16 max-w-3xl bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl px-6 md:px-12 py-10 md:py-14 text-center">
        <h2 className="text-xl md:text-3xl font-extrabold text-white mb-2">지금 바로 시작하세요</h2>
        <p className="text-blue-100 text-xs md:text-sm mb-6">매일의 성취를 기록하고, 오늘의 성취를 남겨보세요.</p>
        <button
          onClick={handleStartClick}
          className="bg-white hover:bg-gray-50 text-blue-600 font-bold px-8 py-3 rounded-xl transition-colors text-sm md:text-base shadow-lg"
        >
          무료로 시작하기
        </button>
      </section>

      {/* --- 푸터 --- */}
      <footer className="px-5 md:px-12 lg:px-24 py-8 border-t border-gray-100 max-w-6xl mx-auto md:flex md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
              <Gem className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-sm text-gray-900">하루마블</span>
          </div>
          <p className="text-xs text-gray-400">오늘의 성취를 담는 유리병</p>
        </div>
        <p className="text-xs text-gray-300 mt-4 md:mt-0">© 2025 하루마블. All rights reserved.</p>
      </footer>
    </div>
  );
}