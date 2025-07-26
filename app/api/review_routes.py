from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Review, ReviewImage, Business
from sqlalchemy import desc, asc
from datetime import datetime


review_routes = Blueprint('reviews', __name__)


## Backend Route: Get All Reviews
@review_routes.route('/')
def get_all_reviews():
    reviews = Review.query.all()
    return jsonify([review.to_dict() for review in reviews])


## Backend Route: Get All Reviews for a business
## Users should be able to view all reviews on business
@review_routes.route('/businesses/<int:id>/reviews')
def get_reviews_for_business(id): ## grabs every review for business by id
    business = Business.query.get(id)
    if not business:
        return {"message": "Business not found"}, 404

    # Pagination, splitting data into pages instead of sending everything at once
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    sort = request.args.get('sort', 'newest')

    # Sorting, organizing the reviews in a specific order
    if sort == 'oldest':
        sort_by = asc(Review.created_at)
    elif sort == 'highest':
        sort_by = desc(Review.rating)
    elif sort == 'lowest':
        sort_by = asc(Review.rating)
    else:  # default to newest
        sort_by = desc(Review.created_at)

    query = Review.query.filter_by(business_id=id).order_by(sort_by)
    paginated = query.paginate(page=page, per_page=limit, error_out=False)

    reviews = [review.to_dict() for review in paginated.items]

    return jsonify({
        "reviews": reviews,
        "business": {
            "id": business.id,
            "name": business.name
        },
        "pagination": {
            "page": paginated.page,
            "pages": paginated.pages,
            "per_page": paginated.per_page,
            "total": paginated.total
        }
    })

## Added to Get review by id
@review_routes.route('/<int:review_id>')
def get_review_by_id(review_id):
    review = Review.query.get(review_id)
    if not review:
        return {"message": "Review not found"}, 404
    return jsonify(review.to_dict())

## Create Review for a Business
## Users should be able to add a review to a business

@review_routes.route('/businesses/<int:id>/reviews', methods=['POST'])
@login_required
def create_review(id):
    business = Business.query.get(id)
    if not business:
        return {"message": "Business not found"}, 404
        
    data = request.get_json()
    rating = data.get('rating')
    title = data.get('title')
    content = data.get('content')

    # Validation
    errors = {}
    if not content:
        errors["content"] = "Review content cannot be empty"
    if not rating or not (1 <= rating <= 5):
        errors["rating"] = "Rating must be between 1 and 5"
    if errors:
        return {"message": "Validation error", "errors": errors}, 400

    # Check if user already reviewed
    existing = Review.query.filter_by(user_id=current_user.id, business_id=id).first()
    if existing:
        return {"message": "You have already reviewed this business"}, 409

    new_review = Review(
        user_id=current_user.id,
        business_id=id,
        rating=rating,
        title=title,
        content=content,
        created_at=datetime.utcnow()
    )

    db.session.add(new_review)
    db.session.commit()
    return jsonify(new_review.to_dict()), 201

## Edit Review
## Users should be able to update their review on a business
@review_routes.route('/reviews/<int:review_id>', methods=['PUT'])
@login_required
def update_review(review_id):
    data = request.get_json()
    review = Review.query.get(review_id)

    if not review:
        return {"error": "Review not found"}, 404
    if review.user_id != current_user.id:
        return {"error": "Unauthorized"}, 403
    
    review.rating = data.get('rating', review.rating)
    review.title = data.get('title', review.title)
    review.content = data.get('content', review.content)

    db.session.commit()
    return review.to_dict()

## Delete Review
## users should be able to delete their review from a business
@review_routes.route('/reviews/<int:review_id>', methods=['DELETE'])
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


## Review button?