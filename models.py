from database import db
from datetime import datetime

followers = db.Table('followers',
    db.Column('follower_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('followed_id', db.Integer, db.ForeignKey('user.id'))
)

class User(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(60), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    ''' Passwörter besser nicht im Plaintext speichern.
        Richtig wäre Salt + Hash(Salt + Password) in der Datenbank zu speichern.
    '''
    password = db.Column(db.String(255), name='password', unique=False, nullable=False)
    # Versionierung der Rows um konkurrierender Änderungen zu entdecken
    version_id = db.Column(db.Integer, nullable=False)
    descrip = db.Column(db.String(140))
    registered = db.Column(db.DateTime, default=datetime.utcnow, nullable = False)
    admin = db.Column(db.Integer, default=0)
    restricted = db.Column(db.Integer, default=0)
    avatar = db.Column(db.Integer, default=0)
    posts = db.relationship('Post', backref='user', lazy=True)
    followed = db.relationship(
        'User', secondary=followers,
        primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        backref=db.backref('followers', lazy='dynamic'),
        lazy='dynamic'
    )

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

    def follow(self, user):
        if not self.is_following(user):
            print(self,"follows now", user)
            self.followed.append(user)

    def unfollow(self, user):
        if self.is_following(user):
            self.followed.remove(user)

    def is_following(self, user):
        return self.followed.filter(
            followers.c.followed_id == user.id).count() > 0

    def get_follower(self):
        return self.followers

    def get_followed(self):
        return self.followed


class Post(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    content = db.Column(db.String(400), nullable = False)
    created = db.Column(db.DateTime, default=datetime.utcnow, nullable = False)
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
