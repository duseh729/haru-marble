import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

interface PhysicsJarProps {
  taskCount: number; // 할 일 개수가 늘어나면 구슬 추가
}

export default function PhysicsJar({ taskCount }: PhysicsJarProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);

  // 1. 물리 엔진 초기화 (최초 1회)
  useEffect(() => {
    if (!sceneRef.current) return;

    // 모듈 별칭
    const Engine = Matter.Engine,
          Render = Matter.Render,
          World = Matter.World,
          Bodies = Matter.Bodies,
          Runner = Matter.Runner;

    // 엔진 생성
    const engine = Engine.create();
    engineRef.current = engine;

    // 렌더러 생성 (화면 크기에 맞게)
    const width = 360; // 모바일 폭 가정
    const height = 600;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false, // false여야 색상이 보임
        background: '#f0f0f0'
      }
    });

    // 벽 (유리병 모양) 만들기: 바닥, 왼쪽, 오른쪽
    const wallOptions = { isStatic: true, render: { fillStyle: '#888' } };
    const ground = Bodies.rectangle(width / 2, height - 10, width - 40, 20, wallOptions);
    const leftWall = Bodies.rectangle(20, height / 2, 20, height, wallOptions);
    const rightWall = Bodies.rectangle(width - 20, height / 2, 20, height, wallOptions);

    World.add(engine.world, [ground, leftWall, rightWall]);

    // 실행
    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Clean-up (페이지 이동 시 메모리 해제)
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas) render.canvas.remove();
    };
  }, []);

  // 2. taskCount가 증가하면 구슬 떨어뜨리기
  useEffect(() => {
    if (!engineRef.current || taskCount === 0) return;

    const Bodies = Matter.Bodies;
    const World = Matter.World;

    // 랜덤 색상 구슬 생성
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    
    const bead = Bodies.circle(
      180 + (Math.random() - 0.5) * 50, // 중앙 부근 랜덤 X 위치
      50, // 위쪽 Y 위치
      15, // 반지름
      { 
        restitution: 0.5, // 탄성 (통통 튀는 정도)
        render: { fillStyle: randomColor } 
      }
    );

    World.add(engineRef.current.world, bead);
  }, [taskCount]); // taskCount가 변할 때 실행

  return <div ref={sceneRef} style={{ display: 'flex', justifyContent: 'center' }} />;
}