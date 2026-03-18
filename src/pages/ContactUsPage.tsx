import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import emailjs from '@emailjs/browser';

export default function ContactUsPage() {
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formRef.current) return;

        setIsSubmitting(true);

        // 본인의 EmailJS 정보를 입력하세요
        const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
            .then(() => {
                alert('문의가 성공적으로 전송되었습니다!');
                formRef.current?.reset();
                navigate(-1); // 전송 후 이전 페이지로 이동
            })
            .catch((error) => {
                console.error('전송 실패:', error);
                alert('전송 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            <Helmet>
                <title>하루마블 - 문의하기</title>
                <meta name="description" content="하루마블 서비스 이용 중 궁금한 점이나 건의사항을 보내주세요." />
            </Helmet>
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 text-gray-400 hover:text-gray-800 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-lg font-bold text-gray-800">문의하기</h1>
                <div className="w-10"></div>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto w-full font-sans">
                <div className="px-6 py-8 space-y-8">
                    <section className="space-y-2">
                        <h2 className="text-xl font-bold text-gray-900">무엇을 도와드릴까요?</h2>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            여러분의 소중한 의견을 기다립니다.
                        </p>
                    </section>

                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                        {/* 폼 전송 시 현재 시간을 함께 보냅니다 */}
                        <input type="hidden" name="time" value={new Date().toLocaleString('ko-KR')} />

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 ml-1">문의 제목</label>
                            <input
                                name="title" // EmailJS 템플릿 변수와 일치시켜야 함
                                type="text"
                                required
                                placeholder="제목을 입력해 주세요"
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 ml-1">이름 / 닉네임</label>
                            <input
                                name="name" // EmailJS 템플릿 변수와 일치시켜야 함
                                type="text"
                                required
                                placeholder="성함을 입력해 주세요"
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 ml-1">회신받을 이메일</label>
                            <input
                                name="email" // EmailJS 템플릿 변수와 일치시켜야 함
                                type="email"
                                required
                                placeholder="example@email.com"
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 ml-1">문의 내용</label>
                            <textarea
                                name="message" // EmailJS 템플릿 변수와 일치시켜야 함
                                rows={5}
                                required
                                placeholder="문의하실 내용을 상세히 적어주세요."
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-4 rounded-xl text-sm font-bold shadow-lg transition-all ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                        >
                            {isSubmitting ? '전송 중...' : '문의 보내기'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}