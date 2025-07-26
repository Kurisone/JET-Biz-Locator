from .db import db, environment, SCHEMA, add_prefix_for_prod
from .business_category import BusinessCategory

class Category(db.Model):
    __tablename__ = 'categories'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, nullable=True, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, nullable=True, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    # relationships
    business_categories = db.relationship("BusinessCategory", back_populates="category", cascade="all, delete-orphan", overlaps="businesses")
    businesses = db.relationship("Business", secondary=BusinessCategory.__table__, back_populates="categories", overlaps="business_categories")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }
