import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import OpenModalButton from "./OpenModalButton";
import LoginFormModal from "./LoginFormModal/LoginFormModal";
import SignupFormModal from "./SignupFormModal/SignupFormModal";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const user = useSelector((store) => store.session.user);

  return (
    <nav className="nav-container">
      <div className="nav-left">
        <NavLink to="/" className="nav-logo">
          <h1>JET-Biz-Locator</h1>
        </NavLink>
      </div>
      <div className="nav-right">
        {!user && (
          <>
            <OpenModalButton
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
              buttonClass="nav-button login"
            />
            <OpenModalButton
              buttonText="Sign Up"
              modalComponent={<SignupFormModal />}
              buttonClass="nav-button signup"
            />
          </>
        )}
        <ProfileButton />
      </div>
    </nav>
  );
}

export default Navigation;