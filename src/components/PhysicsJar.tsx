import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { MarbleFactory } from "../utils/MarbleFactory";

// DB에서 가져온 Task 타입 (색상 포함)
interface Task {
  id: number;
  text: string;
  color?: string;
  createdAt?: string;
}

interface PhysicsJarProps {
  // 기존 taskCount 대신 marbles 배열을 받음
  marbles: Task[];
}

// 툴팁 정보 타입
interface TooltipInfo {
  text: string;
  x: number;
  y: number;
}

export default function PhysicsJar({ marbles }: PhysicsJarProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  // 이미 렌더링된 구슬 ID 추적
  const renderedIdsRef = useRef<Set<number>>(new Set());
  // 구슬 body와 task 매핑
  const marbleMapRef = useRef<Map<Matter.Body, Task>>(new Map());

  // 툴팁 상태
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Runner = Matter.Runner,
      Events = Matter.Events,
      Query = Matter.Query;

    const engine = Engine.create();
    engineRef.current = engine;

    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "transparent",
        pixelRatio: 2,
      },
    });
    renderRef.current = render;

    // 마우스 클릭 이벤트 핸들러
    const handleClick = (e: MouseEvent) => {
      const rect = render.canvas.getBoundingClientRect();
      const scaleX = render.canvas.width / rect.width;
      const scaleY = render.canvas.height / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX / 2; // pixelRatio 보정
      const mouseY = (e.clientY - rect.top) * scaleY / 2;

      const bodies = Matter.Composite.allBodies(engine.world);
      const clickedBodies = Query.point(bodies, { x: mouseX, y: mouseY });

      if (clickedBodies.length > 0) {
        const clickedBody = clickedBodies[0];
        const task = marbleMapRef.current.get(clickedBody);
        if (task) {
          // 구슬 위치에 툴팁 표시 (캔버스 좌표를 div 좌표로 변환)
          setTooltip({
            text: task.text,
            x: clickedBody.position.x,
            y: clickedBody.position.y - 35, // 구슬 위에 표시
          });
        }
      } else {
        setTooltip(null); // 빈 영역 클릭 시 툴팁 숨김
      }
    };
    render.canvas.addEventListener('click', handleClick);

    // --- ✨ 커스텀 렌더링: 유리구슬 광택 효과 ---
    Events.on(render, "afterRender", () => {
      const context = render.context;
      const bodies = Matter.Composite.allBodies(engine.world);

      bodies.forEach((body) => {
        if (body.circleRadius && body.plugin.marbleColor) {
          const { x, y } = body.position;
          const radius = body.circleRadius;
          const color = body.plugin.marbleColor;

          // 1. 입체감 그라데이션 (하이라이트)
          const gradient = context.createRadialGradient(
            x - radius * 0.3,
            y - radius * 0.3,
            radius * 0.1,
            x,
            y,
            radius
          );

          gradient.addColorStop(0, "#FFFFFF"); // 반사광
          gradient.addColorStop(0.2, color); // 본래 색
          gradient.addColorStop(1, color);

          context.beginPath();
          context.arc(x, y, radius, 0, 2 * Math.PI);
          context.fillStyle = gradient;
          context.fill();

          // 2. 외곽선
          context.strokeStyle = "rgba(255,255,255,0.4)";
          context.lineWidth = 2;
          context.stroke();
        }
      });
    });

    // 유리병 벽 (투명)
    const wallOptions = {
      isStatic: true,
      render: { fillStyle: "transparent", visible: false },
    };

    const ground = Bodies.rectangle(
      width / 2,
      height + 10,
      width,
      30,
      wallOptions
    );
    const leftWall = Bodies.rectangle(-10, height / 2, 30, height, wallOptions);
    const rightWall = Bodies.rectangle(
      width + 10,
      height / 2,
      30,
      height,
      wallOptions
    );

    World.add(engine.world, [ground, leftWall, rightWall]);

    Render.run(render);
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    return () => {
      render.canvas.removeEventListener('click', handleClick);
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas) render.canvas.remove();
      World.clear(engine.world, false);
      Engine.clear(engine);
      renderedIdsRef.current.clear();
      marbleMapRef.current.clear();
    };
  }, []);

  // 구슬 추가 로직 - DB 색상 사용
  useEffect(() => {
    if (!engineRef.current || !renderRef.current) return;

    // 새로 추가된 구슬만 렌더링
    const newMarbles = marbles.filter(m => !renderedIdsRef.current.has(m.id));

    newMarbles.forEach((task, i) => {
      // DB에 저장된 색상 사용, 없으면 랜덤 생성
      const color = task.color || MarbleFactory.getRandomColor();

      const marble = MarbleFactory.createWithColor(
        150 + (Math.random() - 0.5) * 50,
        -50 - i * 30,
        22,
        color
      );
      Matter.World.add(engineRef.current!.world, marble);
      renderedIdsRef.current.add(task.id);
      marbleMapRef.current.set(marble, task); // body와 task 매핑
    });
  }, [marbles]);

  return (
    <div
      ref={sceneRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* 툴팁 오버레이 */}
      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -70%)",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "500",
            whiteSpace: "nowrap",
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            zIndex: 10,
            pointerEvents: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
