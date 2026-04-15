import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus } from 'lucide-react';
import PhysicsJar from '../components/PhysicsJar';
import GlassJar from '../components/GlassJar';
import { MarbleFactory } from '../utils/MarbleFactory';
import { authApi } from '../api/auth';

export default function LandingPage() {
  const navigate = useNavigate();
  const demoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    authApi.isAuthenticated().then(ok => {
      if (ok) navigate('/app');
    });
  }, [navigate]);

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



  const handleStartClick = () => {
    // 가장 빠른 사용자 경험을 위해 즉시 /login으로 보냅니다.
    // 이미 로그인되어 있다면 로그인 페이지 내부 로직이 자동으로 /app으로 보내줄 것입니다.
    navigate('/login');
  };

  return (
    <div className="w-full min-h-screen bg-white overflow-y-auto">
      <Helmet>
        <title>하루마블 - 오늘의 성취를 구슬로 시각화하다</title>
        <meta name="description" content="오늘 한 일을 기록하고 유리병에 구슬을 채워보세요. 시각적인 성취감을 드립니다." />
        <meta property="og:title" content="하루마블" />
        <meta property="og:description" content="오늘의 성취를 구슬로 시각화하다" />
      </Helmet>

      {/* --- 네비게이션 --- */}
      <nav className="flex items-center justify-between px-5 md:px-12 lg:px-24 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <img src="/logo192.png" alt="하루마블 로고" className="w-10 h-10" />
          <span className="font-bold text-gray-900">하루마블</span>
        </div>
        <div className="flex items-center gap-4">
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
            <img src="/logo192.png" alt="로고" className="w-5 h-5 rounded-md mix-blend-screen opacity-90" />
            무료로 시작하기
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
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
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
          <GlassJar className="mx-auto">
            <PhysicsJar marbles={demoMarbles} />
          </GlassJar>

          <p className="text-xs text-gray-400 mt-3">
            {demoMarbles.length > 0
              ? `${demoMarbles.length}개의 구슬을 모았어요! ${demoMarbles.length >= DEMO_LIMIT ? '(데모 최대 개수 도달)' : ''}`
              : '로그인 없이 바로 체험해보세요 ✨'}
          </p>
        </div>
      </section>

      {/* --- before & after 섹션 --- */}
      <section className="px-5 md:px-12 lg:px-24 py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
              평범한 체크리스트는 이제 그만
            </h2>
            <p className="text-gray-500 text-sm md:text-base break-keep">
              할 일을 지우는 것에서 그치지 말고, 아름다운 구슬로 성취를 쌓아보세요.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 w-full max-w-4xl">
            {/* Before: 기존 투두리스트 */}
            <div className="w-full flex-1 max-w-[320px] flex flex-col items-center">
              <div className="text-gray-400 font-bold mb-4 flex items-center gap-2">
                <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-1 rounded font-bold tracking-wider">BEFORE</span>
                <span className="text-sm">지루한 텍스트</span>
              </div>
              <div className="w-full bg-white border border-gray-200 rounded-3xl p-6 shadow-sm aspect-9/16 flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">오늘 할 일</h3>
                <div className="space-y-4">
                  {[
                    { text: '알고리즘 1문제 풀기', done: true },
                    { text: '물 2L 마시기', done: true },
                    { text: '스트레칭 10분', done: true },
                    { text: '블로그 포스팅', done: false },
                    { text: '방 청소하기', done: false },
                  ].map((todo, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${todo.done ? 'bg-gray-200' : 'border border-gray-300'}`}>
                        {todo.done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className={`text-sm ${todo.done ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>{todo.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* VS Badge */}
            <div className="bg-white text-gray-400 font-bold w-12 h-12 rounded-full flex items-center justify-center shadow-md border border-gray-100 z-10 -my-4 md:my-0 shrink-0">
              VS
            </div>

            {/* After: 하루마블 */}
            <div className="w-full flex-1 max-w-[320px] flex flex-col items-center">
              <div className="text-blue-500 font-bold mb-4 flex items-center gap-2">
                <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded font-bold tracking-wider">AFTER</span>
                <span className="text-sm">눈에 보이는 성취</span>
              </div>
              <div className="w-full bg-white rounded-3xl shadow-xl overflow-hidden aspect-9/16 flex items-center justify-center border-4 border-blue-50 relative">
                <img src="/serviceInfo.png" alt="하루마블 서비스 화면" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA 섹션 --- */}
      <section className="mx-5 md:mx-auto mb-8 md:mb-16 max-w-3xl bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl px-6 md:px-12 py-10 md:py-14 text-center">
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
      <footer className="px-5 md:px-12 lg:px-24 py-12 border-t border-gray-100 max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img src="/logo192.png" alt="하루마블 로고" className="w-7 h-7" />
            <span className="font-bold text-sm text-gray-900">하루마블</span>
          </div>
          <p className="text-xs text-gray-400">오늘의 성취를 담는 유리병</p>
        </div>

        <div className="flex gap-4 md:gap-6 text-xs text-gray-500">
          <button onClick={() => navigate('/about-us')} className="hover:text-gray-900 transition-colors">서비스 소개</button>
          <button onClick={() => navigate('/privacy')} className="hover:text-gray-900 transition-colors">개인정보처리방침</button>
          <button onClick={() => navigate('/contact-us')} className="hover:text-gray-900 transition-colors">문의하기</button>
        </div>

        <p className="text-xs text-gray-300">© 2026 하루마블. All rights reserved.</p>
      </footer>
    </div>
  );
}