import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deleteBusiness } from '../../redux/businesses';
import { getReviewsByBusinessId } from '../../redux/reviews';
import BusinessImages from '../Images/BusinessImages';
import ReviewList from '../Reviews/ReviewList';
import ReviewButton from '../Reviews/ReviewButton';
import './BusinessDetailPage.css';

const BusinessDetailPage = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [business, setBusiness] = useState(null);
  const [businessImages, setBusinessImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useSelector(state => state.session.user);
  const reviews = useSelector(state => state.reviews);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/businesses/${businessId}`);

        if (response.ok) {
          const data = await response.json();
          setBusiness(data);
          setBusinessImages(data.images || []);
          
          // Fetch reviews for this business
          dispatch(getReviewsByBusinessId(businessId));
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
  }, [businessId, dispatch]);

  const renderPriceRange = (priceRange) => {
    if (!priceRange) return '';
    return '$'.repeat(Math.min(priceRange, 4));
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      try {
        await dispatch(deleteBusiness(businessId));
        navigate('/my-businesses');
      } catch (error) {
        alert('Failed to delete business. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="error">
        <h2>Business Not Found</h2>
        <p>The business you&apos;re looking for doesn&apos;t exist.</p>
        <button onClick={() => navigate('/')} className="back-button">
          Back to All Businesses
        </button>
      </div>
    );
  }

  const isOwner = user && business && user.id === business.owner_id;
  
  // Calculate average rating
  const calculateAverageRating = () => {
    if (!reviews || Object.keys(reviews).length === 0) return 0;
    
    const reviewArray = Object.values(reviews);
    const total = reviewArray.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviewArray.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();

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
            <div className="business-header-flex">
              <h1 className="business-title">{business.name}</h1>
              
              {/* Edit/Delete buttons for owner */}
              {isOwner && (
                <div className="business-owner-actions">
                  <Link
                    to={`/businesses/${business.id}/edit`}
                    className="edit-business-btn"
                  >
                    <i className="fas fa-edit"></i> Edit Business
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="delete-business-btn"
                  >
                    <i className="fas fa-trash"></i> Delete Business
                  </button>
                </div>
              )}
            </div>

            <div className="business-meta">
              <span className="price-range">
                {renderPriceRange(business.price_range)}
              </span>
              <span className="rating">
                {averageRating} ★ ({Object.keys(reviews).length} reviews)
              </span>
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

            {/* Business Images Section */}
            <div className="images-section">
              <BusinessImages images={businessImages} />
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
              <div className="reviews-header">
                <h3>Customer Reviews</h3>
                <ReviewButton business={business} reviews={reviews} />
              </div>
              
              <ReviewList businessId={businessId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailPage;