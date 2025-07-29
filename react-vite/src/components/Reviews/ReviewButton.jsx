// ReviewList.jsx - "Post" or "Delete" button

import { useSelector, useDispatch } from "react-redux"; //access Redux state
import { getReviewsByBusinessId } from "../../redux/reviews";
import OpenModalButton from '../OpenModalButton'; //reusable modal tirgger
import CreateReviewForm from './CreateReviewForm'; // the form modal

// Props: business (object with id & ownerId) and reviews (normalized object of reviews)
const ReviewButton = ({ business, reviews}) => {
    const currentUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    
    const refreshReviews = () => {
        dispatch(getReviewsByBusinessId(business.id));
    };
    
// CONDITIONAL "post your review" button

    if (!currentUser) return null; //if not logged in , no button
    if (business.ownerId === currentUser.id) return null; // Owner of business, no button

    const alreadyReviewed = Object.values(reviews).some(
        review => review.userId === currentUser.id
    );
    if (alreadyReviewed) return null;


     // If all checks passed -> show "Post your Review" button

     return (
        <OpenModalButton
        buttonText ="Post Your Review"
        modalComponent={
            <CreateReviewForm
            businessId={business.id}
            refreshReviews={refreshReviews}
            />
        }
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