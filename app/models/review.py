from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Review(db.Model):
    __tablename__ = 'reviews' # creating tablename

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    business_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('businesses.id')), nullable=False)
    rating = db.Column(db.Integer, nullable=False) # 1 to 5
    title = db.Column(db.String(100))
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relationships
    user = db.relationship("User", back_populates="reviews")
    business = db.relationship("Business", back_populates="reviews")
    review_images = db.relationship('ReviewImage', back_populates='review', cascade='all, delete-orphan') # revised

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "businessId": self.business_id,
            "rating": self.rating,
            "title": self.title,
            'images': [image.to_dict() for image in self.review_images],
            "content": self.content,
            "createdAt": self.created_at,
            "user": self.user.to_dict() if self.user else None # optional, for frontend
        }
