// // ReviewCard.jsx - display each review

// import { useDispatch, useSelector } from 'react-redux';
// import { deleteReview, getReviewsByBusinessId } from '../../redux/reviews';
// import './Reviews.css';

// const ReviewCard = ({ review }) => {
//     const dispatch = useDispatch();
//     const currentUser = useSelector(state => state.session.user);

//     const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating); // visual stars

//     const handleDelete = () => {
//         if (window.confirm("Are you sure you want to delete this review?")) {
//             dispatch(deleteReview(review.id)).then(() => {
//                 dispatch(getReviewsByBusinessId(review.businessId)); //refresh after delete
//             });
//         }
//     };

//     return (
//         <div className="review-card">
//             <p><strong>{review.user?.firstName}</strong></p>
//             <p>{stars}</p> {/* star rating visual */}
//             <p>{review.content}</p>
//             <p>{new Date(review.createdAt).toLocaleDateString()}</p>

//             {currentUser?.id === review.userId && (
//                 <button onClick={handleDelete}>Delete</button>
//             )}
//         </div>
//     );
// };

// export default ReviewCard;