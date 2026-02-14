import { useEffect, useRef, useState, useCallback } from "react";
import Matter from "matter-js";
import { MarbleFactory } from "../utils/MarbleFactory";

// DB에서 가져온 Task 타입 (색상 + 좌표 포함)
interface Task {
  id: number;
  text: string;
  color?: string;
  createdAt?: string;
  position_x?: number;
  position_y?: number;
}

interface PhysicsJarProps {
  marbles: Task[];
  onPositionsSettled?: (positions: { id: number; position_x: number; position_y: number }[]) => void;
}

// 툴팁 정보 타입
interface TooltipInfo {
  text: string;
  x: number;
  y: number;
}

export default function PhysicsJar({ marbles, onPositionsSettled }: PhysicsJarProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  // 이미 렌더링된 구슬 ID 추적
  const renderedIdsRef = useRef<Set<number>>(new Set());
  // 구슬 body와 task 매핑
  const marbleMapRef = useRef<Map<Matter.Body, Task>>(new Map());
  // 정착 감지용 타이머
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 이미 보고된 좌표인지 추적
  const lastReportedRef = useRef<string>("");

  // 툴팁 상태
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);

  // 구슬이 모두 멈췄는지 확인하고 좌표 보고
  const checkSettled = useCallback(() => {
    if (!engineRef.current || !onPositionsSettled) return;

    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    const marbleBodies = bodies.filter((b: Matter.Body) => b.circleRadius && marbleMapRef.current.has(b));

    if (marbleBodies.length === 0) return;

    // 모든 구슬이 거의 정지 상태인지 확인 (속도가 매우 낮은 경우)
    const allSettled = marbleBodies.every((b: Matter.Body) => {
      const speed = Math.sqrt(b.velocity.x ** 2 + b.velocity.y ** 2);
      return speed < 0.1;
    });

    if (allSettled) {
      const positions = marbleBodies
        .map((body: Matter.Body) => {
          const task = marbleMapRef.current.get(body);
          if (!task) return null;
          return {
            id: task.id,
            position_x: Math.round(body.position.x * 100) / 100,
            position_y: Math.round(body.position.y * 100) / 100,
          };
        })
        .filter((p): p is { id: number; position_x: number; position_y: number } => p !== null);

      // 이전에 보고한 좌표와 같으면 스킵
      const posKey = JSON.stringify(positions);
      if (posKey !== lastReportedRef.current) {
        lastReportedRef.current = posKey;
        onPositionsSettled(positions);
      }
    }
  }, [onPositionsSettled]);

  useEffect(() => {
    if (!sceneRef.current) return;

    const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Runner = Matter.Runner,
      Events = Matter.Events,
      Query = Matter.Query;

    // sleeping 활성화
    const engine = Engine.create({
      enableSleeping: true,
    });
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
      const mouseX = (e.clientX - rect.left) * scaleX / 2;
      const mouseY = (e.clientY - rect.top) * scaleY / 2;

      const bodies = Matter.Composite.allBodies(engine.world);
      const clickedBodies = Query.point(bodies, { x: mouseX, y: mouseY });

      if (clickedBodies.length > 0) {
        const clickedBody = clickedBodies[0];
        const task = marbleMapRef.current.get(clickedBody);
        if (task) {
          setTooltip({
            text: task.text,
            x: clickedBody.position.x,
            y: clickedBody.position.y - 35,
          });
        }
      } else {
        setTooltip(null);
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

          const gradient = context.createRadialGradient(
            x - radius * 0.3,
            y - radius * 0.3,
            radius * 0.1,
            x,
            y,
            radius
          );

          gradient.addColorStop(0, "#FFFFFF");
          gradient.addColorStop(0.2, color);
          gradient.addColorStop(1, color);

          context.beginPath();
          context.arc(x, y, radius, 0, 2 * Math.PI);
          context.fillStyle = gradient;
          context.fill();

          context.strokeStyle = "rgba(255,255,255,0.4)";
          context.lineWidth = 2;
          context.stroke();
        }
      });
    });

    // 매 업데이트마다 구슬 속도를 체크해서 모두 멈추면 좌표 저장 (디바운스)
    Events.on(engine, "afterUpdate", () => {
      const bodies = Matter.Composite.allBodies(engine.world);
      const mBodies = bodies.filter((b: Matter.Body) => b.circleRadius && marbleMapRef.current.has(b));

      if (mBodies.length === 0) return;

      const allSlow = mBodies.every((b: Matter.Body) => {
        const speed = Math.sqrt(b.velocity.x ** 2 + b.velocity.y ** 2);
        return speed < 0.15;
      });

      if (allSlow) {
        if (!settleTimerRef.current) {
          settleTimerRef.current = setTimeout(() => {
            settleTimerRef.current = null;
            checkSettled();
          }, 1000);
        }
      } else {
        if (settleTimerRef.current) {
          clearTimeout(settleTimerRef.current);
          settleTimerRef.current = null;
        }
      }
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
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
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

  // 구슬 추가 로직 - DB 좌표가 있으면 해당 위치에, 없으면 위에서 떨어트림
  useEffect(() => {
    if (!engineRef.current || !renderRef.current) return;

    const newMarbles = marbles.filter(m => !renderedIdsRef.current.has(m.id));

    newMarbles.forEach((task, i) => {
      const color = task.color || MarbleFactory.getRandomColor();

      // 저장된 좌표가 있으면 해당 위치에, 없으면 위에서 떨어트림
      const x = task.position_x ?? (150 + (Math.random() - 0.5) * 50);
      const y = task.position_y ?? (-50 - i * 30);

      const marble = MarbleFactory.createWithColor(x, y, 22, color);
      Matter.World.add(engineRef.current!.world, marble);
      renderedIdsRef.current.add(task.id);
      marbleMapRef.current.set(marble, task);
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
