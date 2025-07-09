# Resume_Screening

# Resume Screening Tool

A web-based application to analyze resumes against job descriptions, calculate similarity scores, and provide skill recommendations.

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
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

This Resume Screening Tool is designed to assist recruiters and job seekers. It allows users to upload resumes and compare them with job descriptions using TF-IDF vectorization and cosine similarity. The system calculates match scores and provides recommendations based on missing skills.

## Features

- Upload resumes in PDF, DOC, DOCX, or TXT format.
- Input job descriptions for analysis.
- Automatically extract and preprocess text from resumes and JDs.
- Calculate similarity scores using TF-IDF and cosine similarity.
- Identify matching and missing skills.
- Generate recommendations to improve resumes.
- Clean and responsive user interface.

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

4. Open your browser and navigate to:

   ```
   http://localhost:5000
   ```

## Usage

- Upload your resume.
- Enter a job description.
- Select the job role category.
- Click "Analyze".
- View the similarity score, matched skills, missing skills, and tailored recommendations.

## Flowchart

The process flow of the system is shown below:

![Flowchart](assets/flowchart.png)

## Project Structure

```
resume-screening-tool/
│
├── app.py                     # Main Flask app
├── utils/
│   ├── preprocess.py         # Text extraction and similarity logic
│   └── config.py             # Configuration settings
├── static/                   # Frontend files (HTML, CSS, JS)
├── data/
│   └── UpdatedResumeDataSet.csv
├── assets/
│   └── flowchart.png         # Visual flowchart
├── requirements.txt          # Python dependencies
└── README.md                 # Project documentation
```

## Dependencies

- Flask
- pandas
- scikit-learn
- python-docx
- PyMuPDF (fitz)
- numpy

## Configuration

Configuration settings like file upload size and allowed extensions are managed in `utils/config.py`.

## Development

To contribute:

1. Fork the repository
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make changes and commit:
   ```bash
   git commit -m "Add feature"
   ```
4. Push and create a Pull Request

## Contributing

Contributions are welcome. Please open an issue or submit a pull request for any feature requests, bug fixes, or improvements.

## License

This project is licensed under the MIT License.

## Contact

Developer: Sudipta Das  
Email: diptasu.das001@gmaail.com  
Location: Subidbazar, Sylhet, Bangladesh
