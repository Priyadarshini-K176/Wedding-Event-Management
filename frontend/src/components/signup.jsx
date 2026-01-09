import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import gimg from "../assets/login1.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="SignUp-main">
      
      <div className="SignUp-left">
        <CgProfile size={120} />
      </div>

      <div className="SignUp-right">
        <div className="SignUp-right-container">

          <div className="SignUp-logo">
            <CgProfile size={60} />
          </div>

          <div className="SignUp-center">
            <h2>Hello!</h2>
            <p>Please enter your details</p>

            <form>
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email" />

              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(false)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(true)} />
                )}
              </div>

              <div className="SignUp-center-options">
                <div className="remember-div">
                  <input type="checkbox" id="remember-checkbox" />
                  <label htmlFor="remember-checkbox">
                    Remember for 30 days
                  </label>
                </div>
              </div>

              <div className="SignUp-center-buttons">
                <button type="button">Register</button>
                <button type="button">
                  <img src={gimg} alt="google" />
                  Log In with Google
                </button>
              </div>
            </form>

            <p className="SignUp-bottom-p">
              Have an account? <a href="/signin">Log in</a>
            </p>

          </div>
        </div>
      </div>

    </div>
  );
}
