import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { setFilters } from "../../redux/businesses";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const user = useSelector((store) => store.session.user);
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.businesses.filters);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  
  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchInput }));
  }
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
        <div className="search-container">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                className="search-bar"
                placeholder="Search businesses..."
                value={searchInput}
                onChange={handleInputChange}
              />
            </form>
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
    </div>
    </>
  );
}

export default Navigation;