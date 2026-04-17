import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getGuideBySlug, guides } from '../data/guides';

const CATEGORY_COLORS: Record<string, string> = {
  '시작하기': 'bg-blue-100 text-blue-600',
  '기능 가이드': 'bg-purple-100 text-purple-600',
  '활용 팁': 'bg-green-100 text-green-600',
  '자주 묻는 질문': 'bg-amber-100 text-amber-600',
};

export default function GuideDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const guide = getGuideBySlug(slug ?? '');

  // 없는 slug면 404로
  if (!guide) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-5">
        <h1 className="text-xl font-bold text-gray-900">가이드를 찾을 수 없어요</h1>
        <p className="text-sm text-gray-500">요청한 가이드가 존재하지 않습니다.</p>
        <button
          onClick={() => navigate('/guide')}
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          가이드 목록으로
        </button>
      </div>
    );
  }

  // 다른 가이드 추천 (현재 제외, 최대 2개)
  const relatedGuides = guides.filter((g) => g.slug !== guide.slug).slice(0, 2);

  return (
    <div className="w-full min-h-screen bg-white overflow-y-auto">
      <Helmet>
        <title>{guide.title} - 하루마블 가이드</title>
        <meta name="description" content={guide.description} />
        <meta property="og:title" content={`${guide.title} - 하루마블 가이드`} />
        <meta property="og:description" content={guide.description} />
      </Helmet>

      {/* 네비게이션 */}
      <nav className="flex items-center justify-between px-5 md:px-12 lg:px-24 py-4 max-w-4xl mx-auto border-b border-gray-100">
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

      {/* 뒤로가기 + 카테고리 빵부스러기 */}
      <div className="px-5 md:px-12 lg:px-24 pt-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <button
            onClick={() => navigate('/guide')}
            className="hover:text-gray-600 transition-colors"
          >
            가이드
          </button>
          <span>/</span>
          <span className="text-gray-600 font-medium">{guide.title}</span>
        </div>
      </div>

      {/* 아티클 헤더 */}
      <header className="px-5 md:px-12 lg:px-24 pt-8 pb-10 max-w-4xl mx-auto">
        <span
          className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full mb-4 ${CATEGORY_COLORS[guide.category] ?? 'bg-gray-100 text-gray-500'}`}
        >
          {guide.category}
        </span>
        <div className="flex items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
              {guide.title}
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
              {guide.description}
            </p>
            <p className="text-xs text-gray-400 mt-3">⏱ 약 {guide.readTime}분 읽기</p>
          </div>
        </div>
      </header>

      {/* 본문 */}
      <main className="px-5 md:px-12 lg:px-24 pb-16 max-w-4xl mx-auto">
        <div className="border-t border-gray-100 pt-10 space-y-12">
          {guide.sections.map((section, idx) => (
            <article key={idx}>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
                {section.heading}
              </h2>
              <div className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {section.body}
              </div>
              {section.tip && (
                <div className="mt-5 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-xl">
                  <p className="text-xs font-bold text-blue-600 mb-1">💡 TIP</p>
                  <p className="text-sm text-blue-800 leading-relaxed">{section.tip}</p>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* 다른 가이드 추천 */}
        {relatedGuides.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-4">다른 가이드도 읽어보세요</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedGuides.map((g) => (
                <button
                  key={g.slug}
                  onClick={() => navigate(`/guide/${g.slug}`)}
                  className="text-left p-5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-2xl transition-all group"
                >
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {g.title}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {g.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl px-6 py-8 text-center">
          <p className="text-white font-bold text-lg mb-2">이제 직접 해볼 차례예요!</p>
          <p className="text-blue-100 text-sm mb-5">무료로 시작하고 오늘의 첫 구슬을 모아보세요.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-white hover:bg-gray-50 text-blue-600 font-bold px-7 py-2.5 rounded-xl text-sm transition-colors shadow-lg"
          >
            무료로 시작하기
          </button>
        </div>
      </main>

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
