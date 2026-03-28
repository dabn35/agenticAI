import json
import os
import sys

# 최소 MCP 서버: stdio 기반, 요청: {"id": ..., "tool": "<name>", "input": {...}}
# 응답: {"id": ..., "output": ...} 또는 {"id": ..., "error": ...}

TOOLS = {
    "ping": "서버 상태 확인",
    "list_dir": "지정 디렉토리의 파일/하위 디렉토리 목록 반환",
    "read_file": "지정 경로 파일의 텍스트 내용을 반환"
}


def send_response(response):
    sys.stdout.write(json.dumps(response, ensure_ascii=False) + "\n")
    sys.stdout.flush()


def handle_request(item):
    if not isinstance(item, dict):
        return {"error": "invalid_request", "message": "요청은 JSON 객체여야 합니다."}

    req_id = item.get("id")
    tool = item.get("tool")
    inp = item.get("input", {}) or {}

    if tool == "ping":
        return {"id": req_id, "output": {"status": "ok", "tools": list(TOOLS.keys())}}

    if tool == "list_dir":
        path = inp.get("path", ".")
        try:
            if not os.path.exists(path):
                raise FileNotFoundError(f"경로 없음: {path}")
            if not os.path.isdir(path):
                raise NotADirectoryError(f"디렉토리가 아님: {path}")
            children = sorted(os.listdir(path))
            return {"id": req_id, "output": {"path": os.path.abspath(path), "items": children}}
        except Exception as e:
            return {"id": req_id, "error": "list_dir_failed", "message": str(e)}

    if tool == "read_file":
        path = inp.get("path")
        if not path:
            return {"id": req_id, "error": "invalid_argument", "message": "path 입력이 필요합니다."}
        try:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            return {"id": req_id, "output": {"path": os.path.abspath(path), "content": content}}
        except Exception as e:
            return {"id": req_id, "error": "read_file_failed", "message": str(e)}

    return {"id": req_id, "error": "tool_not_found", "message": f"알 수 없는 도구: {tool}. 사용 가능 도구: {', '.join(TOOLS.keys())}"}


def main():
    send_response({"id": None, "output": {"message": "minimal MCP server started", "available_tools": TOOLS}})
    for line in sys.stdin:
        text = line.strip()
        if not text:
            continue
        try:
            request = json.loads(text)
        except json.JSONDecodeError:
            send_response({"id": None, "error": "invalid_json", "message": "JSON 구문 오류"})
            continue
        response = handle_request(request)
        send_response(response)


if __name__ == "__main__":
    main()
