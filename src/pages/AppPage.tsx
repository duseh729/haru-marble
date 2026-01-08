import { useState } from "react";
import { Helmet } from "react-helmet-async";
import PhysicsJar from "../components/PhysicsJar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// 태스크 타입 정의
interface Task {
  id: number;
  text: string;
  time: string;
}

// 아이콘 컴포넌트들 (라이브러리 대신 직접 정의)
const Icons = {
  Trophy: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-yellow-500"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  Send: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  ),
  CheckCircle: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-green-500 fill-green-100"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  ),
};

export default function AppPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "아침 운동 30분", time: "09:23" },
    { id: 2, text: "물 마시기", time: "10:15" },
  ]);
  const [input, setInput] = useState("");

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const addTask = (text: string) => {
    const taskText = text.trim();
    if (!taskText) return;

    const newTask: Task = {
      id: Date.now(),
      text: taskText,
      time: getCurrentTime(),
    };

    setTasks([...tasks, newTask]);
    setInput("");
  };

  const quickActions = [
    { emoji: "💧", text: "물 마시기", color: "bg-blue-100 text-blue-600" },
    { emoji: "🏃", text: "운동하기", color: "bg-green-100 text-green-600" },
    { emoji: "📖", text: "책 읽기", color: "bg-pink-100 text-pink-600" },
  ];

  return (
    <div className="w-full flex justify-center">
      <Helmet>
        <title>내 유리병 - Done List</title>
      </Helmet>

      <div>
        {/* --- 상단 헤더 영역 --- */}
        <header className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <div className="">
              <h1 className="text-3xl font-bold text-gray-900">Done-List</h1>
              <p className="text-gray-600">오늘의 성취를 담다</p>
            </div>
            {/* 총 성취 개수 뱃지 */}
            <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
              <Icons.Trophy />
              <span className="font-bold text-gray-800">{tasks.length}</span>
            </div>
          </div>

          {/* 퀵 액션 칩 */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={() => addTask(action.text)}
                variant="outline"
              >
                <span>{action.text}</span>
              </Button>
            ))}
            <Button >
              <Plus />
              <span>추가</span>
            </Button>
          </div>
        </header>

        {/* --- 중단 유리병 영역 --- */}
        <main className="flex-1 flex justify-center items-center mb-8 relative">
          <div className="relative w-[300px] h-[400px] bg-white rounded-[1rem] border-4 border-gray-200 shadow-lg overflow-hidden z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-10 bg-gradient-to-b from-gray-200/50 to-transparent rounded-b-3xl z-20"></div>
            <div className="absolute inset-0 flex justify-center items-end px-1">
              <PhysicsJar taskCount={tasks.length} />
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[420px] bg-blue-100/50 rounded-full blur-3xl -z-10"></div>
        </main>

        {/* --- 하단 입력 및 리스트 영역 --- */}
        <section className="bg-white rounded-t-3xl p-6 -mx-6 -mb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">
            새로운 할 일
          </h2>

          {/* 입력창 */}
          <div className="flex items-center bg-gray-100 rounded-full p-2 mb-6">
            <button className="p-2 text-gray-400">
              <Plus  />
            </button>
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
              <Icons.Send />
            </button>
          </div>

          {/* 오늘 완료한 일 리스트 */}
          <h2 className="text-sm font-semibold text-gray-500 mb-3">
            오늘 완료한 일
          </h2>
          <ul className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-hide">
            {tasks
              .slice()
              .reverse()
              .map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between bg-gray-50 rounded-2xl p-4"
                >
                  <div className="flex items-center space-x-3">
                    <Icons.CheckCircle />
                    <span className="text-gray-800">{task.text}</span>
                  </div>
                  <span className="text-xs text-gray-400">{task.time}</span>
                </li>
              ))}
            {tasks.length === 0 && (
              <li className="text-center text-gray-400 py-4">
                아직 완료한 일이 없습니다.
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
