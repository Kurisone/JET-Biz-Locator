// ReviewList.jsx - Maps all reviews

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReviewsByBusinessId } from '../../redux/reviews';

const ReviewList = ({ businessId }) => {
  const dispatch = useDispatch();

  const reviews = useSelector(state => state.reviews); // all reviews from  Redux
  const currentUser = useSelector(state => state.session.user); // current logged in user

  const reviewArray = Object.values(reviews).reverse(); // convert to array & show newest first

  useEffect(() => {
    dispatch(getReviewsByBusinessId(businessId)); // fetch reviews for this business
  }, [dispatch, businessId]);

  return (
    <div className="review-list">
      {reviewArray.length === 0 && <p>No reviews yet.</p>} 

      {reviewArray.map(review => (
        <div key={review.id} className="review-card">
          <p><strong>{review.user?.firstName}</strong></p>
          <p>{review.content}</p>
          <p>Rating: {review.rating} / 5</p>
          <p>{new Date(review.createdAt).toLocaleDateString()}</p>

          {currentUser?.id === review.userId && (
            <button>Delete</button> // delete logic comes later
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
