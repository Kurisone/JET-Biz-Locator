from app.models import db, Review
from datetime import datetime

def seed_reviews():
    review1 = Review(
        user_id=1,
        rating=5,
        title="Amazing food!",
        content="The service was great and the food was delicious",
        created_at=datetime.utcnow()
    )

    review2 = Review(
        user_id=2,
        rating=3,
        title="Okay experience",
        content="The food was okay but the place was loud",
        created_at=datetime.utcnow()
    )

    db.session.add(review1)
    db.session.add(review2)
    db.session.commit()

def undo_reviews():
    db.session.execute("DELETE FROM reviews")
    db.session.commit()

