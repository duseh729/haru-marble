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
    host: true, // 또는 '0.0.0.0' (모든 네트워크 인터페이스 허용)
    port: 5173, // 사용할 포트 번호 (ngrok 설정과 맞춰주세요)
  },
});
