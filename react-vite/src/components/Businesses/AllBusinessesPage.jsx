import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllBusinesses } from '../../redux/businesses';
import { FaHome, FaBars } from 'react-icons/fa';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProfileButton from '../Navigation/ProfileButton';
import './AllBusinessesPage.css';

const AllBusinessesPage = () => {
  const dispatch = useDispatch();
  const businesses = useSelector((state) => state.businesses.allBusinesses || {});
  const user = useSelector(state => state.session.user);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const businessesArray = Object.values(businesses);

  useEffect(() => {
    dispatch(fetchAllBusinesses());
  }, [dispatch]);

  const handleBusinessClick = (businessId) => {
    navigate(`/businesses/${businessId}`);
  };

  const toggleMenu = () => setShowMenu(!showMenu);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="all-businesses-page">
      <div className="businesses-header">
        <div className="header-nav">
          <Link to="/" className="home-icon">
            <FaHome />
          </Link>

          <div className="search-container">
            <input
              type="text"
              placeholder="Find a business near you"
              className="search-input"
            />
          </div>

          <div className="hamburger-menu" ref={menuRef}>
            <button onClick={toggleMenu} className="hamburger-button">
              <FaBars />
            </button>

            {showMenu && (
              <div className="hamburger-dropdown">
                {user ? (
                  <>
                    <div className="menu-header">
                      <span className="username">Hello, {user.username}!</span>
                    </div>
                    <div className="menu-divider"></div>
                    <Link
                      to="/my-businesses"
                      onClick={() => setShowMenu(false)}
                      className="menu-item"
                    >
                      <i className="fas fa-store"></i> My Businesses
                    </Link>
                    <Link
                      to="/businesses/new"
                      onClick={() => setShowMenu(false)}
                      className="menu-item"
                    >
                      <i className="fas fa-plus"></i> Add a Business
                    </Link>
                    <div className="menu-divider"></div>
                    <ProfileButton closeMenu={() => setShowMenu(false)} />
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setShowMenu(false)}
                      className="menu-item"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setShowMenu(false)}
                      className="menu-item"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

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
