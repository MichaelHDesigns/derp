import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 240px;
  right: 0px;
  z-index: 1000;
`;


const Title = styled.div`
  font-size: 18px;
`;

const UserInfo = styled.div`
  position: absolute;  /* Absolute positioning within the video container */
  top: 50%;  /* Vertically center */
  left: 50%;  /* Horizontally center */
  transform: translate(-50%, -50%);  /* Adjust positioning for perfect centering */
  color: var(--text-color);  /* Ensure text is readable */
  font-size: 1.5em;  /* Adjust text size for visibility */
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);  /* Optional: add text shadow for readability */
`;

const VideoContainer = styled.div`
  width: 100%; /* Full width of the header */
  height: 25vh; /* 25% of the viewport height */
  position: relative;  /* This is important for absolute positioning of UserInfo */
  overflow: hidden;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures the video fills the container proportionally */
`;

const Top: React.FC = () => (
  <HeaderContainer>
    <VideoContainer>
      <StyledVideo autoPlay loop muted playsInline>
        <source src="/derpfi5.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </StyledVideo>
      <UserInfo>
        <div>Decentralized Earnings Resiliency Protocol</div>
      </UserInfo>
    </VideoContainer>
  </HeaderContainer>
);

export default Top;