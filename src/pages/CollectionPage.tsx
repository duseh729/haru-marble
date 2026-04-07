import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
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
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newBottleTitle, setNewBottleTitle] = useState("");

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

    // 3개씩 행으로 나누기 (최소 3행)
    const rows: BottleWithMarbles[][] = [];
    for (let i = 0; i < paginatedBottles.length; i += 3) {
        rows.push(paginatedBottles.slice(i, i + 3));
    }
    // 선반 3줄 고정
    while (rows.length < 3) {
        rows.push([]);
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}.${month}.${day}`;
    };

    const handleCreateBottle = async () => {
        const title = newBottleTitle.trim();
        if (!title) return;
        try {
            const newBottle = await bottlesApi.createBottle(title);
            setNewBottleTitle("");
            setShowCreateModal(false);
            navigate(`/app?bottle=${newBottle.id}`);
        } catch (error) {
            console.error("유리병 생성 실패:", error);
            alert("유리병 생성에 실패했습니다.");
        }
    };

    return (
        <div className="w-full max-w-md mx-auto px-4 min-h-screen">
            <Helmet>
                <title>내 컬렉션 - Done List</title>
            </Helmet>

            {/* 헤더 */}
            <div className="mb-4 flex items-center justify-between">
                <Button
                    variant="outline"
                    className="rounded-xl px-4 h-10 border-2 hover:bg-gray-50"
                    onClick={() => navigate("/app")}
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    <span className="text-gray-700 font-medium">돌아가기</span>
                </Button>
                <Button
                    className="rounded-xl px-4 h-10 bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => setShowCreateModal(true)}
                >
                    <Plus className="w-4 h-4 mr-1" />
                    <span className="font-medium">새 유리병</span>
                </Button>
            </div>

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
                    <div className="space-y-6">
                        {rows.map((row, rowIndex) => (
                            <div key={rowIndex}>
                                {/* 유리병 행 */}
                                <div className="grid grid-cols-3 gap-3 pb-4">
                                    {row.map((bottle) => (
                                        <button
                                            key={bottle.id}
                                            onClick={() => navigate(`/app?bottle=${bottle.id}`)}
                                            className="flex flex-col items-center group"
                                        >
                                            {/* 뚜껑 */}
                                            <div className="w-[80%] h-2 bg-gray-200 rounded-lg" />
                                            {/* 유리병 카드 */}
                                            <div className="w-full aspect-4/5 bg-gray-50 rounded-b-2xl rounded-t-xl border border-gray-100 flex flex-col items-center justify-end relative overflow-hidden">
                                                {/* 구슬들 - 좌표 기반 배치 */}
                                                {bottle.marbles.length > 0 ? (
                                                    bottle.marbles.some(m => m.position_x != null) ? (
                                                        /* 좌표가 있으면 실제 위치 반영 (320x400 → 카드 크기로 스케일링) */
                                                        bottle.marbles.map((marble) => {
                                                            return (
                                                                <div
                                                                    key={marble.id}
                                                                    className="rounded-full shadow-sm absolute"
                                                                    style={{
                                                                        background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 20%, ${marble.color || '#9CA3AF'} 20%, ${marble.color || '#9CA3AF'} 100%)`,
                                                                        border: '1px solid rgba(255,255,255,0.4)',
                                                                        width: "14.375%", // 46 / 320 (23px radius marble in 320px wide logic physics container)
                                                                        aspectRatio: "1/1",
                                                                        left: `${((marble.position_x ?? 160) / 320) * 100}%`,
                                                                        top: `${((marble.position_y ?? 200) / 400) * 100}%`,
                                                                        transform: "translate(-50%, -50%)",
                                                                    }}
                                                                />
                                                            );
                                                        })
                                                    ) : (
                                                        /* 좌표 없으면 기본 flex 배치 */
                                                        <div className="flex flex-wrap gap-1 justify-center items-end w-full p-3">
                                                            {bottle.marbles.map((marble) => (
                                                                <div
                                                                    key={marble.id}
                                                                    className="rounded-full shadow-sm ring-1 ring-white/40 ring-inset"
                                                                    style={{
                                                                        background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 20%, ${marble.color || '#9CA3AF'} 45%, ${marble.color || '#9CA3AF'} 100%)`,
                                                                        width: bottle.marbles.length > 12 ? "8px" : bottle.marbles.length > 6 ? "10px" : "12px",
                                                                        height: bottle.marbles.length > 12 ? "8px" : bottle.marbles.length > 6 ? "10px" : "12px",
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                    )
                                                ) : (
                                                    <span className="text-gray-300 text-xs p-3">비어있음</span>
                                                )}

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
                                    {/* 빈 칸 채우기 (3열 유지, 높이 일정) */}
                                    {Array.from({ length: 3 - row.length }).map((_, i) => (
                                        <div key={`empty-${i}`} className="flex flex-col items-center">
                                            <div className="w-full aspect-4/5" />
                                            <span className="mt-2 text-xs">&nbsp;</span>
                                            <span className="text-[10px]">&nbsp;</span>
                                        </div>
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

                    {/* 페이지네이션 - 1 / 3 형식 */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <span className="text-sm font-medium text-gray-700">
                            {currentPage} / {Math.max(1, Math.ceil(bottles.length / 9))}
                        </span>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </>
            )}
            {/* 새 유리병 생성 모달 */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-[300px] rounded-3xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">새 유리병 만들기</h3>
                            <button onClick={() => { setShowCreateModal(false); setNewBottleTitle(""); }} className="p-1 text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={newBottleTitle}
                            onChange={(e) => setNewBottleTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && handleCreateBottle()}
                            placeholder="유리병 이름을 입력하세요"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-4"
                            autoFocus
                        />
                        <Button
                            className="w-full h-11 rounded-xl font-medium bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={handleCreateBottle}
                            disabled={!newBottleTitle.trim()}
                        >
                            만들기
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
