import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { MarbleFactory } from '../utils/MarbleFactory'; // ✨ 경로/이름 변경

interface PhysicsJarProps {
  taskCount: number;
}

export default function PhysicsJar({ taskCount }: PhysicsJarProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const Engine = Matter.Engine,
          Render = Matter.Render,
          World = Matter.World,
          Bodies = Matter.Bodies,
          Runner = Matter.Runner,
          Events = Matter.Events;

    const engine = Engine.create();
    engineRef.current = engine;

    const width = 300;
    const height = 400;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
        pixelRatio: 2,
      }
    });
    renderRef.current = render;

    // --- ✨ 커스텀 렌더링: 유리구슬 광택 효과 ---
    Events.on(render, 'afterRender', () => {
      const context = render.context;
      const bodies = Matter.Composite.allBodies(engine.world);

      bodies.forEach((body) => {
        // ✨ 속성 이름 변경 확인 (marbleColor)
        if (body.circleRadius && body.plugin.marbleColor) {
          const { x, y } = body.position;
          const radius = body.circleRadius;
          const color = body.plugin.marbleColor;

          // 1. 입체감 그라데이션 (하이라이트)
          const gradient = context.createRadialGradient(
            x - radius * 0.3, y - radius * 0.3, radius * 0.1,
            x, y, radius
          );

          gradient.addColorStop(0, '#FFFFFF'); // 반사광
          gradient.addColorStop(0.2, color);   // 본래 색
          gradient.addColorStop(1, color);

          context.beginPath();
          context.arc(x, y, radius, 0, 2 * Math.PI);
          context.fillStyle = gradient;
          context.fill();
          
          // 2. 외곽선 (선택 사항)
          context.strokeStyle = 'rgba(255,255,255,0.4)';
          context.lineWidth = 2;
          context.stroke();
        }
      });
    });

    // 유리병 벽 (투명)
    const wallOptions = { 
        isStatic: true, 
        render: { fillStyle: 'transparent', visible: false } 
    };
    
    const ground = Bodies.rectangle(width / 2, height + 10, width, 40, wallOptions);
    const leftWall = Bodies.rectangle(-10, height / 2, 20, height, wallOptions);
    const rightWall = Bodies.rectangle(width + 10, height / 2, 20, height, wallOptions);

    World.add(engine.world, [ground, leftWall, rightWall]);

    Render.run(render);
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas) render.canvas.remove();
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, []);

  // 구슬 추가 로직
  useEffect(() => {
    if (!engineRef.current || !renderRef.current) return;
    
    const currentBodies = Matter.Composite.allBodies(engineRef.current.world).filter(b => !b.isStatic);
    const bodiesToAdd = taskCount - currentBodies.length;

    if (bodiesToAdd > 0) {
      for (let i = 0; i < bodiesToAdd; i++) {
        // ✨ MarbleFactory 사용
        const marble = MarbleFactory.create(
          150 + (Math.random() - 0.5) * 50,
          -50 - (i * 30),
          22
        );
        Matter.World.add(engineRef.current.world, marble);
      }
    }
  }, [taskCount]);

  return (
    <div 
      ref={sceneRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        justifyContent: 'center',
      }} 
    />
  );
}