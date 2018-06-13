from database import db


class User(db.Model):

    username = db.Column(db.String(60), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, primary_key=True)
    password = db.Column(db.String(255), name='password', unique=False, nullable=False)

    def __repr__(self):
        return '<User: %(username)s - %(email)s>' % self.__dict__

    def _asdict(self):
        return dict(
            username=self.username,
            email=self.email,
        )
