---
name: doc-summary
description: "문서 파일을 요약하고 output/에 저장한 뒤 검증 항목을 작성합니다."
---

# Document Summary Skill

- 입력: path (요약할 파일 경로)
- 출력: output/doc_summary.txt에 요약 저장
- 검증: 3가지 검증 체크리스트 생성

문서를 읽고 5문장 이하로 요약합니다. 요약 결과는 `output/doc_summary.txt`에 저장하고, `output/doc_summary_checklist.txt`에 다음 항목을 기록합니다:
1. 원본 파일 읽기 성공 여부
2. 요약 포함 주요 이슈 3개
3. 저장 경로와 내용 길이 확인
