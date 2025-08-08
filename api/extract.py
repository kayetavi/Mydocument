from flask import Flask, request, jsonify
import pdfplumber
import io

app = Flask(__name__)

@app.route("/api/extract", methods=["POST"])
def extract_pdf():
    uploaded_file = request.files.get("file")
    if not uploaded_file:
        return jsonify({"error": "No file uploaded"}), 400

    if not uploaded_file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Only PDF files allowed"}), 400

    try:
        content = uploaded_file.read()
        pages = []
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            for i, page in enumerate(pdf.pages, start=1):
                text = page.extract_text() or ""
                pages.append({"page": i, "text": text})
        return jsonify({"pages": pages})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
