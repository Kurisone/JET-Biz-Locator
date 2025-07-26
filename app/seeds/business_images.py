from app.models import BusinessImage, db, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_business_images():
    # Example data structure
    business_images = [
        {
            'business_id': 1,
            'uploaded_by_user_id': 1,
            'image_url': 'https://images.pexels.com/photos/162539/architecture-building-amsterdam-blue-sky-162539.jpeg',
            'caption': 'Our storefront',
            'is_primary': True
        },
        # Add more business images as needed
        {
            'business_id': 2,
            'uploaded_by_user_id': 2,
            'image_url': 'https://images.pexels.com/photos/233698/pexels-photo-233698.jpeg',
            'caption': 'Our storefront',
            'is_primary': True
        },
    ]

    for image in business_images:
        new_image = BusinessImage(
            business_id=image['business_id'],
            uploaded_by_user_id=image['uploaded_by_user_id'],
            image_url=image['image_url'],
            caption=image['caption'],
            is_primary=image['is_primary'],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.session.add(new_image)

    db.session.commit()

def undo_business_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.business_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM business_images"))
    db.session.commit()
