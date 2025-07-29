import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import "./ProfileButton.css";

function ProfileButton({ closeMenu }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    if (closeMenu) closeMenu();
  };

  return (
    <div className="profile-button-container">
      <button 
        onClick={toggleMenu} 
        className={`profile-button ${showMenu ? 'menu-open' : ''}`}
      >
        <div className="hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
        {user && <span className="username">{user.username}</span>}
      </button>
      {showMenu && (
        <ul className="profile-dropdown" ref={ulRef}>
          {user ? (
            <>
              <div className="menu-header">
                <span className="username">Hello, {user.username}!</span>
              </div>
              <div className="menu-divider"></div>
              <li className="dropdown-item">
                <NavLink
                  to="/my-businesses"
                  onClick={() => setShowMenu(false)}
                  className="menu-item"
                >
                  <i className="fas fa-store"></i> My Businesses
                </NavLink>
              </li>
              <li className="dropdown-item">
                <NavLink
                  to="/businesses/new"
                  onClick={() => setShowMenu(false)}
                  className="menu-item"
                >
                  <i className="fas fa-plus"></i> Add a Business
                </NavLink>
              </li>
              <div className="menu-divider"></div>
              <li className="dropdown-item">{user.email}</li>
              <li className="dropdown-item">
                <button onClick={logout} className="logout-button">Log Out</button>
              </li>
            </>
          ) : (
            <>
              <li className="dropdown-item">
                <OpenModalMenuItem
                  itemText="Log In"
                  onItemClick={closeMenu}
                  modalComponent={<LoginFormModal />}
                />
              </li>
              <li className="dropdown-item">
                <OpenModalMenuItem
                  itemText="Sign Up"
                  onItemClick={closeMenu}
                  modalComponent={<SignupFormModal />}
                />
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;