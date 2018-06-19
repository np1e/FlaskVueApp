from flask import Flask, jsonify, render_template, request
from flask_jwt_extended import JWTManager, create_access_token

from api import api
from database import db
from models import User
from http import HTTPStatus

app = Flask(__name__)
app.config.from_object('config.DefaultConfig')
# setup sqlalchemy
db.init_app(app)
# setup json web tokens for protected routes
jwt = JWTManager(app)
# register the api
app.register_blueprint(api, url_prefix='/api')


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/api/login', methods=['POST'])
def login():
    '''
    Einfacher Login mit JWT.
    https://flask-jwt-extended.readthedocs.io/en/latest/basic_usage.html
    '''
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), HTTPStatus.BAD_REQUEST

    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not username:
        return jsonify({"msg": "Missing username parameter"}),  HTTPStatus.BAD_REQUEST
    if not password:
        return jsonify({"msg": "Missing password parameter"}),  HTTPStatus.BAD_REQUEST

    user = User.query.filter_by(username=username, password_hash=password).first()
    if user is None:
        return jsonify({"msg": "Bad username or password"}),  HTTPStatus.UNAUTHORIZED

    # Identity can be any data that is json serializable
    access_token = create_access_token(identity=user.email)
    return jsonify(access_token=access_token, admin=user.admin, restricted=user.restricted, id=user.id)


if __name__ == '__main__':
    app.run()
