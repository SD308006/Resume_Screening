# Resume_Screening


# Resume Screening Tool

A web-based application to analyze resumes against job descriptions, calculate similarity scores, and provide skill recommendations.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Flowchart](#flowchart)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [Development](#development)
- [Demo Video](#demo-video)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

This Resume Screening Tool is designed to assist recruiters and job seekers. It allows users to upload resumes and compare them with job descriptions using TF-IDF vectorization and cosine similarity. The system calculates match scores and provides recommendations based on missing skills.

---

## Features

- Upload resumes in PDF, DOC, DOCX, or TXT format.
- Input job descriptions for analysis.
- Automatically extract and preprocess text from resumes and JDs.
- Calculate similarity scores using TF-IDF and cosine similarity.
- Identify matching and missing skills.
- Generate recommendations to improve resumes.
- Clean and responsive user interface.

---

## Installation

### Prerequisites

- Python 3.10+
- pip (Python package manager)

### Setup Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/resume-screening-tool.git
   cd resume-screening-tool
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the application:
   ```bash
   python app.py
   ```

4. Open your browser and visit:
   ```
   http://localhost:5000
   ```

---

## Usage

1. Upload your resume.
2. Enter a job description.
3. Select the job role category.
4. Click **"Analyze"**.
5. View:
   - Similarity score
   - Matched skills
   - Missing skills
   - Tailored recommendations

---

## Flowchart

The process flow of the system is illustrated below:

![Flowchart](https://github.com/SD308006/Resume_Screening/blob/main/Flow_chart.png)

---

## Project Structure

```
resume-screening-tool/
│
├── app.py                     # Main Flask app
├── utils/
│   ├── preprocess.py          # Text extraction and similarity logic
│   └── config.py              # Configuration settings
├── static/                    # Frontend files (HTML, CSS, JS)
├── data/
│   └── UpdatedResumeDataSet.csv
├── assets/
│   └── flowchart.png          # Visual flowchart
├── requirements.txt           # Python dependencies
└── README.md                  # Project documentation
```

---

## Dependencies

- Flask
- pandas
- scikit-learn
- numpy
- python-docx
- PyMuPDF (fitz)

---

## Configuration

Basic configuration such as file upload limits and allowed file extensions can be adjusted in:
```
utils/config.py
```

---

## Development

This project works by using Natural Language Processing (NLP):

- A resume and job description are both turned into text.
- TF-IDF is used to find important keywords in both texts.
- Cosine similarity compares them and gives a percentage match.
- Based on the comparison, it finds what skills are **already there** and what skills are **missing**.
- It also gives useful suggestions to improve your resume.

The dataset used (`UpdatedResumeDataSet.csv`) is loaded once at startup to dynamically extract top skills for each job category.

---

## Demo Video

You can watch the working demo of this tool here:

**[Watch Video on Google Drive](https://drive.google.com/file/d/1RgS1NJw4zYyGqFg8gobelwQcmgUJlIp6/view?usp=drive_link)**  


---

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "Add feature"
   ```
4. Push your branch and open a Pull Request

Please open an issue for bugs, improvements, or suggestions.

---

## License

This project is licensed under ----.

---

## Contact

**Developer**: Sudipta Das  
**Email**: diptasu.das001@gmaail.com  
**Location**: Subidbazar, Sylhet, Bangladesh

