from flask import Blueprint, request
from app.models import db, Review

review_routes = Blueprint('reviews', __name__)

@review_routes.route('/')
def get_reviews():
    reviews = Review.query.all()
    return jsonify([r.to_dict() for r in reviews])

@review_routes.route('/', methods=['POST'])
def create_review():
    data = request.get_json()

    new_review = Review(
        user_id=data['user_id'],
        rating=data['rating'],
        title=data['title'],
        content=data['content']
    )

    db.session.add(new_review)
    db.session.commit()
    return new_review.to_dict()