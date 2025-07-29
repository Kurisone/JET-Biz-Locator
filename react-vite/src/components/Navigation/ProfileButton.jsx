import { useDispatch } from "react-redux";
import { thunkLogout } from "../../redux/session";

function ProfileButton({ closeMenu }) {
  const dispatch = useDispatch();

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    if (closeMenu) closeMenu();
  };

  return (
    <button onClick={logout} className="menu-item logout-button">
      <i className="fas fa-sign-out-alt"></i> Log Out
    </button>
  );
}

export default ProfileButton;
