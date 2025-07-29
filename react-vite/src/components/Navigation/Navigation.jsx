import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const user = useSelector((store) => store.session.user);

  return (
    <>
      <nav className="nav-container">
        <div className="nav-left">
          <NavLink to="/" className="nav-logo">
            <img 
              src="/logo.png" 
              alt="JET-Biz-Locator" 
              className="logo-image" 
            />
          </NavLink>
        </div>
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search businesses..."
          />
        </div>
        <div className="nav-right">
          {!user && (
            <>
              {/* <OpenModalButton
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
                buttonClass="nav-button login"
              />
              <OpenModalButton
                buttonText="Sign Up"
                modalComponent={<SignupFormModal />}
                buttonClass="nav-button signup"
              /> */}
            </>
          )}
          <ProfileButton />
        </div>
      </nav>
    </>
  );
}

export default Navigation;