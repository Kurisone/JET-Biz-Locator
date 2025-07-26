# Get all images for a review
@review_routes.route('/<int:review_id>/images')
def get_review_images(review_id):
    review = Review.query.get(review_id)
    if not review:
        return {"error": "Review not found"}, 404
    
    images = ReviewImage.query.filter_by(review_id=review_id).all()
    return {"images": [image.to_dict() for image in images]}

# Add image to review
@review_routes.route('/<int:review_id>/images', methods=['POST'])
@login_required
def add_review_image(review_id):
    review = Review.query.get(review_id)
    if not review:
        return {"error": "Review not found"}, 404
    
    if review.user_id != current_user.id:
        return {"error": "Can only add to your own reviews"}, 403
    
    data = request.get_json()
    
    if not data.get('image_url'):
        return {"error": "Image URL required"}, 400
    
    new_image = ReviewImage(
        review_id=review_id,
        uploaded_by_user_id=current_user.id,
        image_url=data['image_url'],
        caption=data.get('caption', '')
    )
    
    db.session.add(new_image)
    db.session.commit()
    return new_image.to_dict()

# Update review image
@review_routes.route('/images/<int:image_id>', methods=['PUT'])
@login_required
def update_review_image(image_id):
    image = ReviewImage.query.get(image_id)
    if not image:
        return {"error": "Image not found"}, 404
    
    if image.uploaded_by_user_id != current_user.id:
        return {"error": "Can only edit your own images"}, 403
    
    data = request.get_json()
    
    if 'caption' in data:
        image.caption = data['caption']
    
    db.session.commit()
    return image.to_dict()

# Delete review image
@review_routes.route('/images/<int:image_id>', methods=['DELETE'])
@login_required
def delete_review_image(image_id):
    image = ReviewImage.query.get(image_id)
    if not image:
        return {"error": "Image not found"}, 404
    
    if image.uploaded_by_user_id != current_user.id:
        return {"error": "Can only delete your own images"}, 403
    
    db.session.delete(image)
    db.session.commit()
    return {"message": "Image deleted"}