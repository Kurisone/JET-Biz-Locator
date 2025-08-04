from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Review, ReviewImage, Business
from sqlalchemy import desc, asc
from datetime import datetime

review_routes = Blueprint('reviews', __name__)

@review_routes.route('/')
def get_all_reviews():
    reviews = Review.query.all()
    return jsonify([review.to_dict() for review in reviews])

@review_routes.route('/businesses/<int:business_id>/reviews')
def get_reviews_for_business(business_id):
    business = Business.query.get(business_id)
    if not business:
        return jsonify({"message": "Business not found"}), 404

    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    sort = request.args.get('sort', 'newest')

    if sort == 'oldest':
        sort_by = asc(Review.created_at)
    elif sort == 'highest':
        sort_by = desc(Review.rating)
    elif sort == 'lowest':
        sort_by = asc(Review.rating)
    else:  # default to newest
        sort_by = desc(Review.created_at)

    query = Review.query.filter_by(business_id=business_id).order_by(sort_by)
    paginated = query.paginate(page=page, per_page=limit, error_out=False)

    reviews = [review.to_dict() for review in paginated.items]
    
    # Include images with each review
    for review in reviews:
        review['images'] = [img.to_dict() for img in 
                           ReviewImage.query.filter_by(review_id=review['id']).all()]

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

@review_routes.route('/<int:review_id>')
def get_review_by_id(review_id):
    review = Review.query.get(review_id)
    if not review:
        return jsonify({"message": "Review not found"}), 404
    
    review_data = review.to_dict()
    review_data['images'] = [img.to_dict() for img in review.images]
    return jsonify(review_data)


@review_routes.route('/businesses/<int:business_id>/reviews/<int:review_id>', methods=['PUT'])
@login_required
def update_review(business_id, review_id):
    data = request.get_json()
    review = Review.query.get(review_id)

    if not review:
        return jsonify({"error": "Review not found"}), 404
    if review.business_id != business_id:
        return jsonify({"error": "Review does not belong to this business"}), 400
    if review.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403
    
    if 'rating' in data:
        review.rating = data['rating']
    if 'title' in data:
        review.title = data['title']
    if 'content' in data:
        review.content = data['content']
    
    db.session.commit()
    
    review_data = review.to_dict()
    review_data['images'] = [img.to_dict() for img in review.images]
    return jsonify(review_data)

@review_routes.route('/<int:review_id>', methods=['DELETE'])
@login_required
def delete_review(review_id):
    try:
        review = Review.query.get(review_id)
        if not review:
            return jsonify({"error": "Review not found"}), 404
        
        if review.user_id != current_user.id:
            return jsonify({"error": "Unauthorized"}), 403
        
        # Delete associated images first
        ReviewImage.query.filter_by(review_id=review_id).delete()
        
        db.session.delete(review)
        db.session.commit()
        
        return jsonify({
            "message": "Review deleted successfully",
            "reviewId": review_id
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500