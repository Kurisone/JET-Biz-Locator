from app.models import db, Business, Category, environment, SCHEMA
from sqlalchemy.sql import text

def seed_business_categories():
    # business-category mappings (business_id, category_id)
    business_category_mappings = [
        # Joe's Pizza (ID 1): Restaurant, Italian, Pizza, Takeout
        (1, 1), (1, 2), (1, 3), (1, 4),
        # JET consultants (ID 2): Consulting, Technology
        (2, 5), (2, 6),
        # Bay Area Coffee Roasters (ID 3): Coffee, Roastery
        (3, 7), (3, 8),
        # Sunnyvale Family Dentistry (ID 4): Healthcare, Dental
        (4, 9), (4, 10),
        # San Jose Auto Care Center (ID 5): Automotive
        (5, 11),
        # Tech Startup Hub (ID 6): Technology, Startup, Coworking
        (6, 6), (6, 14), (6, 13),
        # Demo's Bakery (ID 7): Restaurant, Bakery, Takeout
        (7, 1), (7, 15), (7, 4),
        # Fitness First Gym (ID 8): Fitness
        (8, 12)
    ]

    for business_id, category_id in business_category_mappings:
        business = Business.query.get(business_id)
        category = Category.query.get(category_id)
        if business and category:
            business.categories.append(category)

    db.session.commit()

def undo_business_categories():
    try:
        if environment == "production":
            db.session.execute(text(f"TRUNCATE table {SCHEMA}.business_categories RESTART IDENTITY CASCADE;"))
        else:
            db.session.execute(text("DELETE FROM business_categories"))
        db.session.commit()
    except Exception as e:
        db.session.rollback()
