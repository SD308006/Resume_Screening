# utils/config.py
class Config:
    UPLOAD_FOLDER = 'data/resumes'
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB in bytes
    ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt'}

    @staticmethod
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS