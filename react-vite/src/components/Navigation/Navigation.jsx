import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const user = useSelector((store) => store.session.user);


  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();


  return (
    <>
      <div className="page-content">
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/businesses?search=${encodeURIComponent(searchQuery)}`);
            }}
            className="search-container"
          >
            <input
              type="text"
              className="search-bar"
              placeholder="Search businesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
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
      </div>
    </>
  );
}

export default Navigation;