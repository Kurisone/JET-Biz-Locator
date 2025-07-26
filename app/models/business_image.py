from app.models.db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class BusinessImage(db.Model):
    __tablename__ = 'business_images'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    business_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('businesses.id')), nullable=False)
    uploaded_by_user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    caption = db.Column(db.Text)
    is_primary = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    business = db.relationship('Business', back_populates='business_images')
    user = db.relationship('User', backref='uploaded_business_images')

    def to_dict(self):
        return {
            'id': self.id,
            'business_id': self.business_id,
            'uploaded_by_user_id': self.uploaded_by_user_id,
            'image_url': self.image_url,
            'caption': self.caption,
            'is_primary': self.is_primary,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
