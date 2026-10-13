import "../styles/Navbar.css";
import Logo from "../assets/svg/logo.svg";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {v4 as uuidv4} from "uuid";
import { useState } from "react";

export default function Navbar() {

  const router = useNavigate();
  const roomID = uuidv4();
  const location = useLocation();
  const isRoom = location.pathname !== "/" && location.pathname !== "/join" && location.pathname !== "/auth";

  const [isOpen, setIsOpen] = useState(false);

  return (
    <header>
    <nav className="nav">
      <div className={`nav-content ${isOpen ? "menu-open" : ""}`}>
        <h3>
          <img src={Logo} /> Connexive
        </h3>

        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/${roomID}`}
              className={(isRoom ? "active" : "")}
              onClick={() => setIsOpen(false)}
            >
              Create a Room
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/join"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setIsOpen(false)}
            >
              Join a Room
            </NavLink>
          </li>
        </ul>

        <span>
          <button onClick={() => {router("/auth"); setIsOpen(false)}} >Sign in</button>
          <button onClick={() => {router("/auth"); setIsOpen(false)}}>Sign up</button>
        </span>

        <label class="hamburger">
            <input type="checkbox" class="hb" checked = {isOpen} onClick={() => setIsOpen(!isOpen)}/>
            <svg viewBox="0 0 32 32">
              <path class="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
              <path class="line" d="M7 16 27 16"></path>
            </svg>
        </label>

      </div>
    </nav>
    </header>
  );
}
