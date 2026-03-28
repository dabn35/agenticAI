# hooks 및 memory 설계 메모

## 목표
- output/ 생성 여부 자동 검증
- 주요 위험 명령 차단 정책과 로그 보존
- 세션 간 일관성을 위한 기본 프로젝트 메모

## hooks 아이디어

1. PostToolUse 후크
   - 모든 도구 사용 후 결과에 `output/` 생성 예상 항목이 있으면 실제 경로 존재 여부 검사
   - 없으면 경고 메시지 생성

2. PreToolUse 후크
   - `rm`, `del`, `shutil.rmtree` 등 파괴적 도구 호출 시 사용자 2차 확인 필요
   - 확인 없이 일시 중단

3. Stop 후크
   - 세션 종료 시 `class/week-03-practice/test_log.md`에 실행 요약 덧붙임

## memory 아이디어

- 저장소 출력 폴더: output/
- 기본 테스트 명령: pytest
- 사용 금지 명령: 시스템 중요한 폴더 삭제 (C:\\Windows, C:\\Program Files)
- 나중에 재사용 툴: doc-summary skill, local-utils MCP
