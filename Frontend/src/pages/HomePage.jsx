import "../App.css";
import "../styles/HomePage.css";

import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";

import Blob from "../assets/svg/home-svgs/blob.svg";
import BlobOutline from "../assets/svg/home-svgs/blob-outline.svg";
import HistorySvg from "../assets/svg/home-svgs/history-button.svg";
import { AuthContext } from "../contexts/AuthContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HistoryComponent from "./HistoryPage";
import ModelComponent from "../components/ModelComponent";

import ScrollToTop from "../components/ScrollToTop";
import CardSlide from "../utils/cardAnimateSlide";
import CardFade from "../utils/cardAnimateFade";

const server_url = import.meta.env.VITE_SERVER_URL || 'http://localhost:5173';

export default function HomeComponent() {
  
  const [historyTab, setHistoryTab] = useState(false);
  const [codeInput, setCodeInput] = useState("");

  const historyRef = useRef(null);

  const router = useNavigate();
  const { handleGetHistory } = useContext(AuthContext);

  const handleChange = (e) => {
    setCodeInput(e.target.value);
  };

  const handleClick = () => {

    if (codeInput.startsWith("http")) {

      let url = new URL(codeInput);
      let pathname = url.pathname;
      router(`/${pathname}`);

    } else {
      router(`/${codeInput}`);
    }
  };

  useEffect(() => {
    handleGetHistory()
      .then((res) => (historyRef.current = res))
      .catch((e) => console.log(e));
  }, []);

  return (
    <>
      <main className="landing-wrapper">
        <ScrollToTop />
        <Navbar />

        <section className="home-main-container">
          <CardSlide>
            <div>
              <h1>Enter the meeting code:</h1>

              <div className="meet-code">
                <input
                  type="text"
                  placeholder="Enter Meeting URL"
                  value={codeInput}
                  onChange={handleChange}
                />
                <button onClick={handleClick}> Join Meeting </button>
              </div>
            </div>
          </CardSlide>

          <CardFade>
            <div className="model-container">
              <img src={Blob} className="blob" />
              <img src={BlobOutline} className="blob-outline" />
              <ModelComponent />
            </div>
          </CardFade>
        </section>
        <div className="history-div" onClick={() => setHistoryTab(!historyTab)}>
          <img src={HistorySvg} className="history-btn" />
          History
        </div>

        {historyTab ? (
          <HistoryComponent
            historyTab={historyTab}
            setHistoryTab={setHistoryTab}
            data={historyRef.current}
          />
        ) : null}

        <Footer />
      </main>
    </>
  );
}
