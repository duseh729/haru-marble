import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import PhysicsJar from "../components/PhysicsJar";
import { Button } from "@/components/ui/button";
import { Plus, X, Zap, Check, Trash2, History, CalendarDays } from "lucide-react"; // History, CalendarDays 추가

import { tasksApi, bottlesApi } from "../api/tasks";
import type { Bottle } from "../api/tasks";

// 태스크 타입 정의
interface Task {
  id: number;
  text: string;
  color?: string; // 구슬 색상
  emoji?: string;
  createdAt?: string;
}

// ... (QuickAction 관련 인터페이스 유지) ...
interface QuickActionItem {
  id: string;
  text: string;
}

// ... (DEFAULT_QUICK_ACTIONS 유지) ...
const DEFAULT_QUICK_ACTIONS: QuickActionItem[] = [
  { id: '1', emoji: "💧", text: "물 마시기" },
  { id: '2', emoji: "🏃", text: "운동하기" },
  { id: '3', emoji: "📖", text: "책 읽기" },
  { id: '4', emoji: "💊", text: "영양제" },
];

// ... (Icons 유지) ...
const Icons = {
  // ... 생략 ...
  Trophy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  Send: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  ),
  CheckCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 fill-green-100">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  ),
};

export default function AppPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 현재 선택된 Bottle 상태
  const [currentBottle, setCurrentBottle] = useState<Bottle | null>(null);

  // 초기 데이터 로딩: Bottle 먼저 로드 -> Tasks 로드
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // 1. 유리병 목록 가져오기
      const bottles = await bottlesApi.getBottles();

      let bottle: Bottle;
      if (bottles && bottles.length > 0) {
        // 기존 유리병이 있으면 첫 번째(또는 pinned) 사용
        bottle = bottles.find(b => b.is_pinned) || bottles[0];
      } else {
        // 없으면 기본 유리병 생성
        bottle = await bottlesApi.createBottle("기본 유리병", "내 첫 번째 유리병");
      }

      setCurrentBottle(bottle);

      // 2. 해당 병의 구슬들 로드
      await loadTasks(bottle.id);
    } catch (error) {
      console.error("Failed to initialize app:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTasks = async (bottleId: number) => {
    try {
      const data = await tasksApi.getTasks(bottleId);
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };


  // --- 모달 상태 관리 ---
  const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false); // ✨ 기록 모달 상태 추가

  // 퀵 액션 관련 상태
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>([]);
  const [quickActions, setQuickActions] = useState<QuickActionItem[]>(() => {
    const saved = localStorage.getItem('myQuickActions');
    return saved ? JSON.parse(saved) : DEFAULT_QUICK_ACTIONS;
  });

  const [newActionText, setNewActionText] = useState("");
  const [newActionEmoji, setNewActionEmoji] = useState("✨");

  useEffect(() => {
    localStorage.setItem('myQuickActions', JSON.stringify(quickActions));
  }, [quickActions]);

  const getFormattedTime = (dateString?: string) => {
    const date = dateString ? new Date(dateString) : new Date();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const addTask = async (text: string) => {
    const taskText = text.trim();
    if (!taskText || !currentBottle) return;

    try {
      // 현재 선택된 bottle의 ID 전달
      const newTask = await tasksApi.createTask(taskText, currentBottle.id);

      setTasks((prev) => [...prev, newTask]);
      setInput("");
    } catch (error) {
      alert("할 일을 저장하지 못했습니다. (하루 10개 제한일 수 있습니다)");
      console.error(error);
    }
  };

  // --- 퀵 액션 로직 ---
  const createQuickAction = () => {
    if (!newActionText.trim()) return;
    const newAction: QuickActionItem = {
      id: Date.now().toString(),
      emoji: newActionEmoji || "⚡",
      text: newActionText.trim(),
    };
    setQuickActions([...quickActions, newAction]);
    setNewActionText("");
    setNewActionEmoji("✨");
  };

  const deleteQuickAction = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = quickActions.filter(action => action.id !== id);
    setQuickActions(filtered);
    setSelectedActionIds(prev => prev.filter(selectedId => selectedId !== id));
  };

  const toggleSelection = (id: string) => {
    if (selectedActionIds.includes(id)) {
      setSelectedActionIds(prev => prev.filter(itemId => itemId !== id));
    } else {
      setSelectedActionIds(prev => [...prev, id]);
    }
  };

  const handleAddSelected = () => {
    const selectedItems = quickActions.filter(item => selectedActionIds.includes(item.id));
    selectedItems.forEach(item => addTask(item.text));
    setSelectedActionIds([]);
    setIsQuickActionModalOpen(false);
  };

  return (
    <div className="w-full flex justify-center">
      <Helmet>
        <title>내 유리병 - Done List</title>
      </Helmet>

      <div>
        {/* --- 상단 헤더 --- */}
        <header className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <div className="">
              <h1 className="text-3xl font-bold text-gray-900">Done-List</h1>
              <p className="text-gray-600">오늘의 성취를 담다</p>
            </div>
            <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
              <Icons.Trophy />
              <span className="font-bold text-gray-800">{tasks.length}</span>
            </div>
          </div>

          {/* ✨ 버튼 영역 수정: Flex로 나란히 배치 */}
          <div className="pt-2 flex gap-2">
            {/* 1. 자주 하는 일 버튼 (왼쪽, 넓게) */}
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center space-x-2 h-12 rounded-xl border-dashed border-2 hover:border-solid hover:bg-gray-50"
              onClick={() => setIsQuickActionModalOpen(true)}
            >
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600">자주 하는 일 관리</span>
            </Button>

            {/* 2. 오늘 한 일 기록 보기 버튼 (오른쪽, 아이콘) */}
            <Button
              variant="outline"
              className="w-14 h-12 rounded-xl border-2 hover:bg-gray-50 flex items-center justify-center"
              onClick={() => setIsHistoryModalOpen(true)}
              title="오늘의 기록 보기"
            >
              <History className="w-5 h-5 text-gray-500" />
            </Button>
          </div>

          {/* 할 일 입력 영역 */}
          <div className="flex items-center bg-white rounded-xl p-2 mt-4 shadow-sm border border-gray-100">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask(input)}
              placeholder="할 일을 입력하세요..."
              className="flex-1 bg-transparent outline-none px-2 text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={() => addTask(input)}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              <Plus />
            </button>
          </div>
        </header>

        {/* --- 메인 유리병 --- */}
        <main className="flex-1 flex flex-col justify-center items-center mb-8 relative">
          <div className="w-[260px] h-8 bg-gray-200 from-gray-200/50 to-transparent rounded-xl z-20"></div>
          <div className="rounded-b-[2rem] rounded-t-[50px] relative w-[300px] h-[400px] bg-white border-4 border-gray-200 shadow-lg overflow-hidden z-10">
            <div className="absolute inset-0 flex justify-center items-end px-1">
              <PhysicsJar marbles={tasks} />
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[420px] bg-blue-100/50 rounded-full blur-3xl -z-10"></div>
        </main>

      </div>

      {/* --- 모달 1: 자주 하는 일 (Quick Actions) --- */}
      {isQuickActionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">자주 하는 일</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsQuickActionModalOpen(false)} className="h-8 w-8 rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex gap-2 mb-6 bg-gray-50 p-2 rounded-xl">
              <input
                type="text"
                className="flex-1 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newActionText}
                onChange={(e) => setNewActionText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createQuickAction()}
                placeholder="습관 이름 (예: 독서)"
              />
              <Button size="icon" onClick={createQuickAction} className="shrink-0 bg-gray-900 hover:bg-gray-800">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 overflow-y-auto pr-1">
              {quickActions.map((action) => {
                const isSelected = selectedActionIds.includes(action.id);
                return (
                  <Button
                    // ... 생략 (key, onClick 등)
                    key={action.id}
                    onClick={() => toggleSelection(action.id)}
                    className={`flex items-center justify-between p-6 transition-colors ${isSelected
                      ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 border-1" // 선택 시: 파란 배경 + 흰색 글자
                      : "bg-white hover:bg-gray-50 text-gray-900 border-gray-200 border-1"  // 미선택 시: 흰색 배경 + 회색 글자
                      }`}
                  >
                    <span className="truncate">{action.text}</span>

                    {/* 우측 아이콘 제어 로직 */}
                    <div className="flex items-center">
                      {isSelected ? (
                        <Check className="text-white" /> // 선택 시 체크 (흰색)
                      ) : (
                        <Trash2 className="text-gray-300" /> // 미선택 시 휴지통 (회색)
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>

            <Button
              className="w-full h-14 text-lg rounded-xl font-bold bg-blue-600 hover:bg-blue-700 mt-auto shadow-lg shadow-blue-200"
              disabled={selectedActionIds.length === 0}
              onClick={handleAddSelected}
            >
              {selectedActionIds.length > 0 ? `${selectedActionIds.length}개 추가하기` : "추가할 항목을 선택하세요"}
            </Button>
          </div>
        </div>
      )}

      {/* --- ✨ 모달 2: 오늘의 기록 (History) --- */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <CalendarDays className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-bold text-gray-900">오늘의 기록</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsHistoryModalOpen(false)} className="h-8 w-8 rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* 기록 리스트 영역 */}
            <div className="overflow-y-auto pr-2 space-y-3 min-h-[200px]">
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400 space-y-2">
                  <div className="text-4xl">📭</div>
                  <p>아직 완료한 일이 없어요.</p>
                </div>
              ) : (
                tasks.slice().reverse().map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-800 truncate">{task.text}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-400 bg-white px-2 py-1 rounded-full border border-gray-100">
                      {getFormattedTime(task.createdAt)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-sm">총 <span className="font-bold text-blue-600 text-lg">{tasks.length}</span>개의 구슬을 모았어요!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}