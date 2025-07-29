from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo', email='demo@aa.io', password='password', firstName='Demo', lastName='User')
    marnie = User(
        username='marnie', email='marnie@aa.io', password='password', firstName='Marnie', lastName='Smith')
    bobbie = User(
        username='bobbie', email='bobbie@aa.io', password='password', firstName='Bobbie', lastName='Johnson')
    alice = User(
        username='alice', email='alice@aa.io', password='password', firstName='alice', lastName='dodo')
    charlie = User(
        username='charlie', email='charlie@aa.io', password='password', firstName='charlie', lastName='tom')
    diana = User(
        username='diana', email='diana@aa.io', password='password', firstName='diana', lastName='lammert')
    evan = User(
        username='evan', email='evan@aa.io', password='password', firstName='evan', lastName='alex')

    db.session.add(demo)  # ID 1
    db.session.add(marnie) # ID 2
    db.session.add(bobbie) # ID 3
    db.session.add(alice)    # ID 4
    db.session.add(charlie)  # ID 5
    db.session.add(diana)    # ID 6
    db.session.add(evan)     # ID 7
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    try:
        if environment == "production":
            db.session.execute(text(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;"))
        else:
            db.session.execute(text("DELETE FROM users"))
        db.session.commit()
    except Exception as e:
        db.session.rollback()
