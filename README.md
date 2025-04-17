# 🌳 SearchForest-FE

중앙대학교 캡스톤디자인 팀 **숲송 (Soopsong)** 이 개발한 **AI 연관검색어 추론 시스템**입니다.  
이 저장소는 **프론트엔드 전용 레포지토리**입니다.  
AI 모델 및 백엔드는 별도 레포로 분리되어 있습니다.

---

## 🔥 What is SearchForest?

> "검색의 흐름을 잇다, 생각의 숲을 펼치다"

- 🌐 사용자가 입력한 검색어를 중심으로, **2-depth 연관 키워드**를 시각적으로 탐색할 수 있는 서비스입니다.
- 🧠 M3E 기반 임베딩 모델을 활용하여 **의미 기반 연관성**을 추론합니다.
- 🌳 **네트워크 그래프**와 **버블형 그래프**를 통해 직관적인 탐색 환경을 제공합니다.

---
## 🖥️ Prototype

![prototypegif](https://github.com/user-attachments/assets/b62ef574-1224-49c7-8563-e436a78d8fb0)

---
## 🧰 Tech Stack

- **React + TypeScript + Vite**
- TailwindCSS
- D3.js (네트워크 그래프 시각화)

---

## ⚙️ 실행 방법

**1. 프로젝트 설치**

```bash
npm install
```

**2. 개발 서버 실행**

```bash
npm run dev
```

**3. 빌드**

```bash
npm run build
```

---

## 📂 디렉토리 구조

```
searchforest-fe/
├── src/
│   ├── components/       # UI 컴포넌트
│   ├── pages/            # 페이지 컴포넌트
│   ├── hooks/            # 커스텀 훅
│   ├── api/              # API 통신 모듈
│   ├── assets/           # 이미지 및 정적 자원
│   └── App.tsx
├── public/
├── index.html
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 👥 팀 숲송 (Team Soopsong)

<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/katie424"><img src="https://avatars.githubusercontent.com/u/80771814?v=4" width="100px" alt=""/><br /><sub><b>Frontend : 송정현</b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/mh991221"><img src="https://avatars.githubusercontent.com/u/39687014?v=4" width="100px" alt=""/><br /><sub><b>Backend : 임민혁</b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/hyun-hyang"><img src="https://avatars.githubusercontent.com/u/51802020?v=4" width="100px" alt=""/><br /><sub><b>AI : 임지민</b></sub></a><br /></td>
     </tr>
  </tbody>
</table>

> 🙌 중앙대학교 소프트웨어학부 2025 캡스톤 프로젝트

---

## 🔗 Related Repositories

- 🤖 [searchforest-ai](https://github.com/soopsong/searchforest-ai): M3E 기반 연관 키워드 추론 AI 모델
- ⚙️ [searchforest-be](https://github.com/soopsong/searchforest-be): FastAPI 기반 백엔드 API 서버

---

## 📄 License

MIT License © 2025 Soopsong Team
