from flask import Blueprint, request
from sqlalchemy.orm import joinedload
from datetime import datetime
from app.models import Business, BusinessImage, db, Review, Category  # Import models
from flask_login import current_user, login_required  # This is needed for later
from sqlalchemy import desc, asc, or_, and_ #import sorting helpers and or_ and and_ for queries
# Create the blueprint
business_routes = Blueprint('business', __name__)

# Get all businesses with optional search/filter parameters
# Query all businesses from database
# Convert to list of dictionaries using to_dict()
# Return the data
# Query parameters:
# search: Search by business name (partial match, case-insensitive)
# category: Filter by category name or ID
# price: Exact price range (1-4)

@business_routes.route('/')  # This will be /api/businesses
def get_all_businesses():
    query = Business.query # this is the base queryapp/seeds

    # Then get search/filter paramters from the url query string
    search = request.args.get('search', '').strip()
    category = request.args.get('category', '').strip()
    price = request.args.get('price')

    # search by business name
    if search:
        query = query.filter(Business.name.ilike(f'%{search}%'))

    # search by category
    if category:

        if category.isdigit(): #  this is to check if category ID (numeric) or category name

            query = query.join(Business.categories).filter(Category.id == int(category)) # filter by category ID
        else:

            query = query.join(Business.categories).filter(Category.name.ilike(f'%{category}%')) # filter by category name (case-insensitive, partial match)

    # search by price
    if price:

        query = query.filter(Business.price_range == int(price)) # this is when there is Exact price match


    businesses = query.options(joinedload(Business.business_images)).all()
    
    business_list = []
    for business in businesses:
        biz_dict = business.to_dict()
        # Add first image URL if available
        if business.business_images:
            biz_dict['images'] = [img.to_dict() for img in business.business_images]
        else:
            biz_dict['images'] = []
        business_list.append(biz_dict)
    
    return {
        "businesses": business_list,
        "total_results": len(business_list),
        "search_params": {
            "search": search or None,
            "category": category or None,
            "price": price
        }
    }
# Get a single business by ID
# Query business by ID
# Handle if not found (return 404)
# Return business.to_dict()
@business_routes.route('/<int:id>')
def get_single_business(id):
    business = Business.query.options(
        joinedload(Business.business_images),
        joinedload(Business.categories)
    ).get(id)

    if not business:
        return {"error": "Business not found"}, 404
    
    # Serialize with relationships
    business_dict = business.to_dict()
    business_dict['reviews'] = [review.to_dict() for review in business.reviews]
    return business_dict

# Create a new business
# Get JSON data from request
# Create new Business object
# Add to database
# Return the created business
@business_routes.route('/', methods=['POST'])
@login_required
def create_business():

    data = request.get_json()
    business = Business(
        owner_id=current_user.id,
        name=data['name'], # Required field (will error if missing)
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
@login_required
def update_business(id):
    business = Business.query.get(id)

    if not business:
        return {"error": "Business not found"}, 404

    # Check if current users owns the business
    if business.owner_id != current_user.id:
        return {"error": "Access denied. You can only modify your own businesses."}, 403

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

# Delete a business by ID
# Get the business by ID
# Check if it exists (404 if not)
# Delete the business from database
# Commit changes
# Return success message

@business_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_business(id):
    business = Business.query.get(id)

    if not business:
        return {"error": "Business not found"}, 404

    # Check if current users owns the business
    if business.owner_id != current_user.id:
        return {"error": "Access denied. You can only delete your own businesses."}, 403

    db.session.delete(business)
    db.session.commit()
    return {"message": "Business deleted successfully"}, 200

# Get all businesses owned by the current logged-in user
# Query businesses where owner_id = current_user.id
# Convert to list of dictionaries
# Return in proper format

@business_routes.route('/my-businesses')
@login_required
def get_my_businesses():
    businesses = Business.query.filter(Business.owner_id == current_user.id)
    business_list = [business.to_dict() for business in businesses]
    return {"businesses": business_list}



@business_routes.route('/<int:business_id>/reviews', methods=['POST'])
@login_required
def create_review(business_id):
    business = Business.query.get(business_id)
    if not business:
        return jsonify({"message": "Business not found"}), 404
        
    data = request.get_json()
    
    # Validation
    errors = {}
    if not data.get('content'):
        errors["content"] = "Review content cannot be empty"
    if not data.get('rating') or not (1 <= data['rating'] <= 5):
        errors["rating"] = "Rating must be between 1 and 5"
    if errors:
        return jsonify({"message": "Validation error", "errors": errors}), 400

    # Check for existing review
    existing = Review.query.filter_by(
        user_id=current_user.id, 
        business_id=business_id
    ).first()
    if existing:
        return jsonify({"message": "You have already reviewed this business"}), 409

    # Create review
    new_review = Review(
        user_id=current_user.id,
        business_id=business_id,
        rating=data['rating'],
        title=data.get('title', ''),
        content=data['content'],
        created_at=datetime.utcnow()
    )
    db.session.add(new_review)
    db.session.commit()

    # Handle image if provided
    if data.get('image_url'):
        new_image = ReviewImage(
            review_id=new_review.id,
            uploaded_by_user_id=current_user.id,
            image_url=data['image_url'],
            caption=data.get('caption', ''),
            created_at=datetime.utcnow()
        )
        db.session.add(new_image)
        db.session.commit()
        
        review_data = new_review.to_dict()
        review_data['images'] = [new_image.to_dict()]
        return jsonify(review_data), 201
    
    return jsonify(new_review.to_dict()), 201
## Added to Business_routes to be nested under business
## if you are getting reviews that belong to business, it has to be nested under business.
@business_routes.route('/<int:id>/reviews')
def get_reviews_for_business(id):
    business = Business.query.get(id)
    if not business:
        return {"message": "Business not found"}, 404

    # Pagination, sorting
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    sort = request.args.get('sort', 'newest')

    if sort == 'oldest':
        sort_by = asc(Review.created_at)
    elif sort == 'highest':
        sort_by = desc(Review.rating)
    elif sort == 'lowest':
        sort_by = asc(Review.rating)
    else:  # default to newest
        sort_by = desc(Review.created_at)

    query = Review.query.filter_by(business_id=id).order_by(sort_by)
    paginated = query.paginate(page=page, per_page=limit, error_out=False)

    reviews = [review.to_dict() for review in paginated.items]

    return {
        "reviews": reviews,
        "business": {
            "id": business.id,
            "name": business.name
        },
        "pagination": {
            "page": paginated.page,
            "pages": paginated.pages,
            "per_page": paginated.per_page,
            "total": paginated.total
        }
    }
