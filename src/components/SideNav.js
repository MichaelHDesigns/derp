import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  background-color: #1c1c1c;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  /* Make the side nav stack on smaller screens */
  @media (max-width: 768px) {
    position: fixed;
    width: 100%;
    height: auto;
    top: 0;
    left: 0;
    padding: 10px;
    z-index: 999;
    background-color: #1c1c1c;
  }
`;

const StyledLink = styled(NavLink)`
  color: white;
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
    color: #1abc9c;
  }

  &:hover {
    color: #1abc9c;
    box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.2), inset -4px -4px 8px rgba(255, 255, 255, 0.3);
  }
`;

const SideNav = () => {
  return (
    <Nav>
      <StyledLink to="/" end>
        Dashboard
      </StyledLink>
      <StyledLink to="/rewards">
        Rewards
      </StyledLink>
      <StyledLink to="/games">
        Games
      </StyledLink>
    </Nav>
  );
};

export default SideNav;