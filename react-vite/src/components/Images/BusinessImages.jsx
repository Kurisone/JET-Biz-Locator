
import './BusinessImages.css';

const BusinessImages = ({ images }) => {
  if (!images || images.length === 0) {
    return (
      <div className="business-images">
        <h3>Photos</h3>
        <p className="no-images">No images available yet.</p>
      </div>
    );
  }

  return (
    <div className="business-images">
      <h3>Photos</h3>
      <div className="images-grid">
        {images.map(image => (
          <div key={image.id} className="image-item">
            <img 
              src={image.image_url} 
              alt={`Business ${image.business_id}`} 
              className="business-image"
            />
            {image.caption && <p className="image-caption">{image.caption}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessImages;