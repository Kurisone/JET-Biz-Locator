// //CreateReviewForm.jsx

// import { useState } from 'react'; // For managing form state
// import { useDispatch } from 'react-redux'; // To dispatch Redux actions
// import { createReview } from '../../redux/reviews'; // Thunk to post review
// import { useModal } from '../../context/Modal'; // Custom modal hook
// import './Reviews.css';


// const CreateReviewForm = ({ businessId, onSuccess, refreshReviews }) => {
//   const dispatch = useDispatch(); // Redux dispatcher
//   const { closeModal } = useModal(); // Close modal on submit

//   const [content, setContent] = useState(''); // Review text
//   const [rating, setRating] = useState(0); // 
//   const [errors, setErrors] = useState({}); // 
//   const [submitting, setSubmitting] = useState(false); // disables button while submitting

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent page refresh
//     setErrors({}); // Clear previous errors
//     setSubmitting(true);

//     const payload = {
//       content: content.trim(), 
//       rating: Number(rating), 
//       title: '' 
//     };

//     try {
//         await dispatch(createReview(businessId, payload)).unwrap(); // Dispatch and unwrap errors if any
//         if (refreshReviews) refreshReviews(); // refresh review list after success
//         closeModal(); // close the modal
//         if (onSuccess) onSuccess(); // optional callback
//       } catch (err) {
//         if (err?.errors) {
//           setErrors(err.errors); // show backend validation errors
//         } else {
//           setErrors({ general: "Something went wrong. Please try again." }); // fallback error
//         }
//       } finally {
//         setSubmitting(false); // re-enable submit button
//       }
//     };

//   return (
//     <form onSubmit={handleSubmit} className="create-review-form"> {/* Form element */}
//       <h2>How was your visit?</h2>
//       {errors.general && <p className="error">{errors.general}</p>}

//       <textarea
//         placeholder="Leave your review here..." // Placeholder text
//         value={content} // Controlled input
//         onChange={(e) => setContent(e.target.value)} // Update state
//         required // HTML validation
//       />
//       {errors.content && <p className="error">{errors.content}</p>}
//       <label>
//         Rating:
//         <div className="star-rating-input">
//             {[1, 2, 3, 4, 5].map((star) => ( // map over 1-5
//             <span
//                 key={star} // each star needs a unique key
//                 className={star <= rating ? "filled-star" : "empty-star"} // apply class based on current rating
//                 onClick={() => setRating(star)} // set rating when clicked
//                 style={{ cursor: 'pointer', fontSize: '24px' }} // inline styles for interaction + size
//             >
//                 {star <= rating ? '★' : '☆'}
//             </span>
//             ))}
//         </div>
//       </label>
//       {errors.rating && <p className="error">{errors.rating}</p>}

//         <button
//         type="submit"
//         disabled={
//             submitting || content.trim().length < 10 || rating < 1 || rating > 5
//         }
//         >
//         {submitting ? "Submitting..." : "Submit Review"}
//         </button>
//     </form>
//   );
// };

// export default CreateReviewForm;
