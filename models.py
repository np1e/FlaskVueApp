from database import db
import datetime


class User(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(60), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    ''' Passwörter besser nicht im Plaintext speichern.
        Richtig wäre Salt + Hash(Salt + Password) in der Datenbank zu speichern.
    '''
    password_hash = db.Column(db.String(255), name='password', unique=False, nullable=False)
    # Versionierung der Rows um konkurrierender Änderungen zu entdecken
    version_id = db.Column(db.Integer, nullable=False)
    descrip = db.Column(db.String(140))
    registered = db.Column(Datetime(timezone=True), server_default=datetime.datetime.utcnow, nullable = False)
    admin = db.Column(db.Integer, default=0)
    restricted = db.Column(db.Integer, default=0)
    avatar = db.Column(db.Integer, default=0)


    __mapper_args__ = {
        "version_id_col": version_id
    }

    def __repr__(self):
        return '<User: %(username)s - %(email)s>' % self.__dict__

    def _asdict(self):
        return dict(
            id=self.id,
            username=self.username,
            email=self.email,
            version_id=self.version_id,
            descrip=self.descrip,
            registered = self.registered,
            admin=self.admin,
            restricted=self.restricted,
            avatar=self.avatar
        )

    def update(self, json):
        for key, value in json.items():
            if hasattr(self, key):
                setattr(self, key, value)

class Post(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer, ForeignKey("User.id"), nullable=False)
    content = db.Column(db.String(300), nullable = False)
    created = db.Column(Datetime(timezone=True), server_default=datetime.datetime.utcnow, nullable = False)
    reviewed = db.Column(db.Integer, default=0, nullable=False)

    def __repr__(self):
        return '<Post: %(content)s by user %(author_id)s>' % self.__dict__

    def _asdict(self):
        return dict(
            id=self.id,
            author_id=self.author_id,
            content=self.content,
            created=self.created,
            reviewed=self.reviewed
        )

    def update(self, json):
        for key, value in json.items():
            if hasattr(self, key):
                setattr(self, key, value)

class Follows(db.Model):

    follower_id = db.Column(db.Integer, primary_key=True, ForeignKey("User.id"), nullable=False)
    user_id = db.Column(db.Integer, primary_key=True, ForeignKey("User.id"), nullable=False)

    def __repr__(self):
        return '<User %(follower_id)s follows User %(user_id)s>' %self.__dict__

    def _asdict(self):
        return dict(
            follower_id=self.follower_id,
            user_id= self.user_id
        )

    def update(self, json):
        for key, value in json.items():
            if hasattr(self, key):
                setattr(self, key, value)
