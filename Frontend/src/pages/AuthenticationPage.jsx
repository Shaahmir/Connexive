import { useState, useContext, act } from "react";

import "../styles/AuthenticationPage.css";
import DefaultProfile from '../assets/svg/auth-svgs/default-profile.svg'
import Background from '../assets/svg/auth-svgs/auth-bg.svg'
import Snackbar from "@mui/material/Snackbar";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { AuthContext } from "../contexts/AuthContext";

export default function Authentication() {
  
  const [name, setName] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const [formState, setFormState] = useState(0);

  const [error, setError] = useState("");
  const [message, setMessage] = useState();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { handleLogin, handleRegister } = useContext(AuthContext);

  const handleAuth = async (e) => {
  
    e.preventDefault();

    try {

      if (formState == 0) {

        let result = await handleLogin(username, password);
        setMessage(result.data.message);
        setOpenSnackbar(true);

      } else if (formState == 1) {

        let result = await handleRegister(name, username, password);
        setMessage(result.data.message);
        setOpenSnackbar(true);
        setFormState(0);
      }

    } catch (e) {
      setError(e.response.data.message);
      setPassword("");
    }
  };

  return (
    <main className="landing-wrapper">

      <Navbar />

      <section className="auth-container">
        <div className = "auth-wrap-div">
        <img src={Background} className="auth-bg"/>
        <img src={DefaultProfile} className="default-profile" />
          <form>
            <div className="group-btns">
              <button
                type="button"
                onClick={() => {
                  setFormState(0);
                  setError("");
                }}
                style={
                  formState == 1
                    ? {
                        background: "rgba(153, 0, 255, 0.078)",
                        border: "1px solid #741dff5d",
                      }
                    : {
                        background:
                          "linear-gradient(to bottom, #8352fe 0%, #240058 100%)",
                      }
                }
              >
                Sign in
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormState(1);
                  setError("");
                }}
                style={
                  formState == 0
                    ? {
                        background: "rgba(153, 0, 255, 0.078)",
                        border: "1px solid #741dff5d",
                      }
                    : {
                        background:
                          "linear-gradient(to bottom, #8352fe 0%, #240058 100%)",
                      }
                }
              >
                Sign up
              </button>
            </div>

            <h1>Welcome{formState ==  0 ? " Back" : ""} !</h1>
            <p>{formState ==  0 ? " Sign in to pick up where you left off." : "Sign up to get started with Connexive."}</p>

            <div className="form-inp">
              {formState == 1 ? (
                <span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    autoFocus
                    required
                    placeholder=" "
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label htmlFor="name">Full Name:</label>
                </span>
              ) : (
                <></>
              )}

              <span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  autoFocus
                  required
                  placeholder=" "
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="username">Username:</label>
              </span>

              <span>
                <input
                  name="password"
                  value={password}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  required
                  placeholder=" "
                />
                <label htmlFor="password">Password:</label>
              </span>
            </div>
            {error ? (
              <p
                style={{
                  color: "#ff2a2a",
                  position: "absolute",
                  transform: "Translate(1rem, 1rem)",
                }}
              >
                {error}
              </p>
            ) : null}
            <p className="forget-pass">Forget Password</p>

            <button type="submit" onClick={handleAuth} className="auth-btn">
              {formState == 0 ? "Sign in" : "Sign up"}
            </button>
          </form>
        </div>
      </section>

      <Snackbar
        style={{ width: "25%" }}
        open={openSnackbar}
        message={message}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      />
      <Footer />
    </main>
  );
}
