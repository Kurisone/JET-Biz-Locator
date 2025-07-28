import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    const demoCredentials = {
      email: "demo@aa.io",
      password: "password"
    };

    const serverResponse = await dispatch(thunkLogin(demoCredentials));
    
    if (!serverResponse) {
      closeModal();
    }
  };

  return (
    <div className="login-modal-container">
      <h1 className="login-header">Log In</h1>
      <form onSubmit={handleSubmit} className="login-form">
        {errors.server && <div className="error-message">{errors.server}</div>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`form-input ${errors.email ? 'error' : ''}`}
            required
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
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
        <button type="submit" className="login-button">Log In</button>
        <button 
          type="button" 
          onClick={handleDemoLogin} 
          className="demo-user-button"
        >
          DEMO USER
        </button>
        
        <div className="signup-prompt">
          Not signed up for JET Biz Locator?{" "}
          <OpenModalButton
            buttonText="Click here!"
            modalComponent={<SignupFormModal />}
            buttonClass="signup-link"
            // onButtonClick={closeModal}
          />
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;