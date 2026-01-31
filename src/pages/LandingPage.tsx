import { useNavigate } from 'react-router-dom'; // Link 대신 useNavigate 사용
import { Helmet } from 'react-helmet-async';
import { authApi } from '@/api/auth'; // authApi가 저장된 경로로 import 하세요 (예: @/lib/auth)

export default function LandingPage() {
  const navigate = useNavigate();

  // 버튼 클릭 핸들러
  const handleStartClick = async () => {
    try {
      // 1. Supabase 세션 확인
      const isLoggined = await authApi.isAuthenticated();

      // 2. 로그인 상태에 따라 분기 처리
      if (isLoggined) {
        navigate('/app');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error("인증 확인 중 오류 발생:", error);
      navigate('/login'); // 에러 발생 시 로그인 페이지로 이동 (안전장치)
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {/* SEO 메타 태그 설정 */}
      <Helmet>
        <title>Done List - 성취감을 채우는 유리병</title>
        <meta name="description" content="오늘 한 일을 기록하고 유리병에 구슬을 채워보세요. 시각적인 성취감을 드립니다." />
        <meta property="og:title" content="Done List" />
        <meta property="og:description" content="나만의 성취감 유리병 채우기" />
      </Helmet>

      <h1>🔮 Done List</h1>
      <p>오늘 하루, 얼마나 많은 구슬을 모으셨나요?</p>

      {/* 여기에 나중에 꽉 찬 유리병 GIF 이미지를 넣으세요 */}
      <div style={{ margin: '50px 0', fontSize: '50px' }}>🏺</div>

      {/* Link 태그를 제거하고 button에 onClick 이벤트를 연결합니다 */}
      <button
        onClick={handleStartClick}
        style={{ padding: '10px 20px', fontSize: '18px', cursor: 'pointer' }}
      >
        유리병 채우러 가기
      </button>
    </div>
  );
}