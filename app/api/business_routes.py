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
        longitude=data.get('longitude'),
        hours_monday=data.get('hours_monday'),
        hours_tuesday=data.get('hours_tuesday'),
        hours_wednesday=data.get('hours_wednesday'),
        hours_thursday=data.get('hours_thursday'),
        hours_friday=data.get('hours_friday'),
        hours_saturday=data.get('hours_saturday'),
        hours_sunday=data.get('hours_sunday'),
        is_active=data.get('is_active', True)
    )

    db.session.add(business)
    db.session.commit()
    return business.to_dict(), 201

# Update a business by ID
# Get the business by ID
# Check if it exists (404 if not)
# Get JSON data from request
# Update business fields
# Commit changes
# Return updated business

@business_routes.route('/<int:id>', methods=['PUT'])
def update_business(id):
    business = Business.query.get(id)
    if not business:
        return {"error": "Business not found"}, 404

    data = request.get_json()

    # update the attribuites of a business - only update if provided in request
    # data.get('attribute', business.field) - Only updates if attribute is provided, otherwise keeps existing value
    # There is no need to add the session, business is already in session from query
    business.owner_id = data.get('owner_id', business.owner_id)
    business.name = data.get('name', business.name)
    business.description = data.get('description', business.description)
    business.address = data.get('address', business.address)
    business.city = data.get('city', business.city)
    business.state = data.get('state', business.state)
    business.zip_code = data.get('zip_code', business.zip_code)
    business.country = data.get('country', business.country)
    business.phone = data.get('phone', business.phone)
    business.website = data.get('website', business.website)
    business.email = data.get('email', business.email)
    business.price_range = data.get('price_range', business.price_range)
    business.latitude = data.get('latitude', business.latitude)
    business.longitude = data.get('longitude', business.longitude)
    business.hours_monday = data.get('hours_monday', business.hours_monday)
    business.hours_tuesday = data.get('hours_tuesday', business.hours_tuesday)
    business.hours_wednesday = data.get('hours_wednesday', business.hours_wednesday)
    business.hours_thursday = data.get('hours_thursday', business.hours_thursday)
    business.hours_friday = data.get('hours_friday', business.hours_friday)
    business.hours_saturday = data.get('hours_saturday', business.hours_saturday)
    business.hours_sunday = data.get('hours_sunday', business.hours_sunday)
    business.is_active = data.get('is_active', business.is_active)

    # commit changes
    db.session.commit()

    # return updated business
    return business.to_dict()
