# 보안 취약점 조치 보고서: HSTS 적용

## 1. 취약점 개요
- **항목**: HSTS(Strict-Transport-Security) 미설정
- **심각도**: 경고 (Warning)
- **대상 URL**: [https://haru-marble.com](https://haru-marble.com)

## 2. 발견된 문제 및 위험성
- **발견된 문제**: 서버 응답 헤더에 `Strict-Transport-Security` 설정이 존재하지 않음.
- **위험성**:
    - **중간자 공격(MITM)**: 사용자가 HTTP로 최초 접속 시 해커가 보안 연결(HTTPS)로의 전환을 방해하고 일반 HTTP 연결을 유지시켜 정보를 가로챌 수 있음.
    - **다운그레이드 공격**: 보안 연결을 취약한 연결로 강제 전환하는 공격에 노출됨.

## 3. 조치 내용

### 1) HSTS 적용 (보안 연결 강제)
브라우저에게 해당 사이트 접속 시 반드시 HTTPS를 사용하도록 강제하는 HSTS 헤더를 적용하였습니다.

**적용 헤더:**
`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`

### 2) CSP 적용 (XSS 방어)
허용되지 않은 스크립트 실행 및 외부 리소스 호출을 차단하기 위한 콘텐츠 보안 정책(CSP)을 수립하였습니다. 프로젝트에서 사용 중인 Supabase, Google Analytics, Pretendard 폰트 등의 리소스만 정교하게 허용하도록 설정하였습니다.

**적용 헤더:**
`Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' ...`

### Vercel 설정 적용 (`vercel.json`)
프론트엔드 배포 환경인 Vercel의 설정 파일에 보안 헤더들을 일괄 추가하였습니다.

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https://oawgqxptwuoqkbksjcqv.supabase.co https://www.google-analytics.com; connect-src 'self' https://oawgqxptwuoqkbksjcqv.supabase.co https://www.google-analytics.com https://*.api.emailjs.com; font-src 'self' https://cdn.jsdelivr.net; object-src 'none'; base-uri 'self';"
        }
      ]
    }
  ]
}
```

## 4. 적용 효과
- **보안성 향상**: 브라우저 단에서 HTTPS 접속을 강제하여 다운그레이드 공격 및 MITM 공격을 원천 봉쇄함.
- **개인정보 보호**: JWT 토큰 및 사용자 데이터가 보안이 없는 통로(HTTP)로 전송될 확률을 제거함.
- **검색 엔진 최적화(SEO)**: 보안이 강화된 사이트로 인식되어 검색 엔진 순위에 긍정적인 영향을 미침.
