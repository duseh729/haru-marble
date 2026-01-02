import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PhysicsJar from '../components/PhysicsJar';

export default function AppPage() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([...tasks, input]);
    setInput('');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <Helmet>
        <title>내 유리병 - Done List</title>
      </Helmet>

      {/* 입력 영역 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="오늘 한 일을 입력하세요"
          style={{ flex: 1, padding: '10px' }}
        />
        <button onClick={addTask} style={{ padding: '10px' }}>추가</button>
      </div>

      {/* 물리 엔진 영역 (tasks 배열의 길이를 넘겨줌) */}
      <PhysicsJar taskCount={tasks.length} />

      {/* 리스트 확인용 (나중에 숨기거나 디자인 수정) */}
      <ul style={{ marginTop: '20px', listStyle: 'none', padding: 0 }}>
        {tasks.map((task, idx) => (
          <li key={idx} style={{ padding: '5px 0', borderBottom: '1px solid #eee' }}>
            ✅ {task}
          </li>
        ))}
      </ul>
    </div>
  );
}