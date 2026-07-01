import React from "react";
import Navbar from "./components/Navbar";
import Landingpage from "./components/Landingpage";
import Dashboard from "./pages/Dashboard";
import Automations from "./pages/Automations";
import Workflows from "./pages/Workflows";
import Activity from "./pages/Activity";
import Settings from "./pages/Settings";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landingpage />}></Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/automations" element={<Automations />} />
        <Route path="/workflows" element={<Workflows />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
};

export default App;
