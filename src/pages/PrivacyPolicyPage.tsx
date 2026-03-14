import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicyPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full bg-white relative">
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
                <h1 className="text-lg font-bold text-gray-800">개인정보처리방침</h1>
                <div className="w-10"></div> {/* For centering */}
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto w-full">
                <div className="px-6 py-8 space-y-6 text-sm text-gray-700 leading-relaxed font-sans">

                    <section>
                        <p className="font-semibold text-gray-800 mb-2">프롤로그</p>
                        <p className="text-gray-600">
                            '하루마블'(이하 '서비스')은(는) 이용자의 개인정보를 중요시하며, "정보통신망 이용촉진 및 정보보호"에 관한 법률 및 "개인정보보호법"을 준수하고 있습니다. 본 개인정보처리방침을 통하여 이용자께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-gray-800 mb-2">1. 수집하는 개인정보 항목</h2>
                        <p className="text-gray-600 mb-2">서비스는 회원가입, 원활한 서비스 제공을 위해 아래와 같은 최소한의 개인정보를 수집하고 있습니다.</p>
                        <ul className="list-disc pl-5 text-gray-600 space-y-1">
                            <li>회원가입 시: 이메일, 닉네임, 프로필 이미지 (소셜 로그인 시 제공받는 정보 포함)</li>
                            <li>서비스 이용 시: 접속 로그, 쿠키, 서비스 이용 기록(완료한 할 일 목록, 구슬 데이터 등), 접속 IP 정보, 기기 정보</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-gray-800 mb-2">2. 개인정보의 수집 및 이용 목적</h2>
                        <p className="text-gray-600 mb-2">수집한 개인정보는 다음의 목적을 위해 활용합니다.</p>
                        <ul className="list-disc pl-5 text-gray-600 space-y-1">
                            <li>서비스 제공: 할 일 관리 단기/장기 목표 달성 데이터 기록(하루마블) 및 연동 기능 제공</li>
                            <li>회원 관리: 회원제 서비스 이용에 따른 본인확인, 가입 의사 확인, 부정이용 방지와 비인가 사용 방지, 불만처리 등 민원처리</li>
                            <li>통계 및 분석: 신규 서비스 개발, 접속 빈도 파악, 회원의 서비스 이용에 대한 통계 제공</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-gray-800 mb-2">3. 개인정보의 보유 및 이용 기간</h2>
                        <p className="text-gray-600">
                            원칙적으로, 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 서비스는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
                        </p>
                        <ul className="list-disc pl-5 text-gray-600 space-y-1 mt-2">
                            <li>보존 항목: 로그인 기록, 결제 기록(해당되는 경우), 서비스 이용기록</li>
                            <li>보존 근거: 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 통신비밀보호법</li>
                            <li>보존 기간: 3개월 ~ 1년 (법령 기준에 따름)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-gray-800 mb-2">4. 개인정보의 파기절차 및 방법</h2>
                        <p className="text-gray-600 mb-2">이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다.</p>
                        <ul className="list-disc pl-5 text-gray-600 space-y-1">
                            <li><span className="font-semibold">파기절차:</span> 목적이 달성된 정보는 즉시 파기하거나, 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조) 일정 기간 저장된 후 파기됩니다.</li>
                            <li><span className="font-semibold">파기방법:</span> 전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-gray-800 mb-2">5. 이용자 및 법정대리인의 권리와 그 행사방법</h2>
                        <p className="text-gray-600">
                            이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 가입해지(동의철회, 회원탈퇴)를 요청할 수도 있습니다. 개인정보 조회, 수정 혹은 탈퇴를 원하시는 경우 서비스 내 '환경설정'의 '탈퇴하기' 또는 '로그아웃' 기능을 이용하거나, 관리자에게 이메일로 연락하시면 지체 없이 조치하겠습니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-gray-800 mb-2">6. 쿠키 및 제3자 광고 게재에 관한 사항</h2>
                        <p className="text-gray-600 mb-2">
                            서비스는 이용자에게 적합하고 유용한 서비스를 제공하기 위해서 이용자의 정보를 저장하고 수시로 불러오는 ‘쿠키(cookie)’를 사용합니다.
                        </p>
                        <ul className="list-disc pl-5 text-gray-600 space-y-2">
                            <li>Google을 포함한 제3자 제공업체는 이용자가 본 웹사이트 또는 다른 웹사이트를 이전에도 방문했다는 사실을 근거로 쿠키를 사용하여 광고를 게재합니다.</li>
                            <li>Google은 광고 쿠키를 사용하여 이용자가 본 사이트 및 인터넷상의 다른 사이트를 방문한 정보를 토대로 Google 및 파트너사가 이용자에게 광고를 게재할 수 있게 합니다.</li>
                            <li>이용자는 <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="underline text-blue-500">Google 광고 설정</a>을 방문하여 맞춤설정 광고를 게재하지 않도록 설정할 수 있습니다.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-gray-800 mb-2">7. 개인정보 보호책임자</h2>
                        <p className="text-gray-600">
                            서비스는 고객의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이 개인정보보호책임자를 지정하고 있습니다.
                        </p>
                        <div className="bg-gray-50 p-4 rounded-xl mt-3 text-sm">
                            <p className="font-medium text-gray-700">하루마블 운영팀</p>
                            <a href="mailto:dev.ahndy@gmail.com" className="text-blue-500 underline">dev.ahndy@gmail.com</a>
                        </div>
                    </section>

                    <section className="pt-4 border-t border-gray-100">
                        <p className="text-gray-500 text-xs text-center">
                            본 웹사이트의 개인정보처리방침은 2026년 3월 14일부터 시행됩니다.
                        </p>
                    </section>

                </div>
            </main>
        </div>
    );
}
