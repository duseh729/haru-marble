import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { authApi } from '@/api/auth';
import { Gem, Star, CalendarDays, ChevronRight, Plus } from 'lucide-react';
import PhysicsJar from '../components/PhysicsJar';
import { MarbleFactory } from '../utils/MarbleFactory';

export default function LandingPage() {
  const navigate = useNavigate();
  const demoRef = useRef<HTMLDivElement>(null);

  // --- 데모 상태 (서버 연동 없음, UI 전용) ---
  const [demoMarbles, setDemoMarbles] = useState<{ id: number; text: string; color?: string }[]>([]);
  const [demoInput, setDemoInput] = useState('');
  const demoIdRef = useRef(1);

  const DEMO_LIMIT = 10;

  const addDemoMarble = () => {
    const text = demoInput.trim();
    if (!text || demoMarbles.length >= DEMO_LIMIT) return;
    const id = demoIdRef.current++;
    const color = MarbleFactory.getRandomColor();
    setDemoMarbles(prev => [...prev, { id, text, color }]);
    setDemoInput('');
  };

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

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
            onClick={scrollToDemo}
            className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-1.5 text-sm border border-gray-200"
          >
            <ChevronRight className="w-4 h-4" />
            데모 보기
          </button>
        </div>

        {/* 인터랙티브 데모 */}
        <div ref={demoRef} className="mt-10 md:mt-16 mx-auto w-full max-w-[380px]">
          {/* 데모 입력 */}
          <div className="flex items-center bg-white rounded-xl p-2 shadow-sm border border-gray-200 mb-4">
            <input
              type="text"
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addDemoMarble()}
              placeholder="완료한 일을 입력해보세요!"
              className="flex-1 bg-transparent outline-none px-3 text-sm text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={addDemoMarble}
              disabled={demoMarbles.length >= DEMO_LIMIT}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded-full transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* 미니 유리병 (AppPage와 동일 크기) */}
          <div className="mx-auto w-[320px]">
            <div className="mx-auto w-[260px] h-8 bg-gray-200 rounded-xl" />
            <div className="rounded-b-[2rem] rounded-t-[50px] relative w-[320px] h-[400px] bg-white border-4 border-gray-200 shadow-lg overflow-hidden">
              <div className="absolute inset-0 flex justify-center items-end px-1">
                <PhysicsJar marbles={demoMarbles} />
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            {demoMarbles.length > 0
              ? `${demoMarbles.length}개의 구슬을 모았어요! ${demoMarbles.length >= DEMO_LIMIT ? '(데모 최대 개수 도달)' : ''}`
              : '로그인 없이 바로 체험해보세요 ✨'}
          </p>
        </div>
      </section>

      {/* --- 특별한 이유 섹션 --- */}
      <section className="px-5 md:px-12 lg:px-24 py-12 md:py-20 bg-gray-50">

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