import React, { useState } from 'react';
import PongGame from './PongGame';

const Pong = () => {
  const [gameState, setGameState] = useState('start'); // Can be 'start' or 'playing'
  const [gameResult, setGameResult] = useState(''); // To show the result when the game ends

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
    <div style={{ textAlign: 'center', marginTop: '25%' }}>
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
  );
};

export default Pong;