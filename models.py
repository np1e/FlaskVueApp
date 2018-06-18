from database import db


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
            version_id=self.version_id
        )

    def update(self, json):
        for key, value in json.items():
            if hasattr(self, key):
                setattr(self, key, value)
