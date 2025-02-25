import sys
import cv2
import pytesseract
from pdf2image import convert_from_path
import numpy as np
import requests
import json

API_KEY = "c492fb07ee88a2cb1acafa95502dbe054e24d4c476073b861d950ad02269c72c"

def extract_text_from_pdf(pdf_path):
    try:
        images = convert_from_path(pdf_path)
        text = ""
        for img in images:
            img_cv = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
            gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
            thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
            text += pytesseract.image_to_string(thresh) + "\n"
        return text.strip()
    except Exception as e:
        return f"Error extracting text: {str(e)}"

def get_ai_response(resume_text, job_desc):
    prompt = (
        f"Resume text:\n{resume_text[:2000]}\n\n"
        f"Job description:\n{job_desc[:1000]}\n\n"
        "Analyze the resume and job description. Calculate an ATS score (0-100) based on keyword "
        "and content alignment. Identify key skills, experiences, or keywords present in the job "
        "description that are missing or underrepresented in the resume. Return a JSON object with: "
        "- 'ats_score': the calculated score (integer)"
        "- 'suggestions': a list of concise suggestions in bullet-point format (e.g., '- Add X to highlight Y')"
        "Focus on quantifiable achievements and specific technical skills."
    )
    
    url = "https://api.together.xyz/v1/completions"
    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
        "prompt": prompt,
        "max_tokens": 500,
        "temperature": 0.7
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    if response.status_code == 200:
        result = response.json().get("choices", [{}])[0].get("text", "No response")
        # Parse AI response into structured JSON (assuming AI returns JSON-like text)
        try:
            # Extract ATS score and suggestions (this assumes AI outputs a JSON string)
            data = json.loads(result)
            return data
        except:
            # Fallback: manually parse if AI doesn't return perfect JSON
            lines = result.split('\n')
            ats_score = next((int(line.split(': ')[1]) for line in lines if 'ats_score' in line.lower()), 50)
            suggestions = [line.strip() for line in lines if line.strip().startswith('-')]
            return {"ats_score": ats_score, "suggestions": suggestions}
    else:
        return {"error": f"API Error: {response.status_code} - {response.text}"}

if __name__ == "__main__":
    resume_path = sys.argv[1]
    job_desc = sys.argv[2]
    
    resume_text = extract_text_from_pdf(resume_path)
    result = get_ai_response(resume_text, job_desc)
    
    # Output result as JSON to be captured by Node.js
    print(json.dumps(result))