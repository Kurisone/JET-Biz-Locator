import { useState } from 'react';
import './BusinessImages.css';

const BusinessImages = ({ images, isOwner = false, onDeleteImage }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="business-images">
        <h3>Photos</h3>
        <p className="no-images">No images available yet.</p>
      </div>
    );
  }

  const selectedImage = images[selectedIndex] || images[0];

  const handleDelete = (imageId, index) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      onDeleteImage(imageId);

      // Adjust selected index if necessary
      if (index === selectedIndex) {
        setSelectedIndex(0);
      } else if (index < selectedIndex) {
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      }
    }
  };

  return (
    <div className="business-images">
      <h3>Photos</h3>

      {/* Large preview */}
      <div className="large-image-container">
        <img
          src={selectedImage.image_url}
          alt={selectedImage.caption || `Image ${selectedIndex + 1}`}
          className="large-image"
        />
        {selectedImage.caption && (
          <p className="image-caption">{selectedImage.caption}</p>
        )}
      </div>

      {/* Thumbnails grid */}
      <div className="thumbnails-grid">
        {images.map((image, index) => (
          <div key={image.id} className="thumbnail-wrapper">
            <img
              src={image.image_url}
              alt={image.caption || `Image ${index + 1}`}
              className={`thumbnail-image ${
                index === selectedIndex ? 'selected' : ''
              }`}
              onClick={() => setSelectedIndex(index)}
            />

            {isOwner && (
              <button
                className="delete-image-btn"
                onClick={() => handleDelete(image.id, index)}
                title="Delete Image"
              >
                🗑️
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessImages;
