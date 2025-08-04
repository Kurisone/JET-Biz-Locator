import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { createReview, uploadReviewImage } from '../../redux/reviews';
import './Reviews.css';

const CreateReviewForm = ({ businessId, onSuccess, refreshReviews }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  
  // Form state
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Handle adding an image URL
  const handleAddImage = () => {
    if (!currentImageUrl.trim()) return;
    
    // Simple URL validation
    if (!currentImageUrl.match(/\.(jpeg|jpg|gif|png)$/)) {
      setErrors({ images: "Please enter a valid image URL (jpg, png, gif)" });
      return;
    }
    
    setImageUrls(prev => [...prev, currentImageUrl.trim()]);
    setCurrentImageUrl('');
    setErrors({});
  };

  // Handle removing an image
  const handleRemoveImage = (index) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    // Validation
    const newErrors = {};
    if (!content.trim() || content.trim().length < 10) {
      newErrors.content = "Review must be at least 10 characters";
    }
    if (rating < 1 || rating > 5) {
      newErrors.rating = "Please select a rating between 1-5 stars";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }

  try {
    // 1. Create the review
    const reviewResult = await dispatch(createReview(businessId, {
      content: content.trim(),
      rating: Number(rating),
      title: '' 
    }));

    // Check if the review was created successfully
    if (!reviewResult || !reviewResult.id) {
      throw new Error("Failed to create review");
    }

    // 2. Upload images sequentially
    for (const url of imageUrls) {
      await dispatch(uploadReviewImage(reviewResult.id, {
        image_url: url,
        caption: `Image for review ${reviewResult.id}`
      }));
    }
    
    // 3. Refresh data and close modal
    if (refreshReviews) refreshReviews();
    if (onSuccess) onSuccess();
    closeModal();
  } catch (error) {
    console.error('Review submission error:', error);
    setErrors({
      submit: error.message || "Failed to submit review. Please try again."
    });
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="create-review-form-container">
      <h2>How was your experience?</h2>
      
      {errors.submit && (
        <div className="error-message">{errors.submit}</div>
      )}

      {/* Rating Section */}
      <div className="form-section">
        <label>Your Rating *</label>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= rating ? 'filled' : 'empty'}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => !submitting && setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        {errors.rating && (
          <div className="error-message">{errors.rating}</div>
        )}
      </div>

      {/* Review Content */}
      <div className="form-section">
        <label>Your Review *</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share details of your experience..."
          disabled={submitting}
          className={errors.content ? 'error' : ''}
        />
        {errors.content && (
          <div className="error-message">{errors.content}</div>
        )}
      </div>

      {/* Image Upload */}
      <div className="form-section">
        <label>Add Photos (Optional)</label>
        <div className="image-url-input">
          <input
            type="text"
            value={currentImageUrl}
            onChange={(e) => setCurrentImageUrl(e.target.value)}
            placeholder="Paste image URL here"
            disabled={submitting}
          />
          <button
            type="button"
            onClick={handleAddImage}
            disabled={submitting || !currentImageUrl.trim()}
            className="add-image-btn"
          >
            Add
          </button>
        </div>
        {errors.images && (
          <div className="error-message">{errors.images}</div>
        )}
        
        {/* Image Previews */}
        <div className="image-previews">
          {imageUrls.map((url, index) => (
            <div key={index} className="image-preview-item">
              <img src={url} alt={`Preview ${index}`} />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                disabled={submitting}
                className="remove-image-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button
          type="button"
          onClick={closeModal}
          disabled={submitting}
          className="cancel-btn"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={submitting || !content.trim() || rating === 0}
          className="submit-btn"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
};

export default CreateReviewForm;