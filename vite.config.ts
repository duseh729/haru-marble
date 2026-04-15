import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // 로컬망(192.168.x.x) 및 ngrok 접속 허용
    port: 5173,
    allowedHosts: true, // Vite 5+ 보안 정책: ngrok 같은 터널 주소 접속 허용
    hmr: {
      clientPort: 443, // ngrok HTTPS 터널 사용 시 HMR이 끊기지 않도록 설정
    },
  },
  build: {
    sourcemap: false, // 프로덕션 빌드에서 소스맵 생성 중단 (보안 취약점 조치)
  },
});
