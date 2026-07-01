import React from "react";
import { Zap } from "lucide-react";
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="navdiv">
      <Zap id="logo" size={24} color="#a3e635" fill="#a3e635" />
      <h2>AutoFlow</h2>
      <div className="headerelmts">
        <ul className="nav-ul">
          <li className="nav-ul-li">
            <a href="/">Home</a>
          </li>
          <li className="nav-ul-li">
            <a href="#features">Features</a>
          </li>
          <li className="nav-ul-li">
            <a href="#pricing">Pricing</a>
          </li>
        </ul>

        <button onClick={() => navigate('/signup')} className="btn-primary">Login</button>
      </div>
    </div>
  );
};

export default Navbar;
