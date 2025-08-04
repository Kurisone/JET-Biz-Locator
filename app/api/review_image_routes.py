from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Review, ReviewImage
from datetime import datetime

review_image_routes = Blueprint('review_images', __name__)

# Get all images for a review
@review_image_routes.route('/reviews/<int:review_id>/images')
def get_review_images(review_id):
    """
    Get all images for a specific review
    """
    review = Review.query.get(review_id)
    if not review:
        return jsonify({"error": "Review not found"}), 404

    images = ReviewImage.query.filter_by(review_id=review_id).all()
    return jsonify({"images": [image.to_dict() for image in images]})

# Add image to review 
@review_image_routes.route('/<int:review_id>/images', methods=['POST'])
@login_required
def add_review_image(review_id):
    """
    Add an image to a review using JSON with image_url
    Required JSON:
    {
        "image_url": "string",
        "caption": "string" (optional)
    }
    """
    review = Review.query.get(review_id)
    if not review:
        return jsonify({"error": "Review not found"}), 404

    if review.user_id != current_user.id:
        return jsonify({"error": "Can only add to your own reviews"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    # Validate required fields
    if not data.get('image_url'):
        return jsonify({"error": "image_url is required"}), 400

    # Create new image record
    new_image = ReviewImage(
        review_id=review_id,
        uploaded_by_user_id=current_user.id,
        image_url=data['image_url'],
        caption=data.get('caption', ''),
        created_at=datetime.utcnow()
    )

    db.session.add(new_image)
    db.session.commit()
    
    return jsonify(new_image.to_dict()), 201

# Update review image (caption only)
@review_image_routes.route('/images/<int:image_id>', methods=['PUT'])
@login_required
def update_review_image(image_id):
    """
    Update a review image's caption
    Accepts JSON:
    {
        "caption": "string"
    }
    """
    image = ReviewImage.query.get(image_id)
    if not image:
        return jsonify({"error": "Image not found"}), 404

    if image.uploaded_by_user_id != current_user.id:
        return jsonify({"error": "Can only edit your own images"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    # Only allow updating caption
    if 'caption' in data:
        image.caption = data['caption']
        image.updated_at = datetime.utcnow()
        db.session.commit()

    return jsonify(image.to_dict())

# Delete review image
@review_image_routes.route('/images/<int:image_id>', methods=['DELETE'])
@login_required
def delete_review_image(image_id):
    """
    Delete a review image
    """
    image = ReviewImage.query.get(image_id)
    if not image:
        return jsonify({"error": "Image not found"}), 404

    if image.uploaded_by_user_id != current_user.id:
        return jsonify({"error": "Can only delete your own images"}), 403

    db.session.delete(image)
    db.session.commit()
    
    return jsonify({
        "message": "Image deleted successfully",
        "review_id": image.review_id
    })