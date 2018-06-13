from flask import Blueprint, jsonify

from models import User

api = Blueprint('api', __name__)


@api.route('/users', methods=['GET'])
def users():
    users = User.query.all()
    return jsonify(users=[u._asdict() for u in users])
