from .db import db, environment, SCHEMA, add_prefix_for_prod


class Business(db.Model):
    __tablename__ = 'businesses'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    address = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    zip_code = db.Column(db.String(20), nullable=False)
    country = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20))
    website = db.Column(db.String(255))
    email = db.Column(db.String(100))
    price_range = db.Column(db.Integer)
    latitude = db.Column(db.Numeric(10, 8))
    longitude = db.Column(db.Numeric(11, 8))
    hours_monday = db.Column(db.String(50))
    hours_tuesday = db.Column(db.String(50))
    hours_wednesday = db.Column(db.String(50))
    hours_thursday = db.Column(db.String(50))
    hours_friday = db.Column(db.String(50))
    hours_saturday = db.Column(db.String(50))
    hours_sunday = db.Column(db.String(50))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    reviews = db.relationship("Review", back_populates="business", cascade="all, delete") ### added to fix 404 issue

    # Relationships

    # Relationship to User (owner) (M-to-1)
    # Relationship to the user who owns this business
    # Detail explanation: One User can own MANY businesses; Each business has exactly ONE owner
    # A given business belongs to one user, and that user can own multiple businesses
    owner = db.relationship("User", back_populates="businesses")

    # Relationship to reviews of this business (1-to-M)
    # Detail explanation: One business can have MANY reviews; Each review belongs to exactly ONE business
    # A given business can have multiple reviews written about it


    # Relationship to BusinessCategories (M-to-M)
    # Many-to-many relationship with categories
    # Detail explanation: One business can have MANY categories(a pizza place (e.g., Tom pizza) is  "Restaurant" + "Italian" + "Takeout");
    # One category can include MANY businesses("Restaurant" includes Tom's pizza + Maria's diner + etc )
    # This business can be tagged with multiple categories, and categories can be shared by multiple businesses
    business_categories = db.relationship("BusinessCategory", back_populates="business", cascade="all, delete-orphan", overlaps="categories")
    categories = db.relationship("Category", secondary="business_categories", back_populates="businesses", overlaps="business_categories")

    # Relationship to BusinessImages (1-M)
    # Detail explanation: One business can have MANY images (Tom's Pizza has photos of storefront, interior, food);
    # Each image belongs to exactly ONE business
    # A given business can have multiple photos uploaded for it
    # business_images = db.relationship("BusinessImage", back_populates="business", cascade="all, delete")


    # This is for the API responses
    def to_dict(self):
      return {
        'id': self.id,
        'name': self.name,
        'description': self.description,
        'address': self.address,
        'city': self.city,
        'state': self.state,
        'zip_code': self.zip_code,
        'country': self.country,
        'phone': self.phone,
        'website': self.website,
        'email': self.email,
        'price_range': self.price_range,
        'latitude': float(self.latitude) if self.latitude else None,
        'longitude': float(self.longitude) if self.longitude else None,
        'is_active': self.is_active,
        'owner_id': self.owner_id
      }
