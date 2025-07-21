from app.models import db, Category, environment, SCHEMA
from sqlalchemy.sql import text

def seed_categories():
    # Common business categories for the sample businesses added
    categories = [
        Category(name="Restaurant", description="Food and dining establishments"),
        Category(name="Italian", description="Italian cuisine and restaurants"),
        Category(name="Pizza", description="Pizza restaurants and takeout"),
        Category(name="Takeout", description="Takeout and delivery services"),
        Category(name="Consulting", description="Professional consulting services"),
        Category(name="Technology", description="Technology and IT services"),
        Category(name="Coffee", description="Coffee shops and cafes"),
        Category(name="Roastery", description="Coffee roasting and specialty coffee"),
        Category(name="Healthcare", description="Medical and healthcare services"),
        Category(name="Dental", description="Dental care and oral health"),
        Category(name="Automotive", description="Auto repair and car services"),
        Category(name="Fitness", description="Gyms and fitness centers"),
        Category(name="Coworking", description="Shared workspaces and offices"),
        Category(name="Startup", description="Startup and entrepreneurship"),
        Category(name="Bakery", description="Bakeries and baked goods")
    ]

    for category in categories:
        db.session.add(category)

    db.session.commit()

def undo_categories():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.categories RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM categories"))

    db.session.commit()
