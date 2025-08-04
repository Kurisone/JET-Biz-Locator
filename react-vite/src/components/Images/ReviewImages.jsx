import './ReviewImages.css';
const ReviewImages = ({ images, reviewId }) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="review-images">
      {images.map(image => (
        <div key={image.id} className="review-image-item">
          <img 
            src={image.image_url} 
            alt={`Review ${reviewId}`} 
            className="review-image"
          />
          {image.caption && <p className="image-caption">{image.caption}</p>}
        </div>
      ))}
    </div>
  );
};

export default ReviewImages;