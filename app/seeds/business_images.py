from app.models import BusinessImage, db
from datetime import datetime

def seed_business_images():
    # Example data structure
    # business_images = [
    #     {
    #         'business_id': 1,
    #         'uploaded_by_user_id': 1,
    #         'image_url': 'http://example.com/business1.jpg',
    #         'caption': 'Our storefront',
    #         'is_primary': True
    #     },
    #     # Add more business images as needed
    # ]
    
    # for image in business_images:
    #     new_image = BusinessImage(
    #         business_id=image['business_id'],
    #         uploaded_by_user_id=image['uploaded_by_user_id'],
    #         image_url=image['image_url'],
    #         caption=image['caption'],
    #         is_primary=image['is_primary'],
    #         created_at=datetime.utcnow(),
    #         updated_at=datetime.utcnow()
    #     )
    #     db.session.add(new_image)
    
    db.session.commit()

def undo_business_images():
    db.session.execute('TRUNCATE business_images RESTART IDENTITY CASCADE;')
    db.session.commit()