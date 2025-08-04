import ReviewImages from '../Images/ReviewImages';
import { useDispatch, useSelector } from 'react-redux';
import { deleteReview } from '../../redux/reviews';
import './Reviews.css';

const ReviewCard = ({ review }) => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.session.user);

    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                await dispatch(deleteReview(review.id));
            } catch (error) {
                console.error("Delete failed:", error);
                alert(error.message || "Couldn't delete review");
            }
        }
    };
    // Check if current user is the review owner
    const isReviewOwner = currentUser &&
        (currentUser.id === review.user_id ||
            currentUser.id === review.userId);

    return (
        <div className="review-card">
            <div className="review-header">
                <p className="review-user">
                    <strong>{review.user?.username || review.user?.firstName || review.username || 'Anonymous'}</strong>
                </p>
                <div className="review-meta">
                    <span className="review-stars">{stars}</span>
                    <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>
            </div>

            <div className="review-content">
                {review.content}
            </div>

            {review.images?.length > 0 && (
                <ReviewImages images={review.images} reviewId={review.id} />
            )}

            {isReviewOwner && (
                <button
                    onClick={handleDelete}
                    className="delete-review-btn"
                >
                    Delete Review
                </button>
            )}
        </div>
    );
};

export default ReviewCard;