from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Review

review_routes = Blueprint('reviews', __name__)


## Backend Route: Get All Reviews
@review_routes.route('/')
def get_reviews():
    reviews = Review.query.all() ## grabs every review in the db
    return jsonify([r.to_dict() for r in reviews]) ## converts each review object into a dictionary so it can be jsonified.

## Create Review
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

## Edit Review
@review_routes.route('/<int:review_id>', methods=['PUT'])
@login_required
def update_review(review_id):
    data = request.get_json()
    review = Review.query.get(review_id)

    if not review:
        return {"error": "Not Found"}, 404
    if review.user_id != current_user.id:
        return {"error": "Unauthorized"}, 403
    
    review.rating = data.get('rating', review.rating)
    review.title = data.get('title', review.title)
    review.content = data.get('content', review.content)

    db.session.commit()
    return review.to_dict()

## Delete Review
@review_routes.route('/<int:review_id>', methods=['DELETE'])
@login_required
def delete_review(review_id):
    review = Review.query.get(review_id)

    if not review:
        return {"error": "Review not found"}, 404
    if review.user_id != current_user.id:
        return {"error": "Unauthorized"}, 403

    db.session.delete(review)
    db.session.commit()
    return {'message': "Review deleted"}


