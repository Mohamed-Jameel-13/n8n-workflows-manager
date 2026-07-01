import React from "react";
import Navbar from "./Navbar";
import heroImg from "../assets/hero.png";
import { Zap } from "lucide-react";

import {
  faBarChart,
  faBars,
  faBoltLightning,
  faGlobe,
  faCode,
  faListUl,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Landingpage = () => {
  return (
    <div className="landing-bg">
      <Navbar />

      <div className="hero">
        <h1 id="hero-title">
          Automate your <br />
          workflows <br /> without the headache
        </h1>
        <h3>
          Connect n8n, WhatsApp, and cron jobs. Trigger,
          <br /> monitor, and debug from one unified dashboard.
        </h3>
        <div className="hero-btns">
          <button className="btn-primary" onClick={Navigate('/')}>Start for free</button>
          <button className="btn-secondary">View Dashboard</button>
        </div>
        <img src={heroImg} alt="heroImg" />
        <section id="features">
          <h1 id="feature-title">Everything you need</h1>
          <h3 id="hero-para">
            From one-off scripts to complex multi-step <br />
            workflows.
          </h3>
          <div className="feature-cards">
            <div className="cards">
              <FontAwesomeIcon
                icon={faGlobe}
                size="2xl"
                className="custom-globe-icon"
              />
              <h2>Unified Dashboard</h2>
              <h3>
                Monitor all your automations — n8n, WhatsApp, cron — from a
                single control panel. No tab switching.
              </h3>
            </div>
            <div className="cards">
              <FontAwesomeIcon
                icon={faBoltLightning}
                size="2xl"
                className="custom-globe-icon"
              />
              <h2>One-Click Runs </h2>
              <h3>
                Trigger any workflow instantly. Schedule, test, and run
                automations without touching a terminal.
              </h3>
            </div>
            <div className="cards">
              <FontAwesomeIcon
                icon={faListUl}
                size="2xl"
                className="custom-globe-icon"
              />
              <h2>Deep Logs</h2>
              <h3>
                Full execution history with timestamps, status codes, brand
                error traces for every automation run.
              </h3>
            </div>
            <div className="cards">
              <FontAwesomeIcon
                icon={faCode}
                size="2xl"
                className="custom-globe-icon"
              />
              <h2>API-First</h2>
              <h3>
                Every action is available via REST API. Integrate AutoFlow into
                your existing toolchain in minutes.
              </h3>
            </div>
          </div>
          <h1 id="threesteps-title">Three easy steps</h1>
          <div className="steps-wrapper">
            <div className="threesteps">
              <div className="card-2">
                <h1 id="number">01</h1>
                <h1>Connect</h1>
                <p>
                  Link your automation tools. n8n, WhatsApp Business, or custom
                  cron jobs.
                </p>
              </div>
              <div className="card-2">
                <h1 id="number">02</h1>
                <h1>Configure</h1>
                <p>
                  Set triggers, schedules, and conditions from a clean visual
                  interface.
                </p>
              </div>
              <div className="card-2">
                <h1 id="number">03</h1>
                <h1>Control</h1>
                <p id="third-step">
                  Monitor, debug, and optimize — all from your dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="pricing">
          <div className="pricing-title">
            <h1>Transparent pricing</h1>
            <p>No surprises. Cancel anytime.</p>
          </div>
          <div className="price-card">
            <div className="card">
              <h2 id="plan1">STARTER</h2>
              <div className="price-container">
                <h1 id="price">$0</h1>
                <span>/month</span>
              </div>

              <p id="pricefor">For individuals and small projects.</p>
              <p>
                <FontAwesomeIcon
                  icon={faCheck}
                  size="l"
                  className="custom-globe-icon"
                />
                Up to 5 automations
              </p>
              <p>
                <FontAwesomeIcon
                  icon={faCheck}
                  size="l"
                  className="custom-globe-icon"
                />
                1,000 runs/month
              </p>
              <p>
                <FontAwesomeIcon
                  icon={faCheck}
                  size="l"
                  className="custom-globe-icon"
                />
                Community support
              </p>
              <p>
                <FontAwesomeIcon
                  icon={faCheck}
                  size="l"
                  className="custom-globe-icon"
                />
                Basic logs
              </p>

              <button id="pricebtn1" className="btn-secondary">
                Get started
              </button>
            </div>
            <div className="card">
              <div className="plan-container">
                <h2 id="plan2">PRO</h2>
                <span id="popplan">Most Popular</span>
              </div>
              <div className="price-container">
                <h1 id="price">$29</h1>
                <span>/month</span>
              </div>
              <p id="pricefor"> For teams running production automations.</p>
              <p>
                <FontAwesomeIcon
                  icon={faCheck}
                  size="l"
                  className="custom-globe-icon"
                />
                Unlimited automations
              </p>
              <p>
                <FontAwesomeIcon
                  icon={faCheck}
                  size="l"
                  className="custom-globe-icon"
                />
                100k runs/month
              </p>
              <p>
                <FontAwesomeIcon
                  icon={faCheck}
                  size="l"
                  className="custom-globe-icon"
                />
                Priority support
              </p>
              <p>
                <FontAwesomeIcon
                  icon={faCheck}
                  size="l"
                  className="custom-globe-icon"
                />
                Deep logs
              </p>
              <p>
                <FontAwesomeIcon
                  icon={faCheck}
                  size="l"
                  className="custom-globe-icon"
                />
                API access
              </p>

              <button id="pricebtn2" className="btn-primary">
                Get started
              </button>
            </div>
          </div>
        </section>
        <footer>
          <div className="logo-footer">
            <Zap  id="footer-logo" size={24} color="#a3e635" fill="#a3e635" />
            <h2>AutoFlow</h2>
          </div>
          <div className="legal">
            <p >© 2026 AutoFlow. All rights reserved.</p>
            <a href="#">
              <FontAwesomeIcon icon={faGithub} size="2xl" />
            </a>
            <a id="x" href="#">
              <FontAwesomeIcon icon={faXTwitter} size="2xl" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landingpage;
