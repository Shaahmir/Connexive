import "../App.css";
import "../styles/LandingPage.css";

import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TagButton from "../components/TagButton";
import Descriptions from "../components/Descriptions";
import CardsComponent from "../components/CardsComponent";

import AboutSvg from "../assets/svg/landing-svgs/about.svg";

import CardSlide from "../utils/cardAnimateSlide";
import CardFade from "../utils/cardAnimateFade";
import ScrollToTop from "../components/ScrollToTop";

import {v4 as uuidv4} from "uuid";

export default function LandingPage() {
  const images = [
    "/images/clips.png",
    "/images/virtual-agent.png",
    "/images/webinar.png",
    "/images/zoom-rooms.webp",
  ];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.4;
    }
  }, []);

  const dupImages = [...images, ...images];
  const router = useNavigate();
  const videoRef = useRef(null);

  return (
    <main className="landing-wrapper">

      <ScrollToTop />
      <Navbar />

      <section className="main-container">
      
        {/* Section 1 */}

        <section className="section-1">
          <CardSlide>
            <h1>
              Zero Latency Connectivity <br />
              Real-Time Communication.
            </h1>
          </CardSlide>
          <CardSlide>
            <p>
              A cloud-based video conferencing app that enables <br />
              seamless virtual meetings, webinars, and team collaboration.
            </p>
          </CardSlide>
          <CardSlide>
            <button onClick={() => router(`/${uuidv4()}`)}>Join Us Now</button>
            <button onClick={() => (window.location.href = "#section-3")}>
              What is Connexive?
            </button>
          </CardSlide>
        </section>

        {/* Section 2 */}

        <section className="section-2">
          <div className="about-us">
            <TagButton Description={"About Us"} Svg={AboutSvg} />

            <CardFade>
              <h1>
                <b>Stop gatekeeping great ideas behind </b> glitchy <br />
                screens. Connexive is the seamless video experience <br /> that
                actually understands the assignment, making <br /> every meeting
                a high-key win.
              </h1>
            </CardFade>
            <CardFade>
              <button onClick={() => (window.location.href = "#sub-inp")}>
                Connect With Us
              </button>
            </CardFade>
          </div>
        </section>

        {/* Section 3 */}

        <section className="section-3" id="section-3">
          <TagButton Description={"Features"} Svg={AboutSvg} />

          <aside className="landing-cards">
            <CardsComponent />
          </aside>
        </section>


        {/* Section 4 */}

        <CardFade>
          <section className="section-4">
            <Descriptions />
          </section>
        </CardFade>

        {/* Section 5 - Slider */}

        <TagButton Description={"More About Us"} Svg={AboutSvg} />

        <section className="slider">
          <div className="slider-track">
            {dupImages.map((el, idx) => (
              <div key={idx}>
                <CardFade>
                  <img src={el} loading="lazy" />
                </CardFade>
              </div>
            ))}
          </div>
        </section>
      </section>
      <CardFade>
        <Footer />
      </CardFade>
    </main>
  );
}
