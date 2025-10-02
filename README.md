# FE7_project_movieclub
FE7 2차 2팀 프로젝트 "Movie Club"

영화 정보 조회와 리뷰 공유, 댓글·좋아요·메시지 등 소셜 기능을 갖춘 영화 커뮤니티 플랫폼

## 🚀 기술 스택
- React, React Router
- TypeScript
- Tailwind CSS
- Supabase

## 📂 프로젝트 구조


## 🌱 브랜치 네이밍 규칙
| 브랜치 타입 | 네이밍 규칙            | 예시                        | 설명                  |
|-------------|------------------------|-----------------------------|-----------------------|
| 기능 개발   | `feature/<기능명>`     | `feature/login`             | 새로운 기능 개발      |
| 버그 수정   | `fix/<이슈번호>-<설명>`| `fix/123-todo-delete-error` | 버그 수정             |
| 리팩토링    | `refactor/<설명>`      | `refactor/auth-flow`        | 코드 구조/성능 개선   |
| 배포        | `develop`       | `develop`            | 기능 통합      |

## 🎨 Gitmoji
| 이모지  | 코드        | 설명                                | 예시 커밋 메시지                  |
|---------|-------------|-------------------------------------|-----------------------------------|
| ✨      | `:sparkles:`| 새로운 기능 추가                     | `✨ feat: 로그인 기능 추가`         |
| 🐛      | `:bug:`     | 버그 수정                           | `🐛 fix: 리뷰 삭제 안되던 문제 수정` |
| ♻️      | `:recycle:` | 코드 리팩토링                       | `♻️ refactor: auth 로직 정리`       |
| 📝      | `:memo:`    | 문서 추가/수정                      | `📝 docs: README 브랜치 규칙 추가`  |
| 🎨      | `:art:`     | 코드 포맷/스타일 개선 (기능 변경X)   | `🎨 style: 변수명 카멜케이스로 수정`        |
| ✅      | `:white_check_mark:`| 테스트 추가/수정            | `✅ test: 유저 로그인 테스트 추가`  |
| 🔧      | `:wrench:`  | 설정 파일 수정                      | `🔧 config: ESLint 설정 업데이트`   |
| 🔥      | `:fire:`    | 코드/파일 삭제                      | `🔥 remove: 불필요한 mock 데이터 제거` |
| 📦      | `:package:` | 패키지 추가/업데이트                | `📦 build: supabase-js 버전 업그레이드` |
| 🚧      | `:construction:` | 작업 진행 중 (WIP)             | `🚧 wip: 소셜 로그인 기능 구현 중`  |


## 📝 주요 기능
- 🔐 Supabase Auth (회원가입/로그인/로그아웃)
- 📄 Supabase Database 연동 (CRUD)
- 🗂️ 파일 업로드 (Storage)
