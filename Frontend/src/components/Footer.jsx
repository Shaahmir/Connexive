import Logo from "../assets/svg/logo.svg";
import '../styles/Footer.css'

export default function Footer() {

  return (

    <footer className="foot">

      <div className="main-content">

        <div>
          <span>
            <h3>
              <img src={Logo} /> Connexive
            </h3>
          </span>

          <span>
            <p>
              Made with dedication and devotion
            </p>
            <h4>- Shahmir</h4>
          </span>
        </div>

        <ul>
          <li>Pages</li>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Portfolio</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="#">FAQ</a></li>
        </ul>

        <ul>
          <li>Social</li>
          <li><a href="#">Twitter (X) </a></li>
          <li><a href="#">Instagram</a></li>
          <li><a href="#">Youtube</a></li>
          <li><a href="#">Github</a></li>
        </ul>

        <div className="subscribe-form">
          <label htmlFor="sub-inp">&nbsp; &nbsp; Subscribe Form</label>
          <div>
            <input type="email" placeholder="abc@gmail.com" id="sub-inp" />
            <button type="submit">Subscribe Us</button>
          </div>
        </div>
      </div>

      <div className="side-content">
      
        <div>&copy; 2026 Muhammad Shahmir</div>

        <div>
          <span>Terms & Conditions</span>
          <span>Privacy Policy</span>
        </div>

      </div>

    </footer>
  );
}
