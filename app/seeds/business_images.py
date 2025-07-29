from app.models import BusinessImage, db, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_business_images():
    # Example data structure
    business_images = [
        {
            'business_id': 1,
            'uploaded_by_user_id': 1,
            'image_url': 'https://img1.wsimg.com/isteam/ip/538bcd6d-a924-461e-a467-d49ed06293ca/SRO_1507-7e12095.jpg',
            'caption': 'Our storefront',
            'is_primary': True
        },
        # Add more business images as needed
        {
            'business_id': 2,
            'uploaded_by_user_id': 2,
            'image_url': 'https://media.prleap.com/image/35536/full/Prosoft-Nearshore-Office-Louisville-Kentucky-Custom-Software-Development.jpg',
            'caption': 'Our storefront',
            'is_primary': True
        },
        {
            'business_id': 3,
            'uploaded_by_user_id': 3,
            'image_url': 'https://sheenashahangian.com/wp-content/uploads/2023/09/Lima-Coffee-Roasters-Fort-Collins-shop-Sheena-Shahangian-Photography-LLC-31-1024x683.jpg',
            'caption': 'Our storefront',
            'is_primary': True
        },
        {
            'business_id': 4,
            'uploaded_by_user_id': 1,
            'image_url': 'https://cdn-jpogd.nitrocdn.com/sNhFSPXGHNuMqwuHxOawVuUxuAvFTliC/assets/images/optimized/rev-0a74dfb/www.smilecarolina.com/wp-content/uploads/2022/09/hero-1-1.jpeg',
            'caption': 'Our storefront',
            'is_primary': True
        },
        {
            'business_id': 5,
            'uploaded_by_user_id': 1,
            'image_url': 'https://images.squarespace-cdn.com/content/v1/5ee00572606799128801f097/61385664-208e-40d8-99ed-bd9e2e4d1f44/San+Jose+Hero.jpg',
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
    try:
        if environment == "production":
            db.session.execute(text(f"TRUNCATE table {SCHEMA}.business_images RESTART IDENTITY CASCADE;"))
        else:
            db.session.execute(text("DELETE FROM business_images"))
        db.session.commit()
    except Exception as e:
        # If table is empty or doesn't exist, that's fine for a fresh deployment
        db.session.rollback()
