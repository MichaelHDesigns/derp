import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  background-color: var(--nav-background-color);
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 200px;
  color: var(--text-color);
  font-weight: bold;

  /* Make the side nav stack on smaller screens */
  @media (max-width: 768px) {
    position: fixed;
    width: 100%;
    height: auto;
    top: 0;
    left: 0;
    padding: 10px;
    z-index: 999;
    background-color: var(--nav-background-color);
  }
`;

const StyledLink = styled(NavLink)`
  color: var(--text-color);
  text-decoration: none;
  margin: 10px 0;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 18px;
  display: block;
  transition: all 0.3s ease;

  &.active {
    background-color: #333333;
    box-shadow: inset 6px 6px 12px rgba(0, 0, 0, 0.3), inset -6px -6px 12px rgba(255, 255, 255, 0.2);
    color: #a0f72e;
  }

  &:hover {
    color: #a0f72e;
    box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.2), inset -4px -4px 8px rgba(255, 255, 255, 0.3);
  }
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 40px;
  color: #a0f72e;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const ToggleButton = styled.button`
  margin-top: 20px;
  padding: 10px;
  background-color: #a0f72e;
  color: black;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #8bc34a;
  }
`;

const SideNav = ({ toggleTheme, isDarkMode }) => {
  return (
    <Nav>
      <Logo>DerpFi™</Logo>
      <StyledLink to="/" end>
        Home
      </StyledLink>
      <StyledLink to="/dashboard">
        Dashboard
      </StyledLink>
      <StyledLink to="/games">
        Games
      </StyledLink>
      <ToggleButton onClick={toggleTheme}>
        {isDarkMode ? "Light Mode" : "Dark Mode"}
      </ToggleButton>
    </Nav>
  );
};

export default SideNav;