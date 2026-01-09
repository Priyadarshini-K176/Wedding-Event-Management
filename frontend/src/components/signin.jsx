import React,{  useState } from "react";
import { CgProfile } from "react-icons/cg";
import gimg from "../assets/login1.png";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import SignUp from "./signup"

export default function Login()
{
 const[showPassword, setShowPassword]= useState(false);

 return(
    <div className="login-main">
        <div classname="login-left">
            <img src={CgProfile}alt=""/>
        </div>
        <div className="login-right">
            <div classname="login-right-container">
                <div className="login-logo">
                <img src={CgProfile} alt=""/>
                </div>
          <div className="login-center">
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>
            <form>
              <input type="email" placeholder="Email" />
              <div className="pass-input-div">
                <input type={showPassword ? "text" : "password"} placeholder="Password" />
                {showPassword ? <FaEyeSlash onClick={() => {setShowPassword(!showPassword)}} /> : <FaEye onClick={() => {setShowPassword(!showPassword)}} />}
                
              </div>

              <div className="login-center-options">
                <div className="remember-div">
                  <input type="checkbox" id="remember-checkbox" />
                  <label htmlFor="remember-checkbox">
                    Remember for 30 days
                  </label>
                </div>
                <a href="#" className="forgot-pass-link">
                  Forgot password?
                </a>
              </div>
              <div className="login-center-buttons">
                <button type="button">Log In</button>
                <button type="button">
                  <img src={gimg} alt="" />
                  Log In with Google
                </button>
              </div>
          </form>
          </div>
          <p className="login-bottom-p">
            Don't have an account? <a href="./signup.jsx" onClick={<SignUp/>}>Sign Up</a>
          </p>
        </div>
      </div>

    </div>    

);
};
