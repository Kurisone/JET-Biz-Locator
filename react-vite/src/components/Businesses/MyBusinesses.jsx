import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAllBusinesses, deleteBusiness  } from '../../redux/businesses';
import './MyBusinesses.css';

const MyBusinesses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get current user and all businesses
  const user = useSelector(state => state.session.user);
  const allBusinesses = useSelector(state => state.businesses.allBusinesses);

  // Filter businesses owned by current user
  const myBusinesses = Object.values(allBusinesses).filter(
    business => business.owner_id === user?.id
  );

  useEffect(() => {
    // Fetch all businesses when component mounts
    dispatch(fetchAllBusinesses());
  }, [dispatch]);

  // Delete handler
  const handleDelete = async (businessId, businessName) => {
    if (window.confirm(`Are you sure you want to delete "${businessName}"? This action cannot be undone.`)) {
      try {
        await dispatch(deleteBusiness(businessId));
        // No need to navigate, the business will be removed from the list automatically
      } catch (error) {
        alert('Failed to delete business. Please try again.');
      }
    }
  };

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="my-businesses-page">
      <div className="my-businesses-header">
        <h1>My Businesses</h1>
        <Link to="/businesses/new" className="add-business-btn">
          + Add New Business
        </Link>
      </div>

      <div className="my-businesses-container">
        {myBusinesses.length === 0 ? (
          <div className="no-businesses">
            <p>You haven&apos;t added any businesses yet.</p>
            <Link to="/businesses/new" className="get-started-btn">
              Add Your First Business
            </Link>
          </div>
        ) : (
          <div className="businesses-grid">
            {myBusinesses.map(business => (
              <div key={business.id} className="business-card">
                <h3>{business.name}</h3>
                <p className="business-address">
                  {business.address}, {business.city}, {business.state}
                </p>
                <p className="business-description">
                  {business.description.length > 100
                    ? `${business.description.substring(0, 100)}...`
                    : business.description}
                </p>
                <div className="business-card-actions">
                  <Link
                    to={`/businesses/${business.id}`}
                    className="view-btn"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/businesses/${business.id}/edit`}
                    className="edit-btn"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(business.id, business.name)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBusinesses;
