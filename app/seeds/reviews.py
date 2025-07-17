from app.models import db, Review
from datetime import datetime
from sqlalchemy.sql import text
from app.models import environment, SCHEMA


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
    review3 = Review(
        user_id=3,
        rating=5,
        title="Fantastic!",
        content="The atmosphere of the restaurant was fantastic! And the food, I would give 5 out of 5 all day!",
        created_at=datetime.utcnow()
    )
    review4 = Review(
        user_id=4,
        rating=4,
        title="Solid experience",
        content="Nothing extraordinary, but I'd come back again.",
        created_at=datetime.utcnow()
    )
    review5 = Review(
        user_id=5,
        rating=1,
        title="Never going again",
        content="I found a bug inside of my plate and manager did not seem to care about it. I'm never going back again!",
        created_at=datetime.utcnow()
    )
    review6 = Review(
        user_id=6,
        rating=2,
        title="It was below average",
        content="I think I could cook better than this. It was too salty and greasy at the same time.",
        created_at=datetime.utcnow()
    )
    review7 = Review(
        user_id=7,
        rating=5,
        title="Very delicious",
        content="I took a group of people to the restaurant and they all loved it. The food was warm and so yummy!:)",
        created_at=datetime.utcnow()
    )

    db.session.add_all([review1,review2,review3,review4,review5,review6,review7])
    db.session.commit()

def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}. reviews RESTART IDENTITY CASCADE;") ## TRUNCATE TABLE - wipe out everything in this table FAST and reset all the ID counters
    else:
    db.session.execute(text("DELETE FROM reviews"))
    db.session.commit()


