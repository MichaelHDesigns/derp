import React from 'react';
import { useNavigate } from 'react-router-dom';

const Games = () => {
  const navigate = useNavigate();

  const navigateToGame = (path) => {
    navigate(path);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', marginTop: '20%' }}>
      <h1>Welcome to Games</h1>
      <p>Select a game to play:</p>

      {/* Game Links */}
      <div style={{ position: 'relative' }}>
        <button
          style={{
            position: 'absolute',
            left: '15%',
            margin: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
          onClick={() => navigateToGame('/games/pong')}
        >
          Pong
        </button>
        <button
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            margin: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
          onClick={() => navigateToGame('/games/breakout')}
        >
          Breakout
        </button>
        <button
          style={{
            position: 'absolute',
            left: '85%',
            transform: 'translateX(-50%)',
            margin: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
          onClick={() => navigateToGame('/games/snake')}
        >
          Snake
        </button>
      </div>
    </div>
  );
};

export default Games;