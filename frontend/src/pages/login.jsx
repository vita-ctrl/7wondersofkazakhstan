import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const [active, setActive] = useState(false);

  return (
    <>
      <style>
        {`
          .login-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f700ffff; /* тёмный зеленовато-оливковый */
            font-family: 'Poppins', sans-serif;
          }

          .login-box {
            position: relative;
            width: 750px;
            height: 450px;
            border: 2px solid #424E2B; /* зелёный */
            box-shadow: 0 0 25px #ea00ffff;
            overflow: hidden;
            color: #E5D9C6; /* бежевый */
            background: #ffbb00ff;
          }

          .form-box {
            position: absolute;
            width: 50%;
            height: 100%;
            top: 0;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            transition: 0.7s ease;
          }

          .Login {
            left: 0;
          }

          .Register {
            right: 0;
            opacity: 0;
            transform: translateX(120%);
          }

          .login-box.active .Login {
            opacity: 0;
            transform: translateX(-120%);
          }

          .login-box.active .Register {
            opacity: 1;
            transform: translateX(0%);
          }

          .form-box h2 {
            text-align: center;
            margin-bottom: 20px;
            font-size: 30px;
            color: #E5D9C6;
          }

          .input-box {
            position: relative;
            margin-top: 25px;
          }

          .input-box input {
            width: 100%;
            background: transparent;
            border: none;
            border-bottom: 2px solid #E5D9C6;
            padding: 10px 25px 10px 0;
            font-size: 16px;
            color: #E5D9C6;
            outline: none;
          }

          .input-box label {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            transition: 0.4s;
            color: #bfb6a6;
          }

          .input-box input:focus + label,
          .input-box input:not(:placeholder-shown) + label {
            top: -10px;
            font-size: 12px;
            color: #ff00c8ff;
          }

          .icon {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            font-size: 17px;
            color: #E5D9C6;
          }

          .input-box input:focus ~ .icon {
            color: #ea00ffff;
          }

          .btn {
            margin-top: 30px;
            width: 100%;
            padding: 10px;
            border-radius: 40px;
            background: transparent;
            border: 2px solid #ff00ffff;
            color: #E5D9C6;
            font-weight: bold;
            cursor: pointer;
            transition: 0.3s;
          }

          .btn:hover {
            background: #ea00ffff;
            color: #E5D9C6;
          }

          .form-box p {
            margin-top: 15px;
            text-align: center;
            color: #E5D9C6;
          }

          .form-box a {
            color: #ff00f2ff;
            font-weight: bold;
            cursor: pointer;
          }

          /* Background gradient shapes */
          .shape1 {
            position: absolute;
            width: 850px;
            height: 600px;
            background: linear-gradient(45deg, #00e1ffff, #424E2B);
            top: -5px;
            right: 0;
            transform: rotate(10deg) skewY(40deg);
            transform-origin: bottom right;
            transition: 1.5s;
          }

          .shape2 {
            position: absolute;
            width: 850px;
            height: 700px;
            top: 100%;
            left: 250px;
            background: #1e2118;
            border-top: 3px solid #424E2B;
            transform-origin: bottom left;
            transition: 1.5s;
          }

          .login-box.active .shape1 {
            transform: rotate(0) skewY(0);
          }

          .login-box.active .shape2 {
            transform: rotate(-11deg) skewY(-41deg);
          }
        `}
      </style>

      <div className="login-wrapper">
        <div className={`login-box ${active ? "active" : ""}`}>
          <div className="shape1"></div>
          <div className="shape2"></div>

          {/* LOGIN */}
          <div className="form-box Login">
            <h2>Login</h2>

            <div className="input-box">
              <input type="text" required placeholder=" " />
              <label>Username</label>
              <FontAwesomeIcon icon={faUser} className="icon" />
            </div>

            <div className="input-box">
              <input type="password" required placeholder=" " />
              <label>Password</label>
              <FontAwesomeIcon icon={faLock} className="icon" />
            </div>

            <button className="btn">Login</button>

            <p>
              Don't have an account?{" "}
              <a onClick={() => setActive(true)}>Sign Up</a>
            </p>
          </div>

          {/* REGISTER */}
          <div className="form-box Register">
            <h2>Register</h2>

            <div className="input-box">
              <input type="text" required placeholder=" " />
              <label>Username</label>
              <FontAwesomeIcon icon={faUser} className="icon" />
            </div>

            <div className="input-box">
              <input type="email" required placeholder=" " />
              <label>Email</label>
              <FontAwesomeIcon icon={faEnvelope} className="icon" />
            </div>

            <div className="input-box">
              <input type="password" required placeholder=" " />
              <label>Password</label>
              <FontAwesomeIcon icon={faLock} className="icon" />
            </div>

            <button className="btn">Register</button>

            <p>
              Already have an account?{" "}
              <a onClick={() => setActive(false)}>Sign In</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
