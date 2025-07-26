# Get all images for a business
@business_routes.route('/<int:business_id>/images')
def get_business_images(business_id):
    business = Business.query.get(business_id)
    if not business:
        return {"error": "Business not found"}, 404
    
    images = BusinessImage.query.filter_by(business_id=business_id).all()
    return {"images": [image.to_dict() for image in images]}

# Add image to business
@business_routes.route('/<int:business_id>/images', methods=['POST'])
@login_required
def add_business_image(business_id):
    business = Business.query.get(business_id)
    if not business:
        return {"error": "Business not found"}, 404
    
    if business.owner_id != current_user.id:
        return {"error": "Only the owner can add images"}, 403
    
    data = request.get_json()
    
    # Simple validation
    if not data.get('image_url'):
        return {"error": "Image URL required"}, 400
    
    new_image = BusinessImage(
        business_id=business_id,
        uploaded_by_user_id=current_user.id,
        image_url=data['image_url'],
        caption=data.get('caption', ''),
        is_primary=False  # Default to not primary
    )
    
    db.session.add(new_image)
    db.session.commit()
    return new_image.to_dict()

# Update business image
@business_routes.route('/images/<int:image_id>', methods=['PUT'])
@login_required
def update_business_image(image_id):
    image = BusinessImage.query.get(image_id)
    if not image:
        return {"error": "Image not found"}, 404
    
    if image.uploaded_by_user_id != current_user.id:
        return {"error": "Can only edit your own images"}, 403
    
    data = request.get_json()
    
    # Only allow updating caption
    if 'caption' in data:
        image.caption = data['caption']
    
    db.session.commit()
    return image.to_dict()

# Delete business image
@business_routes.route('/images/<int:image_id>', methods=['DELETE'])
@login_required
def delete_business_image(image_id):
    image = BusinessImage.query.get(image_id)
    if not image:
        return {"error": "Image not found"}, 404
    
    if image.uploaded_by_user_id != current_user.id and image.business.owner_id != current_user.id:
        return {"error": "Unauthorized"}, 403
    
    db.session.delete(image)
    db.session.commit()
    return {"message": "Image deleted"}