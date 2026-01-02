import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function LandingPage() {
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

      <Link to="/app">
        <button style={{ padding: '10px 20px', fontSize: '18px', cursor: 'pointer' }}>
          유리병 채우러 가기
        </button>
      </Link>
    </div>
  );
}