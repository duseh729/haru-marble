import type { ReactNode } from "react";

interface GlassJarProps {
  children: ReactNode;
  className?: string; // Container className
  bodyClassName?: string; // Body className
}

export default function GlassJar({
  children,
  className = "",
  bodyClassName = "",
}: GlassJarProps) {
  return (
    <div className={`flex flex-col items-center w-[260px] md:w-[320px] ${className}`}>
      {/* 뚜껑 (비율 81.25% 유지) */}
      <div className="w-[81.25%] h-8 bg-gray-200 rounded-xl z-20 shrink-0"></div>
      
      {/* 유리병 본체 */}
      <div className={`rounded-b-[2rem] rounded-t-[50px] relative w-full border-4 border-gray-200 bg-white shadow-lg overflow-hidden z-10 h-[325px] md:h-[400px] ${bodyClassName}`}>
        <div className="absolute inset-0 flex justify-center items-end px-1">
          {children}
        </div>
      </div>
    </div>
  );
}
