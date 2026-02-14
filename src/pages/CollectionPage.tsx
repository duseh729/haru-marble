import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bottlesApi } from "../api/tasks";
import type { Bottle, Marble } from "../api/tasks";

type BottleWithMarbles = Bottle & { marbles: Marble[] };

const ITEMS_PER_PAGE = 9;

export default function CollectionPage() {
    const navigate = useNavigate();
    const [bottles, setBottles] = useState<BottleWithMarbles[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadBottles();
    }, []);

    const loadBottles = async () => {
        try {
            const data = await bottlesApi.getBottlesWithMarbles();
            setBottles(data);
        } catch (error) {
            console.error("Failed to load bottles:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const totalPages = Math.max(1, Math.ceil(bottles.length / ITEMS_PER_PAGE));
    const paginatedBottles = bottles.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // 3개씩 행으로 나누기
    const rows: BottleWithMarbles[][] = [];
    for (let i = 0; i < paginatedBottles.length; i += 3) {
        rows.push(paginatedBottles.slice(i, i + 3));
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}.${month}.${day}`;
    };

    return (
        <div className="w-full max-w-md mx-auto px-4 py-6 min-h-screen">
            <Helmet>
                <title>내 컬렉션 - Done List</title>
            </Helmet>

            {/* 헤더 */}
            <header className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Collection</h1>
                        <p className="text-gray-500 mt-1">{bottles.length}개의 유리병</p>
                    </div>
                </div>
                <div className="mt-4">
                    <Button
                        variant="outline"
                        className="rounded-full px-4 h-10 border-2 hover:bg-gray-50"
                        onClick={() => navigate("/app")}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        <span className="text-gray-700 font-medium">돌아가기</span>
                    </Button>
                </div>
            </header>

            {/* 로딩 */}
            {isLoading ? (
                <div className="flex items-center justify-center h-60">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                </div>
            ) : bottles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-60 text-gray-400 space-y-3">
                    <div className="text-5xl">🏺</div>
                    <p className="text-lg">아직 유리병이 없어요</p>
                </div>
            ) : (
                <>
                    {/* 선반 그리드 */}
                    <div className="space-y-0">
                        {rows.map((row, rowIndex) => (
                            <div key={rowIndex}>
                                {/* 유리병 행 */}
                                <div className="grid grid-cols-3 gap-3 pb-4 pt-2">
                                    {row.map((bottle) => (
                                        <button
                                            key={bottle.id}
                                            onClick={() => navigate(`/app?bottle=${bottle.id}`)}
                                            className="flex flex-col items-center group"
                                        >
                                            {/* 유리병 카드 */}
                                            <div className="w-full aspect-3/4 bg-gray-50 rounded-2xl border border-gray-100 p-3 flex flex-col items-center justify-end relative overflow-hidden transition-all group-hover:shadow-md group-hover:bg-gray-100/80 group-hover:-translate-y-1">
                                                {/* 구슬들 - 모든 구슬 표시 */}
                                                <div className="flex flex-wrap gap-1 justify-center items-end w-full">
                                                    {bottle.marbles.map((marble) => (
                                                        <div
                                                            key={marble.id}
                                                            className="rounded-full shadow-sm"
                                                            style={{
                                                                backgroundColor: marble.color || "#9CA3AF",
                                                                width: bottle.marbles.length > 12 ? "10px" : bottle.marbles.length > 6 ? "12px" : "16px",
                                                                height: bottle.marbles.length > 12 ? "10px" : bottle.marbles.length > 6 ? "12px" : "16px",
                                                            }}
                                                        />
                                                    ))}
                                                    {bottle.marbles.length === 0 && (
                                                        <span className="text-gray-300 text-xs">비어있음</span>
                                                    )}
                                                </div>

                                                {/* 유리병 반사광 효과 */}
                                                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                                                    <div className="absolute top-2 left-2 w-[40%] h-[60%] bg-white/20 rounded-full blur-md" />
                                                </div>
                                            </div>

                                            {/* 유리병 제목 */}
                                            <span className="mt-2 text-xs font-medium text-gray-600 truncate w-full text-center">
                                                {bottle.title}
                                            </span>
                                            <span className="text-[10px] text-gray-400">
                                                {formatDate(bottle.created_at)}
                                            </span>
                                        </button>
                                    ))}
                                    {/* 빈 칸 채우기 (3열 유지) */}
                                    {Array.from({ length: 3 - row.length }).map((_, i) => (
                                        <div key={`empty-${i}`} className="w-full" />
                                    ))}
                                </div>

                                {/* 선반 구분선 */}
                                <div className="relative mx-[-8px]">
                                    <div className="h-[6px] bg-linear-to-b from-gray-200 to-gray-100 rounded-full" />
                                    <div className="h-[2px] bg-gray-200/50 mt-px rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 페이지네이션 */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${currentPage === page
                                        ? "bg-gray-900 text-white"
                                        : "text-gray-500 hover:bg-gray-100"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
