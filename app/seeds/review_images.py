from app.models import ReviewImage, db
from datetime import datetime

def seed_review_images():
    # Example data structure 
    # review_images = [
    #     {
    #         'review_id': 1,
    #         'uploaded_by_user_id': 1,
    #         'image_url': 'http://example.com/image1.jpg',
    #         'caption': 'Great food!',
    #         'is_primary': True
    #     },
    #     # Add more review images as needed
    # ]
    
    # for image in review_images:
    #     new_image = ReviewImage(
    #         review_id=image['review_id'],
    #         uploaded_by_user_id=image['uploaded_by_user_id'],
    #         image_url=image['image_url'],
    #         caption=image['caption'],
    #         is_primary=image['is_primary'],
    #         created_at=datetime.utcnow(),
    #         updated_at=datetime.utcnow()
    #     )
    #     db.session.add(new_image)
    
    db.session.commit()

def undo_review_images():
    db.session.execute('TRUNCATE review_images RESTART IDENTITY CASCADE;')
    db.session.commit()