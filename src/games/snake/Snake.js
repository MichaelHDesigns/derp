import React from 'react';
import SnakeGame from './SnakeGame';
import { useNavigate } from 'react-router-dom';

const Snake = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '20px', marginTop: '15%' }}>
      <h1>Snake Game</h1>
      <div>
        <button
          style={{
            margin: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            position: 'absolute',
            right: '20px',
            top: '15px',
          }}
          onClick={() => navigate('/games')}
        >
          Back to Games
        </button>
      </div>
      <SnakeGame />
    </div>
  );
};

export default Snake;