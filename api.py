from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Post
from database import db
from sqlalchemy import or_
from http import HTTPStatus
from datetime import datetime

api = Blueprint('api', __name__)


@api.route('/users', methods=['GET'])
@jwt_required
def get_users():
    users = User.query.all()
    return jsonify(users=[u._asdict() for u in users])


##TODO create/update/delete post
@api.route('/posts/<int:id>', methods=['DELETE'])
@jwt_required
def delete_post(id):
    post = Post.query.filter_by(id=id).first()
    if post:
        db.session.delete(post)
        db.session.commit()
        return jsonify({"msg": "Post with id %s deleted." % id})
    else:
        return jsonify({"msg": "Post with id %s not found." % id}), HTTPStatus.NOT_FOUND


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
    post_dict = post._asdict()
    post_dict.update({'avatar': user.avatar})
    post_dict.update({'author': user.username})
    if post:
        print(post_dict)
        return jsonify(post=post_dict)
    else:
        return jsonify({"msg": "Post with %s not found." % id}), HTTPStatus.NOT_FOUND

@api.route('/search', methods=['POST'])
@jwt_required
def search():
    post_json = request.json
    if post_json["order"] == "desc":
        resultposts = Post.query.filter(Post.content.contains(post_json["query"])).order_by(Post.content.desc()).all()
    else:
        resultposts = Post.query.filter(Post.content.contains(post_json["query"])).order_by(Post.content.asc()).all()
    if resultposts:
        print(resultposts)
        return jsonify(resultposts=[result._asdict() for result in resultposts])
    else:
        return jsonify({"msg": "No matching posts found"}), HTTPStatus.NOT_FOUND

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
    posts_query = Post.query.filter(Post.author_id == id).all()
    posts = []
    for post in posts_query:
        post_dict = dict(post._asdict(),**{'author': user.username})
        posts.append(post_dict)
    if user:
        return jsonify(user=user._asdict(), posts = posts)
    else:
        return jsonify({"msg": "User with %s not found." % id}), HTTPStatus.NOT_FOUND


@api.route('/users/<int:id>', methods=['PUT'])
@jwt_required
def update_user(id):
    updated_user = request.json
    if updated_user is None or id != updated_user.get('id'):
        return jsonify({"msg": "No or wrong user was provided."}), HTTPStatus.BAD_REQUEST
    user = User.query.with_for_update().filter_by(id=updated_user['id']).first()

    updated_user["registered"] = datetime.strptime(updated_user["registered"], '%a, %d %b %Y %H:%M:%S %Z')

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

@api.route('/following/<int:id>', methods=['GET'])
def get_following(id):
    user = User.query.filter_by(id=id).first()
    following = user.get_followed()
    return jsonify(following=[f._asdict() for f in following])

@api.route('/follower/<int:id>', methods=['GET'])
def get_follower(id):
    user = User.query.filter_by(id=id).first()
    follower = user.get_follower()
    return jsonify(follower=[f._asdict() for f in follower])

@api.route('/follower/<int:id>', methods=['PUT'])
@jwt_required
def follow(id):
    json = request.json
    followed = User.query.filter_by(id=id).first()
    follower = User.query.filter_by(id=json['id']).first()
    if followed and follower:
        follower.follow(followed)
        print("following")
        return jsonify(user=follower._asdict())
    else:
        return jsonify({"msg": "User with %s not found." % id}), HTTPStatus.NOT_FOUND

@api.route('/follower/<int:id>', methods=['DELETE'])
@jwt_required
def unfollow(id):
    json = request.json
    followed = User.query.filter_by(id=id).first()
    follower = User.query.filter_by(id=json['id']).first()
    if followed and follower:
        follower.unfollow(followed)
    else:
        return jsonify({"msg": "User with %s not found." % id}), HTTPStatus.NOT_FOUND
