import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFoundPage() {
    return (
        <div className="flex flex-col h-full bg-white relative items-center justify-center text-center px-6">
            <Helmet>
                <title>페이지를 찾을 수 없습니다 - 하루마블</title>
                <meta name="description" content="요청하신 페이지를 찾을 수 없습니다." />
            </Helmet>
            
            <div className="mb-6 text-6xl">🔍</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                페이지를 찾을 수 없습니다
            </h1>
            <p className="text-gray-500 mb-8 leading-relaxed max-w-xs break-keep">
                주소가 잘못 입력되었거나, 변경 혹은 삭제되어 요청하신 페이지를 찾을 수 없습니다.
            </p>
            
            <Link
                to="/"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors text-sm shadow-lg shadow-blue-500/25"
            >
                홈으로 돌아가기
            </Link>
        </div>
    );
}
