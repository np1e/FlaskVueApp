from flask import Blueprint, jsonify

from models import User

api = Blueprint('api', __name__)


@api.route('/users', methods=['GET'])
def users():
    users = User.query.all()
    return jsonify(users=[u._asdict() for u in users])

@api.route('/posts', methods=['GET'])
def posts():
    posts = {
        { "id":1, "author":'nick', "content":'dies ist ein testpost' },
        { "id":2, "author":'jakob', "content":'dies ist ein testpost' },
        { "id":3, "author":'valentin', "content":'dies ist ein testpost' }
    }
    return jsonify(posts=[p._asdict() for p in posts])
