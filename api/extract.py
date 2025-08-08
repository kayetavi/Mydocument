import pdfplumber
import io
import json
from werkzeug.datastructures import FileStorage
from werkzeug.formparser import parse_form_data

def handler(request):
    try:
        if request.method != "POST":
            return (405, {"Content-Type": "application/json"}, json.dumps({"error": "Only POST allowed"}))

        # Parse form-data (file upload)
        _, form, files = parse_form_data(request.environ, silent=False)
        uploaded_file = files.get("file")

        if not uploaded_file:
            return (400, {"Content-Type": "application/json"}, json.dumps({"error": "No file uploaded"}))

        if not uploaded_file.filename.lower().endswith(".pdf"):
            return (400, {"Content-Type": "application/json"}, json.dumps({"error": "Only PDF files allowed"}))

        # Read and extract PDF text
        content = uploaded_file.read()
        pages = []
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            for i, page in enumerate(pdf.pages, start=1):
                text = page.extract_text() or ""
                pages.append({"page": i, "text": text})

        return (200, {"Content-Type": "application/json"}, json.dumps({"pages": pages}, ensure_ascii=False))

    except Exception as e:
        return (500, {"Content-Type": "application/json"}, json.dumps({"error": str(e)}))
