import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword: "Passwords must match",
        password: "Passwords must match"
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        first_name,
        last_name,
        password,
        confirm_password: confirmPassword
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div className="signup-modal-container">
      <h1 className="signup-header">Sign Up</h1>
      
      {errors.server && (
        <div className="error-message server-error">{errors.server}</div>
      )}

      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`form-input ${errors.email ? 'error' : ''}`}
            required
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`form-input ${errors.username ? 'error' : ''}`}
            required
          />
          {errors.username && <div className="error-message">{errors.username}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            id="first_name"
            type="text"
            value={first_name}
            onChange={(e) => setfirst_name(e.target.value)}
            className={`form-input ${errors.first_name ? 'error' : ''}`}
            required
          />
          {errors.first_name && <div className="error-message">{errors.first_name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            id="last_name"
            type="text"
            value={last_name}
            onChange={(e) => setlast_name(e.target.value)}
            className={`form-input ${errors.last_name ? 'error' : ''}`}
            required
          />
          {errors.last_name && <div className="error-message">{errors.last_name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`form-input ${errors.password ? 'error' : ''}`}
            required
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            required
          />
          {errors.confirmPassword && (
            <div className="error-message">{errors.confirmPassword}</div>
          )}
        </div>

        <button type="submit" className="signup-button">
          Sign Up
        </button>

        <div className="login-prompt">
          Already signed up?{" "}
          <OpenModalButton
            buttonText="Log in here"
            modalComponent={<LoginFormModal />}
            buttonClass="login-link"
            // onButtonClick={closeModal}
          />
        </div>
      </form>
    </div>
  );
}

export default SignupFormModal;