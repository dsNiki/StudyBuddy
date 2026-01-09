import os

class Config:
    # ENV-ből olvassa (Render/Railway), local fallback
    db_url = os.getenv('DATABASE_URL') or os.getenv('MYSQL_URL') or 'mysql+pymysql://user:password@db:3306/studybuddy'
    
    if db_url.startswith('mysql://'):
        db_url = db_url.replace('mysql://', 'mysql+pymysql://', 1)
    
    SQLALCHEMY_DATABASE_URI = db_url
