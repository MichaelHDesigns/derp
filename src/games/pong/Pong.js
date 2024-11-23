import React, { useState } from 'react';
import PongGame from './PongGame';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const Pong = () => {
  const [gameState, setGameState] = useState('start'); // Can be 'start' or 'playing'
  const [gameResult, setGameResult] = useState(''); // To show the result when the game ends
  const navigate = useNavigate();  // Hook to navigate to other pages

  const startGame = () => {
    setGameState('playing'); // Start the game
    setGameResult(''); // Clear previous result
  };

  const onGameOver = (result) => {
    setGameResult(result); // Set the result when the game ends
    setGameState('end'); // Transition to end screen
  };

  const onPlayAgain = () => {
    setGameState('playing'); // Start a new game
    setGameResult(''); // Reset the result
  };

  const onEndGame = () => {
    setGameState('start'); // Go back to the start screen
    setGameResult(''); // Reset the result
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Game control buttons on the left */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        alignItems: 'flex-start',
        position: 'absolute', // Fixed to the left side
        top: '320px',
        left: '320px',
      }}>
        <button
          onClick={() => navigate('/games')}
          style={{
            marginBottom: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Games
        </button>
      </div>

      {/* Main Content */}
      <div style={{ textAlign: 'center', marginTop: '25%', flexGrow: 1 }}>
        <h1>Pong Game</h1>

        {gameState === 'start' && (
          <div>
            <button onClick={startGame}>Start Game</button>
          </div>
        )}

        {gameState === 'playing' && (
          <PongGame onGameOver={onGameOver} />
        )}

        {gameState === 'end' && (
          <div>
            {gameResult && <h2>{gameResult}</h2>}
            <button onClick={onPlayAgain}>Play Again</button>
            <button onClick={onEndGame}>End Game</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pong;