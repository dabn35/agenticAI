# 테스트 로그

## 1) MCP 서버 핑 테스트
- 명령: echo '{"id":1,"tool":"ping"}' | python class/week-03-practice/minimal_mcp_server.py
- 결과: status ok, tools [ping,list_dir,read_file]
- 검증: 기대대로 서버 초기화 및 ping 응답 정상

## 2) list_dir 테스트
- 명령: echo '{"id":2,"tool":"list_dir","input":{"path":"class/week-03-practice"}}' | python class/week-03-practice/minimal_mcp_server.py
- 결과: items에 minimal_mcp_server.py, my-plugin, etc. 포함
- 검증: 디렉토리 탐색 성공
