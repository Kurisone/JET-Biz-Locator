from flask import Blueprint, request
from app.models import Business, db  # Import Business model
# from flask_login import current_user, login_required  # This is needed for later

# Create the blueprint
business_routes = Blueprint('business', __name__)

# Get all businesses
# Query all businesses from database
# Convert to list of dictionaries using to_dict()
# Return the data
@business_routes.route('/')  # This will be /api/businesses
def get_all_businesses():
    businesses = Business.query.all() # get all businesses from db
    business_list = [business.to_dict() for business in businesses] # convert each business to dictionary
    return {"businesses": business_list} # return the result in proper format

# Get a single business by ID
# Query business by ID
# Handle if not found (return 404)
# Return business.to_dict()
@business_routes.route('/<int:id>')
def get_single_business(id):
    business = Business.query.get(id)
    if not business:
      return {"error": "Business not found"}, 404
    return business.to_dict()

# Create a new business
# Get JSON data from request
# Create new Business object
# Add to database
# Return the created business
@business_routes.route('/', methods=['POST'])
def create_business():

    data = request.get_json()
    business = Business(
        owner_id=data['owner_id'], # Required field (will error if missing)
        name=data['name'],
        description=data['description'],
        address=data['address'],
        city=data['city'],
        state=data['state'],
        zip_code=data['zip_code'],
        country=data.get('country', 'USA'),  # Optional field; Default to USA if not provided
        phone=data.get('phone'),
        website=data.get('website'),
        email=data.get('email'),
        price_range=data.get('price_range'),
        latitude=data.get('latitude'),
        longitude=data.get('longitude')
    )

    db.session.add(business)
    db.session.commit()
    return business.to_dict(), 201
