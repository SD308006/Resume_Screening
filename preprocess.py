import spacy
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
import PyPDF2
from docx import Document

try:
    nlp = spacy.load('en_core_web_sm')
except OSError:
    print("Please download the 'en_core_web_sm' model by running: python -m spacy download en_core_web_sm")
    exit(1)

def extract_text_from_pdf(file_path):
    """Extract text from PDF file."""
    with open(file_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
        return text

def extract_text_from_docx(file_path):
    """Extract text from DOCX file."""
    with open(file_path, 'rb') as file:
        doc = Document(file)
        return "\n".join([paragraph.text for paragraph in doc.paragraphs])

def preprocess_text(text):
    """Preprocess text using SpaCy for tokenization and lemmatization."""
    doc = nlp(text.lower())
    tokens = [token.lemma_ for token in doc if token.is_alpha and not token.is_stop]
    return " ".join(tokens)

def extract_skills(text, skill_list):
    """Extract skills from text based on a predefined skill list."""
    tokens = preprocess_text(text).split()
    return [skill for skill in skill_list if skill in tokens]

def calculate_similarity(resume_text, job_text, skill_list):
    """Calculate similarity score using TF-IDF and cosine similarity."""
    vectorizer = TfidfVectorizer(tokenizer=lambda x: preprocess_text(x).split(), lowercase=False)
    tfidf_matrix = vectorizer.fit_transform([resume_text, job_text])
    similarity = np.dot(tfidf_matrix[0].toarray(), tfidf_matrix[1].toarray().T)[0][0]
    matching_skills = extract_skills(resume_text, skill_list)
    missing_skills = [skill for skill in skill_list if skill not in matching_skills]
    return min(similarity * 100, 100), matching_skills, missing_skills