import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Rewards from "./components/Rewards";
import SideNav from "./components/SideNav";
import styled from "styled-components";

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;

  /* Stack layout for smaller screens */
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Main = styled.div`
  flex: 1;
  background: #2b2b2b;
  color: white;
  padding: 20px;
  overflow: auto;

  /* Adjust padding for smaller screens */
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const App = () => {
  return (
    <Router>
      <Layout>
        <SideNav />
        <Main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rewards" element={<Rewards />} />
          </Routes>
        </Main>
      </Layout>
    </Router>
  );
};

export default App;