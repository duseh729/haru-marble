import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function AboutUsPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full bg-white relative">
            <Helmet>
                <title>서비스 소개 - 하루마블</title>
                <meta name="description" content="하루마블(Haru Marble)의 탄생 배경과 미션을 소개합니다. 당신의 작은 성취를 시각적인 즐거움으로 바꿔보세요." />
            </Helmet>
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 text-gray-400 hover:text-gray-800 transition-colors"
                    aria-label="뒤로가기"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-lg font-bold text-gray-800">서비스 소개</h1>
                <div className="w-10"></div>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto w-full">
                <div className="px-6 py-8 space-y-10 text-gray-700 font-sans">

                    {/* Mission Section */}
                    <section className="text-center space-y-4">
                        <div className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold mb-2">
                            Our Mission
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 break-keep">
                            당신의 작은 성취를 <br /> 시각적인 즐거움으로 바꿉니다.
                        </h2>
                        <p className="text-sm leading-relaxed text-gray-600 break-keep">
                            단순히 체크박스를 채우는 투두리스트는 지루할 수 있습니다. <br />
                            <strong>하루마블(Haru Marble)</strong>은 할 일을 마칠 때마다 예쁜 구슬이 쌓이는 경험을 통해,
                            보이지 않는 노력을 시각화하고 일상의 성취감을 극대화하기 위해 탄생했습니다.
                        </p>
                    </section>

                    {/* Features Section */}
                    <section className="grid grid-cols-1 gap-4">
                        <div className="p-5 bg-gray-50 rounded-2xl">
                            <h3 className="font-bold text-gray-800 mb-2">🔮 물리 엔진 기반의 성취감</h3>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Matter.js 물리 엔진을 활용하여, 완료한 할 일이 유리병 속에 실시간으로 쌓이는 역동적인 경험을 제공합니다.
                            </p>
                        </div>
                        <div className="p-5 bg-gray-50 rounded-2xl">
                            <h3 className="font-bold text-gray-800 mb-2">📱 사용자 중심의 간결한 UI</h3>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                복잡한 기능은 덜어내고, 오직 오늘의 목표에만 집중할 수 있는 모바일 최적화 레이아웃을 지향합니다.
                            </p>
                        </div>
                    </section>

                    {/* Developer Section */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-2">만든 사람</h3>
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-linear-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-2xl">
                                👨‍💻
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-base">안도연</p>
                                <p className="text-xs text-gray-500">Frontend & Product Developer</p>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-600 break-keep">
                            일상 속의 불편함을 소프트웨어 기술로 정의하고 해결하는 과정에서 즐거움을 느낍니다.
                            사용자의 피드백을 바탕으로 더 나은 사용자 경험을 만들기 위해 끊임없이 고민하고 실험합니다.
                        </p>
                    </section>

                    {/* Future Vision */}
                    <section className="bg-blue-600 rounded-2xl p-6 text-white text-center">
                        <h3 className="text-lg font-bold mb-2">Next Step</h3>
                        <p className="text-xs opacity-90 leading-relaxed break-keep">
                            현재는 웹 기반의 서비스를 제공하고 있으며, 곧 모바일 앱 개발을 통해
                            친구들과 성취를 공유할 수 있는 소셜 기능을 준비 중입니다.
                        </p>
                    </section>

                    {/* Footer Info */}
                    <footer className="pt-8 text-center border-t border-gray-100">
                        <p className="text-xs text-gray-400">
                            문의: <a href="mailto:dev.ahndy@gmail.com" className="underline">dev.ahndy@gmail.com</a>
                        </p>
                        <p className="text-[10px] text-gray-300 mt-2 uppercase tracking-widest">
                            © 2026 HARU MARBLE. All rights reserved.
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
}