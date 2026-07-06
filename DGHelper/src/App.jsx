import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import './App.css'

import Home from "./pages/Home";
import About from "./pages/About";
import Discs from "./pages/Discs";
import YourBag from "./pages/YourBag";
import Courses from "./pages/Courses";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { useAuth } from "./context/AuthContext";

const titleMap = {
  "/": { title: "Discgolf Assistant", subtitle: "Welcome to the Discgolf Assistant!" },
  "/about": { title: "About Us", subtitle: "Learn more about us!" },
  "/discs": { title: "Discs", subtitle: "Find the perfect disc for your game" },
  "/your-bag": { title: "Your Bag", subtitle: "Manage your disc collection and bags" },
  "/courses": { title: "Courses", subtitle: "Explore nearby courses" },
  "/login": { title: "Log in", subtitle: "Save your bag to your account" },
};


function TitleText() {
  const location = useLocation();
  const { title, subtitle } =
    titleMap[location.pathname] || { title: "Discgolf Assistant", subtitle: "" };

  return (
    <div className="TitleText">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

function Navigation({ onOpenLogin }) {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="navigation">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/discs">Discs</Link></li>
        <li><Link to="/your-bag">Your Bag</Link></li>
        <li><Link to="/courses">Courses</Link></li>
        {isAuthenticated && (
          <li><Link to="/profile">Profile</Link></li>
        )}
      </ul>

      <ul className="nav-auth">
        {!isAuthenticated && (
         <button
           type="button"
           className="nav-login-btn"
           onClick={onOpenLogin}
         >
           Log in
         </button>
        )}

        {isAuthenticated ? (
          <li className="nav-auth">
            <span className="nav-user">{user.email}</span>

            <button type="button"
             className="nav-logout"
              onClick={logout}>
              Log out
            </button>
          </li>
        ) : (
          null
        )}
      </ul>
    </nav>
  );
}

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <Router>

      <TitleText />

      <Navigation onOpenLogin={() => setShowLogin(true)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/discs" element={<Discs />} />
        <Route path="/your-bag" element={<YourBag />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      {showLogin && (
        <Login onClose={() => setShowLogin(false)} />
      )}

    </Router>
  );
}

export default App;