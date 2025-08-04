// ReviewButton.jsx
import OpenModalButton from '../OpenModalButton';
import CreateReviewForm from './CreateReviewForm';
import { useSelector, useDispatch } from 'react-redux';
import { getReviewsByBusinessId } from '../../redux/reviews';

const ReviewButton = ({ business, reviews }) => {
  const currentUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  
  
  if (!currentUser || business.owner_id === currentUser.id) return null;
  
  const alreadyReviewed = Object.values(reviews).some(
    review => review.user_id === currentUser.id
  );
  
  if (alreadyReviewed) return null;

  return (
    <OpenModalButton
      buttonText="Write a Review"
      modalComponent={
        <CreateReviewForm 
          businessId={business.id}
          refreshReviews={() => dispatch(getReviewsByBusinessId(business.id))}
        />
      }
      buttonClass="review-button"
    />
  );
};

export default ReviewButton;



// --------------------------------------------------
// For BusinessDetailPage
// --------------------------------------------------

// import ReviewList from '../Reviews/ReviewList';
// import ReviewButton from '../Reviews/ReviewButton';
// import { useSelector } from 'react-redux';

// const BusinessDetailPage = ({ business }) => {
//   const reviews = useSelector(state => state.reviews);

//   return (
//     <div>
//       <h1>{business.name}</h1>
//       {/* ... business info ... */}
      
//       <ReviewButton business={business} reviews={reviews} />
//       <ReviewList businessId={business.id} />
//     </div>
//   );
// };