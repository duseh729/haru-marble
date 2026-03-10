# 🔮 Haru Marble — 성취감을 채우는 유리병

> **"오늘 한 일을 구슬로 만들어, 유리병을 채워보세요."**
>
> 텍스트뿐인 투두리스트에 **Matter.js 물리 엔진**을 더해 시각적 성취감을 선사하는 Done List 서비스

<br>

## ✨ Key Features

| 기능                          | 설명                                                                               |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| 🎱 **물리 기반 인터랙션**     | 할 일을 입력하면 구슬(Marble)이 생성되어 중력에 의해 아래로 떨어집니다.            |
| 💥 **자연스러운 물리 효과**   | Matter.js를 활용해 구슬끼리 부딪히고 쌓이는 리얼한 물리 시뮬레이션을 구현했습니다. |
| 🔐 **회원가입 & 로그인**      | JWT 토큰 기반 인증 시스템으로 개인 데이터를 안전하게 보호합니다.                   |
| 🍾 **유리병 컬렉션**          | 여러 개의 유리병을 만들어 주제별로 성취를 분류하고 관리할 수 있습니다.             |
| 🎨 **구슬 색상 커스터마이징** | 원하는 색상의 구슬을 선택해 나만의 유리병을 꾸밀 수 있습니다.                      |
| 📱 **모바일 최적화 레이아웃** | 모바일 환경에서도 최적화된 UI를 제공합니다.                                        |
| 🔍 **SEO 최적화**             | React Helmet Async를 사용해 SPA에서도 검색 엔진 최적화를 지원합니다.               |

<br>

## 🛠 Tech Stack

### Frontend

| 기술                          | 설명                     |
| ----------------------------- | ------------------------ |
| **React 19** + **TypeScript** | 프레임워크 / 타입 안전성 |
| **Vite 7**                    | 빌드 도구                |
| **Matter.js**                 | 2D 물리 엔진             |
| **Tailwind CSS 4**            | 유틸리티 기반 스타일링   |
| **React Router DOM 7**        | 클라이언트 사이드 라우팅 |
| **React Helmet Async**        | SEO 메타 태그 관리       |
| **Supabase**                  | 소셜 로그인 & BaaS       |
| **Lucide React**              | 아이콘 라이브러리        |
| **Vitest**                    | 테스트 프레임워크        |

### Backend

| 기술                    | 설명               |
| ----------------------- | ------------------ |
| **Express 5**           | REST API 서버      |
| **Prisma** + **SQLite** | ORM & 데이터베이스 |
| **JWT**                 | 토큰 기반 인증     |
| **bcryptjs**            | 비밀번호 암호화    |

<br>

## 📂 Project Structure

```
haru-marble/
├── public/                   # 정적 파일
├── server/                   # 백엔드 서버
│   ├── prisma/
│   │   └── schema.prisma     # DB 스키마 (User, Task 모델)
│   └── index.ts              # Express API 서버 (인증, 할 일 CRUD)
│
├── src/                      # 프론트엔드 소스
│   ├── api/
│   │   ├── auth.ts           # 인증 API (로그인/회원가입/토큰 관리)
│   │   ├── client.ts         # API 클라이언트 설정
│   │   ├── social.ts         # 소셜 로그인 API
│   │   └── tasks.ts          # 할 일 & 유리병 API
│   │
│   ├── components/
│   │   ├── PhysicsJar.tsx    # Matter.js 물리 엔진 (유리병 & 구슬 렌더링)
│   │   ├── ColorPickerDropdown.tsx  # 구슬 색상 선택기
│   │   └── MobileLayout.tsx  # 모바일 레이아웃 래퍼
│   │
│   ├── pages/
│   │   ├── LandingPage.tsx   # 서비스 소개 랜딩 페이지
│   │   ├── LoginPage.tsx     # 로그인 페이지
│   │   ├── RegisterPage.tsx  # 회원가입 페이지
│   │   ├── AppPage.tsx       # 메인 앱 (할 일 입력 & 유리병)
│   │   ├── CollectionPage.tsx # 유리병 컬렉션 관리
│   │   ├── SettingsPage.tsx  # 설정 페이지
│   │   └── AuthCallbackPage.tsx  # 소셜 로그인 콜백
│   │
│   ├── lib/
│   │   ├── supabase.ts       # Supabase 클라이언트 설정
│   │   └── utils.ts          # 유틸리티 함수
│   │
│   ├── utils/
│   │   └── MarbleFactory.tsx # 구슬 생성 팩토리
│   │
│   ├── App.tsx               # 라우팅 & 인증 가드 설정
│   └── main.tsx              # 앱 엔트리포인트
│
├── package.json
├── vite.config.ts
└── tsconfig.json
```

<br>

## 🚀 Getting Started

### 사전 요구사항

- **Node.js** 18+
- **Yarn** (프론트엔드)
- **npm** (백엔드)

### 1. 레포지토리 클론

```bash
git clone https://github.com/duseh729/haru-marble.git
cd haru-marble
```

### 2. 프론트엔드 설정

```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev
```

### 3. 백엔드 설정

```bash
cd server

# 의존성 설치
npm install

# 환경변수 설정 (.env 파일 생성)
# DATABASE_URL="file:./dev.db"
# JWT_SECRET="your-secret-key"

# Prisma 마이그레이션 실행
npx prisma migrate dev

# 서버 실행
npm run dev
```

<br>

## 📡 API Endpoints

| Method | Endpoint        | 설명                        | 인증 |
| ------ | --------------- | --------------------------- | ---- |
| `POST` | `/api/register` | 회원가입                    | ❌   |
| `POST` | `/api/login`    | 로그인 (JWT 발급)           | ❌   |
| `GET`  | `/api/tasks`    | 오늘의 할 일 목록 조회      | ✅   |
| `POST` | `/api/tasks`    | 할 일 추가 (일일 10개 제한) | ✅   |

<br>

## 🗺 Roadmap

- [x] **Web MVP** — 물리 엔진을 적용한 웹 버전 구현
- [x] **회원 시스템** — JWT 기반 회원가입 & 로그인
- [x] **유리병 컬렉션** — 여러 유리병 생성 및 관리
- [x] **구슬 커스터마이징** — 컬러 피커로 구슬 색상 선택
- [x] **모바일 레이아웃** — 반응형 모바일 최적화 UI
- [ ] **Mobile App** — React Native WebView를 활용한 하이브리드 앱 출시
- [ ] **소셜 기능** — 유리병 공유 및 친구 시스템
- [ ] **통계 & 리포트** — 주간/월간 성취 리포트

<br>

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
