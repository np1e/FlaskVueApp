from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Post
from database import db
from sqlalchemy import or_
from http import HTTPStatus

api = Blueprint('api', __name__)


@api.route('/users', methods=['GET'])
@jwt_required
def get_users():
    users = User.query.all()
    return jsonify(users=[u._asdict() for u in users])

##TODO create/update/delete post
@api.route('/posts', methods=['POST'])
@jwt_required
def create_post():
    required_fields = {'content'}
    post_json = request.json
    current_user = get_jwt_identity()
    post_json.update({'author_id': current_user})
    new_post = Post(**post_json)
    db.session.add(new_post)
    db.session.commit()
    return jsonify(new_post._asdict())

@api.route('/posts/<int:id>', methods=['GET'])
def get_post_by_id(id):
    post = Post.query.filter(Post.id == id).first()
    user_id = post.author_id
    user = User.query.filter(User.id == user_id).first()
    if post:
        print(post._asdict())
        return jsonify(post=post._asdict(), author=user._asdict())
    else:
        return jsonify({"msg": "Post with %s not found." % id}), HTTPStatus.NOT_FOUND

@api.route('/search/<string:query>', methods=['GET'])
def search(query):
   print("search in api.py")
   print(query)
   resultposts = Post.query.filter(Post.content == query).first()
   print(resultposts._asdict())
   #resultposts = Post.query.filter(Post.content.contains('query'))
   return jsonify({"result": resultposts._asdict()})

@api.route('/users', methods=['POST'])
def create_user():
    required_fields = {'username', 'email', 'password'}
    user_json = request.json

    if user_json is None:
        return jsonify({"msg": "Userdata malformed."}), HTTPStatus.BAD_REQUEST

    user_json = {k: v for k, v in user_json.items() if v}
    fields = set(user_json.keys())
    if fields < required_fields:
        missing = ', '.join(required_fields - fields)
        return jsonify({"msg": "Missing fields: %s." % missing}), HTTPStatus.BAD_REQUEST

    query_filter = or_(User.username == user_json['username'],
                       User.email == user_json['email'])

    existing_user = User.query.filter(query_filter).first()

    if existing_user is not None:
        return jsonify({
            "msg": "Username or email already in use."
        }), HTTPStatus.BAD_REQUEST

    new_user = User(**user_json)
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user._asdict())


@api.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.filter_by(id=id).first()
    if user:
        return jsonify(user=user._asdict())
    else:
        return jsonify({"msg": "User with %s not found." % id}), HTTPStatus.NOT_FOUND


@api.route('/users/<int:id>', methods=['PUT'])
@jwt_required
def update_user(id):
    updated_user = request.json
    if updated_user is None or id != updated_user.get('id'):
        return jsonify({"msg": "No or wrong user was provided."}), HTTPStatus.BAD_REQUEST
    user = User.query.with_for_update().filter_by(id=updated_user['id']).first()
    if user:
        if user.version_id == updated_user['version_id']:
            user.update(updated_user)
            db.session.commit()
            return jsonify(user=user._asdict())
        else:
            db.session.rollback()
            return jsonify({
                "msg": "User has been modified by someone else."
            }), HTTPStatus.CONFLICT
    else:
        db.session.rollback()
        return jsonify({"msg": "User with %s not found." % id}), HTTPStatus.NOT_FOUND


@api.route('/users/<int:id>', methods=['DELETE'])
@jwt_required
def delete_user(id):
    user = User.query.filter_by(id=id).first()
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"msg": "User with id %s deleted." % id})
    else:
        return jsonify({"msg": "User with id %s not found." % id}), HTTPStatus.NOT_FOUND
