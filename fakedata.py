from faker import Faker

from app import app
from database import db
from models import User
from models import Post
from random import randint

fake = Faker()


def fake_user(**kwargs):
    user = fake.profile()
    return User(
        username=kwargs.get('username', user['username']),
        email=user['mail'],
        password=kwargs.get('password', fake.password()),
        admin=kwargs.get("admin", 0)
    )

def fake_post(author):
    maxChars = randint(200, 400)
    return Post(
        author_id=author,
        content=fake.text(max_nb_chars=maxChars, ext_word_list=None)
    )

# for each user
def add_fake_followers(user_id):

    # decide for each other user, whether to follow or not
    for i in range(1, 22):
        rand = randint(0,21)
        if rand <= 10:
            print(User.query.filter_by(id=i).first())
            User.query.filter_by(id=user_id).first().follow(User.query.filter_by(id=i).first())
    db.session.commit()


def setup_db():
    with app.app_context():
        db.create_all()
        db.session.add(fake_user(username="admin", password="admin", admin=1))
        rand = randint(0,20)
        for i in range(20):
            db.session.add(fake_user())
            for j in range(rand):
                db.session.add(fake_post(i))
        db.session.commit()
        for i in range(1,22):
            add_fake_followers(i)


if __name__ == '__main__':
    setup_db()
