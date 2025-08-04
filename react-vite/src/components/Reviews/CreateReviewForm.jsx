import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { createReview, uploadReviewImage } from '../../redux/reviews';
import './Reviews.css';

const CreateReviewForm = ({ businessId, onSuccess, refreshReviews }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState([]); // Array of file objects
  const [previewUrls, setPreviewUrls] = useState([]); // Array of preview URLs

  // Create preview URLs when images are selected
  useEffect(() => {
    const urls = images.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    
    // Clean up preview URLs when component unmounts
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    const payload = {
      content: content.trim(),
      rating: Number(rating),
      title: ''
    };

    try {
      // 1. First create the review
      const review = await dispatch(createReview(businessId, payload));
      
      // 2. Then upload images and attach to the review
      for (const file of images) {
        await dispatch(uploadReviewImage(review.id, file));
      }
      
      // 3. Refresh reviews and close modal
      if (refreshReviews) refreshReviews();
      closeModal();
      if (onSuccess) onSuccess();
    } catch (error) {
      if (error?.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-review-form">
      <h2>How was your visit?</h2>
      {errors.general && <p className="error">{errors.general}</p>}

      <textarea
        placeholder="Leave your review here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      {errors.content && <p className="error">{errors.content}</p>}
      <label>
        Rating:
        <div className="star-rating-input">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= rating ? "filled-star" : "empty-star"}
              onClick={() => setRating(star)}
              style={{ cursor: 'pointer', fontSize: '24px' }}
            >
              {star <= rating ? '★' : '☆'}
            </span>
          ))}
        </div>
      </label>
      {errors.rating && <p className="error">{errors.rating}</p>}

      <div className="image-upload-section">
        <label>Upload Images:</label>
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleImageUpload}
        />
        <div className="image-preview">
          {previewUrls.map((url, index) => (
            <img 
              key={index} 
              src={url} 
              alt="Preview" 
              className="preview-image"
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || content.trim().length < 10 || rating < 1 || rating > 5}
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default CreateReviewForm;