# 운세마루 (FortuneMaru)

무료 운세·타로 웹사이트 - 정적 사이트로 Netlify/GitHub Pages 배포 가능

## 📋 목차

- [소개](#소개)
- [기능](#기능)
- [기술 스택](#기술-스택)
- [폴더 구조](#폴더-구조)
- [설치 및 실행](#설치-및-실행)
- [배포 가이드](#배포-가이드)
- [커스터마이징](#커스터마이징)
- [라이선스](#라이선스)

## 🌟 소개

운세마루는 무료로 사주, 타로, 별자리 운세 등을 제공하는 정적 웹사이트입니다. 서버 없이 클라이언트 사이드에서만 동작하며, Netlify나 GitHub Pages에 쉽게 배포할 수 있습니다.

## ✨ 기능

### 1. 오늘의 운세
- 생년월일/시 입력 기반
- 동일 날짜 동일 결과 보장 (시드 기반 알고리즘)
- 총운, 애정운, 직장운, 재물운, 건강운 제공

### 2. 띠별 운세
- 12지신 기준
- 오늘/이번 주/올해 운세
- 날짜 기반 고정 결과

### 3. 별자리 운세
- 12별자리 기준
- 오늘/이번 주/이번 달 운세
- 날짜 기반 고정 결과

### 4. 타로
- 오늘의 타로 (1장 선택)
- 애정운/직장운/재물운 (3장 선택)
- 카드 중복 방지
- 새로고침 시 결과 변경 (완전 랜덤)

### 5. MBTI 운세
- 16가지 MBTI 유형별 운세
- 심리검사가 아님 명시
- 유형별 특성 및 조언 제공

### 6. 꿈해몽
- 키워드 검색 기반
- 사전 정의된 키워드 매칭
- 상황별 상세 해석

## 🛠 기술 스택

- **HTML5** - 시맨틱 마크업
- **CSS3** - 반응형 디자인, CSS 변수, Flexbox/Grid
- **JavaScript (ES6)** - 모듈화된 구조
- **jQuery 3.7.1** - DOM 조작 및 이벤트 처리
- **Font Awesome 6.5.1** - 아이콘
- **Google Fonts** - Noto Sans KR, Gowun Batang

## 📁 폴더 구조

```
/fortuneteller
├── index.html              # 메인 HTML
├── README.md              # 프로젝트 설명
│
└── /assets
    ├── /css
    │   └── style.css      # 메인 스타일시트
    │
    ├── /js
    │   ├── common.js      # 공통 로직, i18n, 유틸리티
    │   ├── fortune.js     # 오늘의 운세, 띠별, 별자리
    │   ├── tarot.js       # 타로 카드 로직
    │   ├── mbti.js        # MBTI 운세
    │   └── dream.js       # 꿈해몽
    │
    └── /images
        ├── /tarot         # 타로 카드 이미지 (선택)
        └── /icons         # 아이콘, 파비콘
```

## 🚀 설치 및 실행

### 로컬 실행

1. 저장소 클론:
```bash
git clone https://github.com/yourusername/fortuneteller.git
cd fortuneteller
```

2. 로컬 서버 실행 (선택 사항):
```bash
# Python 3
python -m http.server 8000

# Node.js (npx serve)
npx serve

# VS Code Live Server 확장 사용
```

3. 브라우저에서 `http://localhost:8000` 접속

### 직접 실행
- `index.html` 파일을 브라우저로 직접 열어도 동작합니다.

## 📤 배포 가이드

### Netlify 배포

1. [Netlify](https://netlify.com) 가입
2. "New site from Git" 클릭
3. GitHub 저장소 연결
4. 빌드 설정:
   - Build command: (비워두기)
   - Publish directory: `/` 또는 `.`
5. "Deploy site" 클릭

**설정 파일 (netlify.toml)** - 선택 사항:
```toml
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages 배포

1. GitHub 저장소 Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: `main` (또는 `master`), 폴더: `/ (root)`
4. Save 클릭
5. `https://username.github.io/repository-name/` 에서 확인

### 배포 시 주의사항

1. **경로 확인**: 상대 경로 사용 (`./assets/...`)
2. **HTTPS**: 두 플랫폼 모두 HTTPS 자동 제공
3. **캐시**: CSS/JS 변경 후 강제 새로고침 필요할 수 있음
4. **도메인**: 커스텀 도메인 연결 가능

## ⚙️ 커스터마이징

### 색상 변경

`assets/css/style.css`의 CSS 변수 수정:

```css
:root {
    --color-primary: #8b7ec8;      /* 메인 색상 */
    --color-secondary: #e8a87c;    /* 보조 색상 */
    --bg-primary: #faf8ff;         /* 배경색 */
    /* ... */
}
```

### 운세 텍스트 수정

각 JS 파일의 데이터 객체 수정:
- `fortune.js` - `FortuneData.messages`
- `tarot.js` - `TarotData.majorArcana`
- `mbti.js` - `MBTIData.types`
- `dream.js` - `DreamData.dreams`

### 다국어 지원

`common.js`의 `FortuneMaru.i18n.messages`에 언어 추가:

```javascript
FortuneMaru.i18n.messages.en = {
    siteName: 'FortuneMaru',
    // ...
};
```

### 타로 카드 이미지 추가

1. `assets/images/tarot/` 폴더에 이미지 추가
2. `tarot.js`의 카드 데이터에 이미지 경로 추가:
```javascript
{
    id: 0,
    name: '바보',
    image: './assets/images/tarot/0_fool.png',
    // ...
}
```

## 📱 반응형 지원

- **Desktop**: 992px 이상
- **Tablet**: 768px ~ 992px
- **Mobile**: 768px 이하
- **Small Mobile**: 480px 이하

## ♿ 접근성

- 시맨틱 HTML 태그 사용
- ARIA 속성 적용
- 키보드 네비게이션 지원
- Skip link 제공
- 적절한 색상 대비

## 📜 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

## ⚠️ 고지

**본 서비스는 오락 및 참고용이며, 의료·법률·재정적 판단의 근거로 사용할 수 없습니다.**

---

© 2024 운세마루. All rights reserved.








