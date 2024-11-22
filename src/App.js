import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Top from "./components/Top"; // Import Top component
import Dashboard from "./components/Dashboard";
import SideNav from "./components/SideNav";
import Pong from "./games/pong/Pong"; // Correct import path for Pong component
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: var(--background-color);
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
  }
`;

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Main = styled.div`
  flex: 1;
  padding: 20px;
  overflow: auto;
  margin-top: 50px;  // Add margin here to move content down
`;

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  
    document.documentElement.style.setProperty(
      '--background-color',
      isDarkMode ? '#b3b1b1' : '#2b2b2b'
    );
    document.documentElement.style.setProperty(
      '--text-color',
      isDarkMode ? '#000000' : '#ffffff'
    );
    document.documentElement.style.setProperty(
      '--card-background-color',
      isDarkMode ? '#ffffff' : '#333333'
    );
    document.documentElement.style.setProperty(
      '--grid-line-color',
      isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)' // Add dynamic gridline
    );
  
    if (isDarkMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  };

  return (
    <Router>
      <GlobalStyle />
      <Layout>
        <SideNav toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <Main>
          {/* Place the Top component here */}
          <Top toggleTheme={toggleTheme} isDarkMode={isDarkMode} />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/games" element={<Pong />} /> {/* Added route for Pong game */}
          </Routes>
        </Main>
      </Layout>
    </Router>
  );
};

export default App;