from app.models.db import db
from datetime import datetime

class ReviewImage(db.Model):
    __tablename__ = 'review_images'

    id = db.Column(db.Integer, primary_key=True)
    review_id = db.Column(db.Integer, db.ForeignKey('reviews.id'), nullable=False)
    uploaded_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    caption = db.Column(db.Text)
    is_primary = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    review = db.relationship('Review', backref='images')
    user = db.relationship('User', backref='uploaded_review_images')
    def to_dict(self):
        return {
            'id': self.id,
            'review_id': self.review_id,
            'uploaded_by_user_id': self.uploaded_by_user_id,
            'image_url': self.image_url,
            'caption': self.caption,
            'is_primary': self.is_primary,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }