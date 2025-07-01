import fitz
from typing import Union

def extract_text_from_pdf(pdf_bytes: Union[bytes, bytearray]) -> str:
    text = ""
    with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text.strip()