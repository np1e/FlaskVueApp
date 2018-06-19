class DefaultConfig:
    # Basic Configuration
    SECRET_KEY = 'add_super-secret-key-here'
    JWT_SECRET_KEY = 'secret-key'
    # Database Configuration
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///db.sqlite'
