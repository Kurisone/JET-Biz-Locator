from .db import db, environment, SCHEMA, add_prefix_for_prod

class BusinessCategory(db.Model):
    __tablename__ = 'business_categories'

    if environment == "production":
        __table_args__ = (
            db.UniqueConstraint('business_id', 'category_id', name='unique_business_category'),
            {'schema': SCHEMA}
        )
    else:
        __table_args__ = (
            db.UniqueConstraint('business_id', 'category_id', name='unique_business_category'),
        )

    id = db.Column(db.Integer, primary_key=True)
    business_id = db.Column(db.Integer, db.ForeignKey('businesses.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=True, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, nullable=True, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    # Relationships
    business = db.relationship("Business", back_populates="business_categories", overlaps="businesses,categories")
    category = db.relationship("Category", back_populates="business_categories", overlaps="businesses,categories")

    def to_dict(self):
        return {
            'id': self.id,
            'business_id': self.business_id,
            'category_id': self.category_id,
            'business_name': self.business.name if self.business else None,
            'category_name': self.category.name if self.category else None
        }
