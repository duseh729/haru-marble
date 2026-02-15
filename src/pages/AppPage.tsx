import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import PhysicsJar from "../components/PhysicsJar";
import { Button } from "@/components/ui/button";
import { Plus, X, Star, Check, Trash2, CheckCheck, CalendarDays, Pencil } from "lucide-react";
import { MARBLE_COLORS } from "../utils/MarbleFactory";

import { tasksApi, bottlesApi, frequentTasksApi } from "../api/tasks";
import type { Bottle } from "../api/tasks";
import { Link } from "react-router-dom";

// 태스크 타입 정의
interface Task {
  id: number;
  text: string;
  color?: string;
  emoji?: string;
  createdAt?: string;
  position_x?: number;
  position_y?: number;
}

// ... (QuickAction 관련 인터페이스 유지) ...
interface QuickActionItem {
  id: number;
  text: string;
}

export default function AppPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>(MARBLE_COLORS[0]); // 선택된 구슬 색상
  const [showColorPicker, setShowColorPicker] = useState(false); // 색상 피커 표시 여부
  const colorPickerRef = useRef<HTMLDivElement>(null); // 색상 피커 ref

  // 색상 피커 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker]);

  // 현재 선택된 Bottle 상태
  const [currentBottle, setCurrentBottle] = useState<Bottle | null>(null);

  // 초기 데이터 로딩: Bottle 먼저 로드 -> Tasks 로드
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // 1. URL에서 bottle ID 확인
      const params = new URLSearchParams(window.location.search);
      const bottleIdFromUrl = params.get("bottle");

      // 2. 유리병 목록 가져오기
      const bottles = await bottlesApi.getBottles();

      let bottle: Bottle;
      if (bottles && bottles.length > 0) {
        if (bottleIdFromUrl) {
          // URL에 bottle ID가 있으면 해당 병 사용
          bottle = bottles.find(b => b.id === Number(bottleIdFromUrl)) || bottles[0];
        } else {
          // 없으면 pinned 또는 첫 번째 사용
          bottle = bottles.find(b => b.is_pinned) || bottles[0];
        }
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
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isBottleFullModalOpen, setIsBottleFullModalOpen] = useState(false);
  const [scrollToTaskId, setScrollToTaskId] = useState<number | null>(null);

  // 퀵 액션 관련 상태
  const [selectedActionIds, setSelectedActionIds] = useState<number[]>([]);
  const [quickActions, setQuickActions] = useState<QuickActionItem[]>([]);
  const [newActionText, setNewActionText] = useState("");

  // DB에서 자주 하는 일 불러오기
  useEffect(() => {
    frequentTasksApi.getAll().then((data) => {
      setQuickActions(data.map(d => ({ id: d.id, text: d.content })));
    }).catch(console.error);
  }, []);

  const getFormattedTime = (dateString?: string) => {
    const date = dateString ? new Date(dateString) : new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  const addTask = async (text: string) => {
    const taskText = text.trim();
    if (!taskText || !currentBottle) return;

    if (tasks.length >= 60) {
      setIsBottleFullModalOpen(true);
      return;
    }

    try {
      // 현재 선택된 bottle의 ID와 색상 전달
      const newTask = await tasksApi.createTask(taskText, currentBottle.id, selectedColor || undefined);

      setTasks((prev) => [...prev, newTask]);
      setInput("");
    } catch (error) {
      alert("할 일을 저장하지 못했습니다. (하루 10개 제한일 수 있습니다)");
      console.error(error);
    }
  };

  // --- 퀵 액션 로직 ---
  const createQuickAction = async () => {
    if (!newActionText.trim()) return;
    try {
      const created = await frequentTasksApi.create(newActionText.trim());
      setQuickActions(prev => [...prev, { id: created.id, text: created.content }]);
      setNewActionText("");
    } catch (error) {
      console.error("자주 하는 일 추가 실패:", error);
    }
  };

  const deleteQuickAction = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await frequentTasksApi.delete(id);
      setQuickActions(prev => prev.filter(action => action.id !== id));
      setSelectedActionIds(prev => prev.filter(selectedId => selectedId !== id));
    } catch (error) {
      console.error("자주 하는 일 삭제 실패:", error);
    }
  };

  const toggleSelection = (id: number) => {
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

  // --- 구슬 수정/삭제 로직 ---
  const [editingTask, setEditingTask] = useState<{ id: number; text: string } | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const handleDeleteTask = (taskId: number) => {
    setDeleteTargetId(taskId);
  };

  const confirmDelete = async () => {
    if (deleteTargetId === null) return;
    try {
      await tasksApi.deleteTask(deleteTargetId);
      setTasks(prev => prev.filter(t => t.id !== deleteTargetId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleUpdateTask = async (taskId: number, newText: string) => {
    if (!newText.trim()) return;
    const originalTask = tasks.find(t => t.id === taskId);
    if (originalTask && originalTask.text === newText.trim()) {
      setEditingTask(null);
      return;
    }
    try {
      const updated = await tasksApi.updateTask(taskId, { text: newText.trim() });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, text: updated.text, createdAt: updated.createdAt } : t));
      setEditingTask(null);
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("수정에 실패했습니다.");
    }
  };

  // 구슬 좌표 정착 시 Supabase에 저장
  const handlePositionsSettled = useCallback(
    async (positions: { id: number; position_x: number; position_y: number }[]) => {
      try {
        await tasksApi.updatePositions(positions);
      } catch (error) {
        console.error("Failed to save marble positions:", error);
      }
    },
    []
  );

  // 구슬 클릭 시 기록 모달 열고 해당 항목으로 스크롤
  const handleMarbleClick = useCallback((taskId: number) => {
    setScrollToTaskId(taskId);
    setIsHistoryModalOpen(true);
  }, []);

  return (
    <div className="w-full min-h-dvh flex flex-col">
      <Helmet>
        <title>내 유리병 - Done List</title>
      </Helmet>

      <div className="px-5 flex-1 flex flex-col">
        {/* --- 상단 헤더 --- */}
        <header className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="">
              <h1 className="text-3xl font-bold text-gray-900">하루마블</h1>
              <p className="text-gray-600">오늘의 성취를 담다</p>
            </div>
            <Link to="/collection" className="inline-block">
              <div className="flex items-center space-x-2 bg-white rounded-xl px-4 py-2 shadow-sm hover:bg-gray-50 transition-colors">
                <div className="w-4 h-4 flex items-center" >
                  <img src="/bottleIcon.png" alt="유리병" />
                </div>
                <span className="font-bold text-gray-800">내 유리병</span>
              </div>
            </Link>
          </div>

          {/* ✨ 버튼 영역 수정: Flex로 나란히 배치 */}
          <div className="pt-2 flex gap-2">
            {/* 1. 자주 하는 일 버튼 (왼쪽, 넓게) */}
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center h-12 rounded-xl border-2 hover:border-solid hover:bg-gray-50"
              onClick={() => setIsQuickActionModalOpen(true)}
            >
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-600">자주 하는 일</span>
            </Button>

            {/* 2. 오늘 한 일 기록 보기 버튼 (오른쪽, 아이콘) */}
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl border-2 hover:bg-gray-50 flex items-center justify-center"
              onClick={() => setIsHistoryModalOpen(true)}
              title="오늘의 기록 보기"
            >
              <CheckCheck className="w-5 h-5 text-green-400" />
              <span className="text-gray-600">완료한 일</span>
            </Button>
          </div>

          {/* 할 일 입력 영역 */}
          <div className="relative" ref={colorPickerRef}>
            <div className="flex items-center bg-white rounded-xl p-2 mt-4 shadow-sm border border-gray-100">
              {/* 색상 선택 버튼 */}
              <div className="bg-gray-100 rounded-lg p-1 flex items-center justify-center">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm transition-transform"
                  style={{ backgroundColor: selectedColor || MARBLE_COLORS[0] }}
                  title="구슬 색상 선택"
                />
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask(input)}
                placeholder="완료한 일을 입력하세요."
                className="flex-1 bg-transparent outline-none px-2 text-gray-700 placeholder-gray-400"
              />
              <button
                onClick={() => addTask(input)}
                className="bg-black text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                <Plus />
              </button>
            </div>

            {/* 색상 피커 드롭다운 */}
            {showColorPicker && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl p-3 shadow-lg border border-gray-100 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex flex-wrap gap-2 justify-center">
                  {MARBLE_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        setShowColorPicker(false);
                      }}
                      className={`w-8 h-8 rounded-full transition-transform hover:scale-125 ${selectedColor === color ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* --- 메인 유리병 --- */}
        <main className="flex-1 flex flex-col items-center mb-8 relative">
          <div className="w-[260px] h-8 bg-gray-200 from-gray-200/50 to-transparent rounded-xl z-20"></div>
          <div className="rounded-b-[2rem] rounded-t-[50px] relative w-[300px] h-[400px] bg-white border-4 border-gray-200 shadow-lg overflow-hidden z-10">
            <div className="absolute inset-0 flex justify-center items-end px-1">
              <PhysicsJar marbles={tasks} onPositionsSettled={handlePositionsSettled} onMarbleClick={handleMarbleClick} />
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[420px] bg-blue-100/50 rounded-full blur-3xl -z-10"></div>

          {/* --- 프로그레스 바 --- */}
          {(() => {
            const MAX_MARBLES = 60;
            const count = tasks.length;
            const progress = Math.min(count / MAX_MARBLES, 1);
            const message =
              count >= MAX_MARBLES ? "반짝이는 성취로 가득 찬 특별한 병이에요!" :
                count >= 51 ? "마지막 스퍼트! 병이 곧 가득 찰 것 같아요." :
                  count >= 31 ? "유리병이 제법 묵직해졌네요!" :
                    count >= 11 ? "구슬들이 조금씩 모여 북적거리고 있어요!" :
                      "첫 번째 구슬의 설렘! 차근차근 담아봐요.";

            return (
              <div className="w-[300px] mt-4 z-10 bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-medium text-gray-500">{count} / {MAX_MARBLES}</span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${progress * 100}%`,
                      background: "linear-gradient(90deg, #93c5fd, #3b82f6)",
                    }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">{message}</p>
              </div>
            );
          })()}
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

            <div className="flex gap-2 mb-4 bg-gray-50 p-2 rounded-xl">
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
              {quickActions.length === 0 ? (
                <div className="col-span-2 flex flex-col items-center justify-center text-gray-400">
                  <p className="text-sm">자주 하는 일을 등록해보세요</p>
                </div>
              ) : (
                quickActions.map((action) => {
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
                          <button
                            onClick={(e) => deleteQuickAction(action.id, e)}
                            className="p-1 rounded-lg transition-colors"
                          >
                            <Trash2 className="text-gray-300" />
                          </button>
                        )}
                      </div>
                    </Button>
                  );
                })
              )}
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
                tasks.slice().reverse().map((task) => {
                  const isTarget = task.id === scrollToTaskId;
                  return (
                    <div
                      key={task.id}
                      id={`history-task-${task.id}`}
                      className={`flex items-start gap-3 p-4 rounded-2xl border transition-colors duration-500 ${isTarget ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'
                        }`}
                      ref={isTarget ? (el) => {
                        if (el) {
                          setTimeout(() => {
                            el.scrollIntoView({ behavior: 'instant', block: 'center' });
                            setTimeout(() => setScrollToTaskId(null), 100);
                          }, 100);
                        }
                      } : undefined}
                    >
                      {/* 구슬 색상 원 */}
                      <div
                        className="shrink-0 w-8 h-8 rounded-full shadow-sm border-2 border-white mt-0.5"
                        style={{ backgroundColor: task.color || '#9CA3AF' }}
                      />
                      <div className="flex-1 min-w-0">
                        {editingTask?.id === task.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editingTask.text}
                              onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleUpdateTask(task.id, editingTask.text);
                                if (e.key === 'Escape') setEditingTask(null);
                              }}
                              className="flex-1 min-w-0 px-2 py-1 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <button onClick={() => handleUpdateTask(task.id, editingTask.text)} className="text-blue-500 hover:text-blue-700">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingTask(null)} className="text-gray-400 hover:text-gray-600">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-gray-800 truncate">{task.text}</span>
                            <button
                              onClick={() => setEditingTask({ id: task.id, text: task.text })}
                              className="shrink-0 p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              title="수정"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="shrink-0 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                        <span className="text-xs text-gray-400 mt-1 block">
                          {getFormattedTime(task.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-sm">총 <span className="font-bold text-blue-600 text-lg">{tasks.length}</span>개의 구슬을 모았어요!</p>
            </div>
          </div>
        </div>
      )}
      {/* --- 삭제 확인 모달 --- */}
      {deleteTargetId !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[280px] rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">구슬 삭제</h3>
            <p className="text-sm text-gray-500 mb-6">이 구슬을 정말 삭제할까요?<br />삭제하면 되돌릴 수 없어요.</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl font-medium"
                onClick={() => setDeleteTargetId(null)}
              >
                취소
              </Button>
              <Button
                className="flex-1 h-12 rounded-xl font-medium bg-red-500 hover:bg-red-600 text-white"
                onClick={confirmDelete}
              >
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- 모달: 유리병 가득 참 알림 --- */}
      {isBottleFullModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-[280px] rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl mb-3">✨</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">유리병이 가득 찼어요!</h3>
            <p className="text-sm text-gray-500 mb-5">새 유리병을 만들어 더 많은 성취를 담아보세요.</p>
            <Button
              className="w-full h-11 rounded-xl font-medium bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => setIsBottleFullModalOpen(false)}
            >
              확인
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}