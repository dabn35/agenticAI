# 비교 결과 문서

## 3.4 실습 1: 기존 MCP 서버 연결
- MCP 서버: local-utils (stdio, minimal_mcp_server.py)
- 호출 도구: ping, list_dir, read_file
- 관찰: 명확한 입력/출력 구조로 에러 처리도 간단함.

## 3.5 실습 2: Skill / Instruction 적용
- skill: .github/skills/doc-summary/SKILL.md
- instruction: .github/copilot-instructions.md
- 결과: 규칙이 명시적이어서 이후 작업에서 output/로 집중하도록 유도됨.

## 3.6 실습 3: 최소 MCP 서버 직접 만들기
- path: class/week-03-practice/minimal_mcp_server.py
- 구현: ping, list_dir, read_file, 오류 메시지
- 테스트: 위 test_log.md에 기록

## 3.7 실습 4: Copilot CLI plugin
- plugin 디렉토리: class/week-03-practice/my-plugin
- plugin.json, .mcp.json, skills/doc-summary/SKILL.md
- 관찰: plugin은 MCP+skills를 한번에 묶어서 재사용 가능

## 3.8 실습 5: hooks와 memory 설계
- 설계 메모: class/week-03-practice/hooks_memory_design.md
- 주요 규칙: output 경로 검증, 위험 도구 확인, project memory 항목 정리

## 인사이트
- 단일 스텝이 아니라 각 레이어가 합쳐져서 안정적 워크플로우가 됨
- 도구 호출만 있으면 `list_dir` 등은 빠르지만, Skill/Instruction으로 규칙을 준수시킴
