# api/extract.py
import pdfplumber
import io
import json

def handler(request):
    if request.method != "POST":
        return (json.dumps({"error": "Only POST method allowed"}), 405, {"Content-Type": "application/json"})

    try:
        uploaded_file = request.files.get("file")
        if not uploaded_file:
            return (json.dumps({"error": "No file uploaded"}), 400, {"Content-Type": "application/json"})

        if not uploaded_file.filename.lower().endswith(".pdf"):
            return (json.dumps({"error": "Only PDF files allowed"}), 400, {"Content-Type": "application/json"})

        content = uploaded_file.read()
        pages = []
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            for i, page in enumerate(pdf.pages, start=1):
                text = page.extract_text() or ""
                pages.append({"page": i, "text": text})

        return (json.dumps({"pages": pages}), 200, {"Content-Type": "application/json"})

    except Exception as e:
        return (json.dumps({"error": str(e)}), 500, {"Content-Type": "application/json"})
