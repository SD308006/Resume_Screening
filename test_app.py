
from flask import Flask, request, jsonify, send_from_directory, after_this_request
from utils.preprocess import extract_text_from_pdf, extract_text_from_docx, calculate_similarity
from utils.config import Config
import pandas as pd
import os
import logging
import time

# ======================= [ LOGGING SETUP ] =======================
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# ======================= [ FLASK APP CONFIG ] =======================
app = Flask(__name__, static_folder='static')
app.config['UPLOAD_FOLDER'] = Config.UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = Config.MAX_FILE_SIZE

# ======================= [ DYNAMIC SKILL LOADER ] =======================
def load_skills_by_role():
    path = os.path.join(os.path.dirname(__file__), '..', 'data', 'UpdatedResumeDataSet.csv')
    try:
        df = pd.read_csv(path, encoding='utf-8', errors='ignore')
        df.dropna(subset=['Category', 'Resume'], inplace=True)
        skill_db = {}

        for role in df['Category'].unique():
            resumes = df[df['Category'] == role]['Resume'].str.lower().str.replace(r'[^a-zA-Z\s]', ' ', regex=True)
            words = " ".join(resumes.tolist()).split()
            skill_freq = pd.Series(words).value_counts()
            skill_db[role.lower()] = skill_freq.head(30).index.tolist()
        
        return skill_db
    except Exception as e:
        logger.error(f"Failed to load skills from dataset: {str(e)}")
        return {}

# Load once
JOB_SKILLS_DB = load_skills_by_role()

# ======================= [ RECOMMENDATION FUNCTION ] =======================
def generate_recommendations(missing_skills, score):
    recommendations = []
    if score < 70:
        recommendations.append("Focus on adding more relevant keywords from the job description.")
    if missing_skills:
        recommendations.append(f"Consider highlighting experience with {', '.join(missing_skills[:2])}.")
    if len(missing_skills) > 2:
        recommendations.append("Add additional technical skills to strengthen your profile.")
    recommendations.append("Quantify your achievements with specific metrics for better impact.")
    return recommendations[:3]

# ======================= [ ROUTES ] =======================
@app.route('/', methods=['GET'])
def home():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    time.sleep(2)
    logger.debug("Received POST request to /api/analyze")

    if 'resume' not in request.files:
        return jsonify({"error": "No resume file provided"}), 400
    if not request.form.get('jobDescription'):
        return jsonify({"error": "Job description is required"}), 400

    resume_file = request.files['resume']
    job_description = request.form['jobDescription']
    job_role = request.form.get('jobRole', '').strip().lower()

    if resume_file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    if not Config.allowed_file(resume_file.filename):
        return jsonify({"error": "Unsupported file format. Use PDF, DOC, DOCX, or TXT"}), 400
    if resume_file.content_length > Config.MAX_FILE_SIZE:
        return jsonify({"error": "File exceeds 5MB limit"}), 400

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], resume_file.filename)
    resume_file.save(file_path)

    try:
        if resume_file.filename.lower().endswith('.pdf'):
            resume_text = extract_text_from_pdf(file_path)
        elif resume_file.filename.lower().endswith(('.doc', '.docx')):
            resume_text = extract_text_from_docx(file_path)
        elif resume_file.filename.lower().endswith('.txt'):
            resume_text = resume_file.read().decode('utf-8', errors='ignore')
        else:
            os.remove(file_path)
            return jsonify({"error": "Unsupported file format"}), 400
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        return jsonify({"error": f"Error processing file: {str(e)}"}), 500

    expected_skills = JOB_SKILLS_DB.get(job_role, [])
    if not expected_skills:
        if os.path.exists(file_path):
            os.remove(file_path)
        return jsonify({"error": f"No skill data found for job role '{job_role}'"}), 400

    try:
        score, matching_skills, missing_skills = calculate_similarity(resume_text, job_description, expected_skills)
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        return jsonify({"error": f"Error analyzing resume: {str(e)}"}), 500

    recommendations = generate_recommendations(missing_skills, score)

    result = {
        "score": round(score, 2),
        "matchingSkills": matching_skills,
        "missingSkills": missing_skills,
        "recommendations": recommendations
    }

    @after_this_request
    def cleanup(response):
        if os.path.exists(file_path):
            os.remove(file_path)
        return response

    return jsonify(result)

# ======================= [ RUN APP ] =======================
if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(debug=True, host='0.0.0.0', port=5000)
