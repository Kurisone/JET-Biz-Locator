from app.models import ReviewImage, db
from datetime import datetime

def seed_review_images():
    # Example data structure
    review_images = [
        {
            'review_id': 1,
            'uploaded_by_user_id': 1,
            'image_url': 'https://images.squarespace-cdn.com/content/v1/6260a7240a625a12010e445b/24f59393-bade-4514-b9d0-49666891aca7/CH_Oiji_Mi_NYC_ROUND_2_564.jpg',
            'caption': 'Great food!',
            'is_primary': True
        },
        # Add more review images as needed
        {
            'review_id': 2,
            'uploaded_by_user_id': 2,
            'image_url': 'https://images.pexels.com/photos/700974/pexels-photo-700974.jpeg',
            'caption': 'Great food!',
            'is_primary': True
        },
    ]

    for image in review_images:
        new_image = ReviewImage(
            review_id=image['review_id'],
            uploaded_by_user_id=image['uploaded_by_user_id'],
            image_url=image['image_url'],
            caption=image['caption'],
            is_primary=image['is_primary'],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.session.add(new_image)

    db.session.commit()

def undo_review_images():
    db.session.query(ReviewImage).delete()
    db.session.commit()
