from app.models import db, Business
#from datetime import datetime

def seed_businesses():
    business1 = Business(
        owner_id=1, # Demo user
        name="Joe's Pizza",
        description="Best Pizza in town",
        address="541 Capitol Express",
        city="San Jose",
        state="CA",
        zip_code="95135",
        country="USA",
        phone="408-555-6780",
        website="www.joepizza.com",
        email="joepizza@users.io",
        price_range=2,
        latitude=37.845,
        longitude=112.56,
        hours_monday="9:00 AM - 10:00 PM",
        hours_tuesday="9:00 AM - 10:00 PM",
        hours_wednesday="9:00 AM - 10:00 PM",
        hours_thursday="9:00 AM - 10:00 PM",
        hours_friday="9:00 AM - 10:00 PM",
        hours_saturday="9:00 AM - 10:00 PM",
        hours_sunday="9:00 AM - 10:00 PM",
    )

    business2 = Business(
        owner_id=2, # Demo user
        name="JET consultants",
        description="Software Develoipment and Consulancy",
        address="2222 Senter Road",
        city="San Jose",
        state="CA",
        zip_code="95134",
        country="USA",
        phone="408-222-4567",
        website="www.jetprofessionals.com",
        email="jet@users.io",
        price_range=4,
        latitude=37.434,
        longitude=112.07,
        hours_monday="8:00 AM - 5:00 PM",
        hours_tuesday="8:00 AM - 5:00 PM",
        hours_wednesday="8:00 AM - 5:00 PM",
        hours_thursday="8:00 AM - 5:00 PM",
        hours_friday="9:00 AM - 4:00 PM",
        hours_saturday="Closed",
        hours_sunday="Closed"
    )

    business3 = Business(
        owner_id=3, # Demo user
        name="Bay Area Coffee Roasters",
        description="Artisan coffee and fresh pastries",
        address="789 University Ave",
        city="Palo Alto",
        state="CA",
        zip_code="94306",
        country="USA",
        phone="408-999-8765",
        website="www.baycoffeerosters.com",
        email="baycoffeerosters@users.io",
        price_range=3,
        latitude=36.987,
        longitude=111.45678,
        hours_monday="8:00 AM - 6:00 PM",
        hours_tuesday="8:00 AM - 6:00 PM",
        hours_wednesday="8:00 AM - 6:00 PM",
        hours_thursday="8:00 AM - 6:00 PM",
        hours_friday="9:00 AM - 6:00 PM",
        hours_saturday="10:00 AM - 3:00 PM",
        hours_sunday="Closed"
    )

    business4 = Business(
        owner_id=3,
        name="Sunnyvale Family Dentistry",
        description="Complete family dental care with modern technology and gentle approach",
        address="1234 El Camino Real",
        city="Sunnyvale",
        state="CA",
        zip_code="94085",
        country="USA",
        phone="408-555-2840",
        website="www.sunnyvaledentistry.com",
        email="info@sunnyvaledentistry.com",
        price_range=3,
        latitude=37.3688,
        longitude=-122.0363,
        hours_monday="8:00 AM - 5:00 PM",
        hours_tuesday="8:00 AM - 5:00 PM",
        hours_wednesday="8:00 AM - 5:00 PM",
        hours_thursday="8:00 AM - 5:00 PM",
        hours_friday="8:00 AM - 3:00 PM",
        hours_saturday="9:00 AM - 2:00 PM",
        hours_sunday="Closed"
    )

    business5 = Business(
        owner_id=2,
        name="San Jose Auto Care Center",
        description="Full-service automotive repair",
        address="3456 Story Road",
        city="San Jose",
        state="CA",
        zip_code="95127",
        country="USA",
        phone="408-555-AUTO",
        website="www.sanjoseautocare.com",
        email="service@sanjoseautocare.com",
        price_range=2,
        latitude=37.3382,
        longitude=-121.8863,
        hours_monday="7:00 AM - 6:00 PM",
        hours_tuesday="7:00 AM - 6:00 PM",
        hours_wednesday="7:00 AM - 6:00 PM",
        hours_thursday="7:00 AM - 6:00 PM",
        hours_friday="7:00 AM - 6:00 PM",
        hours_saturday="8:00 AM - 4:00 PM",
        hours_sunday="Closed"
)

    db.session.add(business1)
    db.session.add(business2)
    db.session.add(business3)
    db.session.add(business4)
    db.session.add(business5)
    db.session.commit()

def undo_businesses():
    try:
        if environment == "production":
            db.session.execute(text(f"TRUNCATE table {SCHEMA}.businesses RESTART IDENTITY CASCADE;"))
        else:
            db.session.execute(text("DELETE FROM businesses"))
        db.session.commit()
    except Exception as e:
        db.session.rollback()
