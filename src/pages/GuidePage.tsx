import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { guides } from '../data/guides';

const CATEGORY_COLORS: Record<string, string> = {
  '시작하기': 'bg-blue-100 text-blue-600',
  '기능 가이드': 'bg-purple-100 text-purple-600',
  '활용 팁': 'bg-green-100 text-green-600',
  '자주 묻는 질문': 'bg-amber-100 text-amber-600',
};

export default function GuidePage() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-white overflow-y-auto">
      <Helmet>
        <title>이용 가이드 - 하루마블</title>
        <meta
          name="description"
          content="하루마블 사용 방법을 단계별로 안내합니다. 시작하기부터 생산성 팁, 자주 묻는 질문까지 모든 것을 알아보세요."
        />
        <meta property="og:title" content="이용 가이드 - 하루마블" />
        <meta property="og:description" content="하루마블을 100% 활용하는 방법을 알아보세요." />
      </Helmet>

      {/* 네비게이션 */}
      <nav className="flex items-center justify-between px-5 md:px-12 lg:px-24 py-4 max-w-6xl mx-auto border-b border-gray-100">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img src="/logo192.png" alt="하루마블 로고" className="w-8 h-8" />
          <span className="font-bold text-gray-900">하루마블</span>
        </button>
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          시작하기 →
        </button>
      </nav>

      {/* 헤더 */}
      <section className="px-5 md:px-12 lg:px-24 pt-12 pb-10 max-w-4xl mx-auto text-center">
        <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold mb-4 tracking-wide">
          GUIDE
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          이용 가이드
        </h1>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed">
          하루마블을 처음 시작하는 방법부터 생산성을 높이는 팁까지,<br />
          원하는 주제를 선택해 읽어보세요.
        </p>
      </section>

      {/* 가이드 카드 목록 */}
      <section className="px-5 md:px-12 lg:px-24 pb-20 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guides.map((guide) => (
            <button
              key={guide.slug}
              onClick={() => navigate(`/guide/${guide.slug}`)}
              className="text-left p-6 bg-white border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/10 transition-all group"
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {guide.title}
                </h2>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${CATEGORY_COLORS[guide.category] ?? 'bg-gray-100 text-gray-500'}`}
                >
                  {guide.category}
                </span>
              </div>

              {/* 설명 */}
              <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                {guide.description}
              </p>

              {/* 하단: 읽기 시간 + 화살표 */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  ⏱ 약 {guide.readTime}분 읽기
                </span>
                <span className="text-blue-500 text-sm font-semibold group-hover:translate-x-1 transition-transform inline-block">
                  읽기 →
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-5 md:mx-auto mb-16 max-w-3xl bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl px-6 md:px-12 py-10 text-center">
        <h2 className="text-xl md:text-2xl font-extrabold text-white mb-2">
          바로 시작해보세요
        </h2>
        <p className="text-blue-100 text-sm mb-6">
          가이드를 읽었으니 이제 직접 경험할 차례입니다.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-white hover:bg-gray-50 text-blue-600 font-bold px-8 py-3 rounded-xl transition-colors text-sm shadow-lg"
        >
          무료로 시작하기
        </button>
      </section>

      {/* 푸터 */}
      <footer className="px-5 md:px-12 lg:px-24 py-10 border-t border-gray-100 max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/logo192.png" alt="하루마블 로고" className="w-6 h-6" />
          <span className="font-bold text-sm text-gray-900">하루마블</span>
        </div>
        <div className="flex gap-4 text-xs text-gray-500">
          <button onClick={() => navigate('/about-us')} className="hover:text-gray-900 transition-colors">서비스 소개</button>
          <button onClick={() => navigate('/privacy')} className="hover:text-gray-900 transition-colors">개인정보처리방침</button>
          <button onClick={() => navigate('/contact-us')} className="hover:text-gray-900 transition-colors">문의하기</button>
        </div>
        <p className="text-xs text-gray-300">© 2026 하루마블. All rights reserved.</p>
      </footer>
    </div>
  );
}
