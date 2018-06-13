from faker import Faker

from app import app
from database import db
from models import User

fake = Faker()


def fake_user():
    user = fake.profile()
    return User(
        username=user['username'],
        email=user['mail'],
        password=fake.password()
    )


def setup_db():
    with app.app_context():
        db.create_all()
        for i in range(10):
            db.session.add(fake_user())
        db.session.commit()


if __name__ == '__main__':
    setup_db()
