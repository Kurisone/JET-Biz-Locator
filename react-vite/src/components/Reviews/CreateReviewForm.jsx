import { useState } from 'react'; // For managing form state
import { useDispatch } from 'react-redux'; // To dispatch Redux actions
import { createReview } from '../../redux/reviews'; // Thunk to post review
import { useModal } from '../../context/Modal'; // Custom modal hook

const CreateReviewForm = ({ businessId, onSuccess }) => {
  const dispatch = useDispatch(); // Redux dispatcher
  const { closeModal } = useModal(); // Close modal on submit

  const [content, setContent] = useState(''); // Review text
  const [rating, setRating] = useState(''); // 
  const [errors, setErrors] = useState({}); // 

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setErrors({}); // Clear previous errors

    const payload = {
      content: content.trim(), 
      rating: Number(rating), 
      title: '' 
    };

    try {
      await dispatch(createReview(businessId, payload)); // Send to backend
      closeModal(); // Close modal after success
      if (onSuccess) onSuccess(); // Refresh parent if needed
    } catch (res) {
      const data = await res.json(); // Get error data
      if (data?.errors) {
        setErrors(data.errors); // Show validation errors
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-review-form"> {/* Form element */}
      <h2>How was your visit?</h2>

      <textarea
        placeholder="Leave your review here..." // Placeholder text
        value={content} // Controlled input
        onChange={(e) => setContent(e.target.value)} // Update state
        required // HTML validation
      />
      {errors.content && <p className="error">{errors.content}</p>} // Show content error

      <label>
        Rating (1–5):
        <input
          type="number" 
          min="1" 
          max="5" 
          value={rating}
          onChange={(e) => setRating(e.target.value)} // Update state
          required // HTML validation
        />
      </label>
      {errors.rating && <p className="error">{errors.rating}</p>} // Show rating error

      <button
        type="submit" // Submit form
        disabled={content.trim().length < 10 || rating < 1 || rating > 5} // Disable if invalid
      >
        Submit Review
      </button>
    </form>
  );
};

export default CreateReviewForm;
