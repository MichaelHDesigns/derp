import React from 'react';
import BreakoutGame from './BreakoutGame';
import { useNavigate } from 'react-router-dom';

const Breakout = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '20px', marginTop: '15%' }}>
      {/* Header container */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h1 style={{ margin: '0', flex: '1', textAlign: 'left' }}>Breakout</h1>
        <button
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/games')}
        >
          Games
        </button>
      </div>
      <BreakoutGame />
    </div>
  );
};

export default Breakout;