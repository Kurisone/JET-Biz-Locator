import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const user = useSelector(state => state.session.user);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

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

  // Hide navigation on homepage
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-left">
          <NavLink to="/" className="home-link">Home</NavLink>
        </div>

        <div className="nav-right">
          {/* Single Hamburger Menu for all users */}
          <div className="hamburger-menu" ref={menuRef}>
            <button onClick={toggleMenu} className="hamburger-button">
              <i className="fas fa-bars"></i>
            </button>

            {showMenu && (
              <div className="hamburger-dropdown">
                {user ? (
                  // Logged in menu
                  <>
                    <div className="menu-header">
                      <span className="username">Hello, {user.username}!</span>
                    </div>
                    <div className="menu-divider"></div>
                    <NavLink
                      to="/my-businesses"
                      onClick={() => setShowMenu(false)}
                      className="menu-item"
                    >
                      <i className="fas fa-store"></i> My Businesses
                    </NavLink>
                    <NavLink
                      to="/businesses/new"
                      onClick={() => setShowMenu(false)}
                      className="menu-item"
                    >
                      <i className="fas fa-plus"></i> Add a Business
                    </NavLink>
                    <div className="menu-divider"></div>
                    <ProfileButton closeMenu={() => setShowMenu(false)} />
                  </>
                ) : (
                  // Not logged in menu
                  <>
                    <NavLink
                      to="/login"
                      onClick={() => setShowMenu(false)}
                      className="menu-item"
                    >
                      Log In
                    </NavLink>
                    <NavLink
                      to="/signup"
                      onClick={() => setShowMenu(false)}
                      className="menu-item"
                    >
                      Sign Up
                    </NavLink>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
