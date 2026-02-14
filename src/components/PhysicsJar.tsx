import { useEffect, useRef, useState, useCallback } from "react";
import Matter from "matter-js";
import { MarbleFactory } from "../utils/MarbleFactory";
import { Pencil } from "lucide-react";

// DB에서 가져온 Task 타입
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
  onMarbleClick?: (taskId: number) => void;
}

interface TooltipInfo {
  text: string;
  x: number;
  y: number;
  taskId: number;
}

export default function PhysicsJar({ marbles, onPositionsSettled, onMarbleClick }: PhysicsJarProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const renderedIdsRef = useRef<Set<number>>(new Set());
  const marbleMapRef = useRef<Map<Matter.Body, Task>>(new Map());
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastReportedRef = useRef<string>("");

  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);

  // 구슬 정착 감지 및 좌표 보고
  const checkSettled = useCallback(() => {
    if (!engineRef.current || !onPositionsSettled) return;

    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    const marbleBodies = bodies.filter((b: Matter.Body) => b.circleRadius && marbleMapRef.current.has(b));

    if (marbleBodies.length === 0) return;

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

      const posKey = JSON.stringify(positions);
      if (posKey !== lastReportedRef.current) {
        lastReportedRef.current = posKey;
        onPositionsSettled(positions);
      }
    }
  }, [onPositionsSettled]);

  useEffect(() => {
    if (!sceneRef.current) return;

    const { Engine, Render, World, Bodies, Runner, Events, Query } = Matter;

    const engine = Engine.create({ enableSleeping: true });
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
        pixelRatio: window.devicePixelRatio || 2,
      },
    });
    renderRef.current = render;

    const handleClick = (e: MouseEvent) => {
      const rect = render.canvas.getBoundingClientRect();
      // 캔버스 실제 크기와 스타일 크기 비율 계산
      const scaleX = render.canvas.width / rect.width;
      const scaleY = render.canvas.height / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX / (window.devicePixelRatio || 2);
      const mouseY = (e.clientY - rect.top) * scaleY / (window.devicePixelRatio || 2);

      const bodies = Matter.Composite.allBodies(engine.world);
      const clickedBodies = Query.point(bodies, { x: mouseX, y: mouseY });

      if (clickedBodies.length > 0) {
        const clickedBody = clickedBodies[0];
        const task = marbleMapRef.current.get(clickedBody);
        if (task) {
          setTooltip({
            text: task.text,
            x: clickedBody.position.x,
            y: clickedBody.position.y - 25, // 구슬 바로 위
            taskId: task.id,
          });
        }
      } else {
        setTooltip(null);
      }
    };

    render.canvas.addEventListener('click', handleClick);

    // 구슬 광택 효과 커스텀 렌더링
    Events.on(render, "afterRender", () => {
      const context = render.context;
      const bodies = Matter.Composite.allBodies(engine.world);

      bodies.forEach((body) => {
        if (body.circleRadius && (body as any).plugin?.marbleColor) {
          const { x, y } = body.position;
          const radius = body.circleRadius;
          const color = (body as any).plugin.marbleColor;

          const gradient = context.createRadialGradient(
            x - radius * 0.3, y - radius * 0.3, radius * 0.1,
            x, y, radius
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
      } else if (settleTimerRef.current) {
        clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
    });

    const wallOptions = { isStatic: true, render: { visible: false } };
    const ground = Bodies.rectangle(width / 2, height + 10, width, 30, wallOptions);
    const leftWall = Bodies.rectangle(-10, height / 2, 30, height, wallOptions);
    const rightWall = Bodies.rectangle(width + 10, height / 2, 30, height, wallOptions);

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
  }, [checkSettled]);

  useEffect(() => {
    if (!engineRef.current) return;
    const newMarbles = marbles.filter(m => !renderedIdsRef.current.has(m.id));

    newMarbles.forEach((task, i) => {
      const color = task.color || MarbleFactory.getRandomColor();
      const x = task.position_x ?? (150 + (Math.random() - 0.5) * 50);
      const y = task.position_y ?? (-50 - i * 30);

      const marble = MarbleFactory.createWithColor(x, y, 22, color);
      Matter.World.add(engineRef.current!.world, marble);
      renderedIdsRef.current.add(task.id);
      marbleMapRef.current.set(marble, task);
    });

    // 기존 구슬의 task 데이터도 최신으로 갱신 (수정 반영)
    marbleMapRef.current.forEach((oldTask, body) => {
      const updated = marbles.find(m => m.id === oldTask.id);
      if (updated) marbleMapRef.current.set(body, updated);
    });
  }, [marbles]);

  // 툴팁 렌더링을 위한 안전한 가드
  const renderTooltip = () => {
    if (!tooltip) return null;

    const containerWidth = sceneRef.current?.clientWidth || 300;
    const threshold = 60; // 벽에 붙었다고 판단할 기준 (maxWidth의 절반 정도)
    const padding = 10;   // 벽면 여백

    // 1. 상태 판정 (왼쪽 / 오른쪽 / 중앙)
    const isLeft = tooltip.x < threshold;
    const isRight = tooltip.x > containerWidth - threshold;

    // 2. 가변 스타일 값 계산
    // 왼쪽이면 10px 고정, 오른쪽이면 끝-10px 고정, 아니면 구슬 위치
    const leftPos = isLeft ? padding : isRight ? containerWidth - padding : tooltip.x;

    // 왼쪽이면 0%(오른쪽으로 자람), 오른쪽이면 -100%(왼쪽으로 자람), 아니면 -50%
    const translateX = isLeft ? "0%" : isRight ? "-100%" : "-50%";

    const textAlign = isLeft ? "left" : isRight ? "right" : "center";

    return (
      <div
        style={{
          position: "absolute",
          left: leftPos,
          top: tooltip.y + 15,
          transform: `translate(${translateX}, -100%)`,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "8px 12px",
          borderRadius: "8px",
          fontSize: "12px",
          fontWeight: "500",
          textAlign: textAlign,
          zIndex: 10,
          pointerEvents: "auto",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          width: "max-content",
          maxWidth: "130px",
          whiteSpace: "normal",
          wordBreak: "break-all",
          overflowWrap: "break-word",
          lineHeight: "1.4",
          marginBottom: "8px",
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (onMarbleClick) onMarbleClick(tooltip.taskId);
          setTooltip(null);
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            justifyContent: isLeft ? "flex-start" : isRight ? "flex-end" : "center"
          }}
        >
          {tooltip.text}
          <Pencil size={11} style={{ opacity: 0.7, flexShrink: 0 }} />
        </span>
      </div>
    );
  };

  return (
    <div
      ref={sceneRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {renderTooltip()}
    </div>
  );
}