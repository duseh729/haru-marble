
# 🔮 Haru Marble: 성취감을 채우는 유리병 (Done List)

> **"오늘의 한 일을 구슬로 만들어 유리병을 채워보세요."** > 텍스트뿐인 투두 리스트에 **Matter.js 물리 엔진**을 더해 시각적인 성취감을 주는 MVP 프로젝트

## 📸 Preview

## ✨ Key Features

* **물리 기반 인터랙션:** 할 일을 입력하면 구슬(Marble)이 생성되어 중력에 의해 아래로 떨어집니다.
* **Matter.js 활용:** 구슬끼리 부딪히고 쌓이는 자연스러운 물리 효과를 구현했습니다.
* **간편한 기록:** 복잡한 기능 없이 '할 일 입력'과 '시각적 보상'에 집중했습니다.
* **SEO 최적화:** React Helmet Async를 사용하여 SPA 환경에서도 검색 엔진 최적화(SEO)를 고려했습니다.

## 🛠 Tech Stack

* **Framework:** React (Vite), TypeScript
* **Physics Engine:** Matter.js
* **Routing:** React Router DOM
* **SEO:** React Helmet Async
* **Package Manager:** Yarn

## 📂 Project Structure

```bash
src/
├── components/
│   └── PhysicsJar.tsx    # Matter.js 물리 엔진 로직 (유리병, 구슬 구현)
├── pages/
│   ├── LandingPage.tsx   # 서비스 소개 페이지 (SEO 타겟)
│   └── AppPage.tsx       # 실제 기능 페이지 (할 일 입력)
├── App.tsx               # 라우팅 설정
└── main.tsx              # Helmet Provider 설정
```

## Getting Started

이 프로젝트는 **Yarn**을 사용합니다.

**Bash**

```
# 1. Repository Clone
git clone [https://github.com/your-username/done-list.git](https://github.com/your-username/done-list.git)

# 2. Install Dependencies
cd done-list
yarn install

# 3. Run Development Server
yarn dev
```

## Roadmap

* [X] **Web MVP:** 물리 엔진을 적용한 웹 버전 구현
* [ ] **Mobile App:** React Native WebView를 활용한 하이브리드 앱 출시
* [ ] **Data Persistence:** LocalStorage 및 데이터베이스 연동
* [ ] **Customization:** 구슬 색상 및 유리병 디자인 변경 기능
