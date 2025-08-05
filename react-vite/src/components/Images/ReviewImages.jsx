import { useState } from 'react';
import './ReviewImages.css';

const ReviewImages = ({ images, reviewId }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="review-images">
      {/* Large preview */}
      <div className="large-image-container">
        <img
          src={selectedImage.image_url}
          alt={selectedImage.caption || `Review ${reviewId} image ${selectedIndex + 1}`}
          className="large-image"
        />
        {selectedImage.caption && (
          <p className="image-caption">{selectedImage.caption}</p>
        )}
      </div>

      {/* Thumbnails */}
      <div className="thumbnails-grid">
        {images.map((image, index) => (
          <img
            key={image.id}
            src={image.image_url}
            alt={image.caption || `Review ${reviewId} image ${index + 1}`}
            className={`thumbnail-image ${
              index === selectedIndex ? 'selected' : ''
            }`}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewImages;
