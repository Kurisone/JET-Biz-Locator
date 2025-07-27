import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllBusinesses } from '../../redux/businesses';
import './AllBusinessesPage.css';

const AllBusinessesPage = () => {
  const dispatch = useDispatch();
  const businesses = useSelector((state) => state.businesses.allBusinesses || {});
  const navigate = useNavigate();
  const businessesArray = Object.values(businesses);

  useEffect(() => {
    dispatch(fetchAllBusinesses());
  }, [dispatch]);

  const handleBusinessClick = (businessId) => {
  navigate(`/businesses/${businessId}`);
  };

  return (
    <div className="all-businesses-page">
      <div className="businesses-header">
        <h1>All Businesses</h1>
      </div>

      <div className="businesses-container">
        <div className="business-grid">
          {businessesArray.map(business => (
            <div
              key={business.id}
              className="business-card"
              onClick={() => handleBusinessClick(business.id)}
              style={{ cursor: 'pointer' }}
            >
              <h3>{business.name}</h3>
              <p className="business-location">{business.city}, {business.state}</p>
              <p className="business-description">{business.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllBusinessesPage;
