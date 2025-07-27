import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BusinessDetailPage.css';

const BusinessDetailPage = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/businesses/${businessId}`);

        if (response.ok) {
          const data = await response.json();
          setBusiness(data);
        } else {
          setError('Business not found');
        }
      } catch (err) {
        setError('Failed to load business');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchBusiness();
    }
  }, [businessId]);

  const renderPriceRange = (priceRange) => {
    if (!priceRange) return '';
    return '$'.repeat(Math.min(priceRange, 4));
  };

  if (loading) return <div className="loading">Loading business details...</div>;

  if (error || !business) {
    return (
      <div className="error">
        <h2>Business Not Found</h2>
        <p>The business you&apos;re looking for doesn&apos;t exist.</p>
        <button onClick={() => navigate('/')}>
          Back to All Businesses
        </button>
      </div>
    );
  }

  return (
    <div className="business-detail-page">
      <div className="business-detail-header">
        <div className="breadcrumb">
          <button onClick={() => navigate('/')} className="back-button">
            ← Back to All Businesses
          </button>
        </div>
      </div>

      <div className="business-detail-container">
        <div className="business-detail-card">
          <div className="business-title-section">
            <h1 className="business-title">{business.name}</h1>

            <div className="business-meta">
              <span className="price-range">
                {renderPriceRange(business.price_range)}
              </span>
              <span className="rating-placeholder">★★★★☆</span>
            </div>

            <div className="business-location-main">
              📍 {business.city}, {business.state}
            </div>
          </div>

          <div className="business-content">
            <div className="business-description-section">
              <h3>About</h3>
              <p className="business-description-text">{business.description}</p>
            </div>

            <div className="business-info-section">
              <h3>Contact Information</h3>

              <div className="info-item">
                <span className="info-label">Address:</span>
                <div className="info-value">
                  {business.address}<br />
                  {business.city}, {business.state} {business.zip_code}<br />
                  {business.country}
                </div>
              </div>

              {business.phone && (
                <div className="info-item">
                  <span className="info-label">Phone:</span>
                  <div className="info-value">{business.phone}</div>
                </div>
              )}

              {business.email && (
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <div className="info-value">
                    <a href={`mailto:${business.email}`}>{business.email}</a>
                  </div>
                </div>
              )}

              {business.website && (
                <div className="info-item">
                  <span className="info-label">Website:</span>
                  <div className="info-value">
                    <a href={business.website} target="_blank" rel="noopener noreferrer">
                      {business.website}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="placeholder-sections">
              <div className="placeholder-section">
                <h3>Photos</h3>
                <p>Photos will be displayed here (Images feature coming soon)</p>
              </div>

              <div className="placeholder-section">
                <h3>Reviews</h3>
                <p>Reviews will be displayed here (Reviews feature coming soon)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailPage;
