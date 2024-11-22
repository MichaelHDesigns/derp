import React, { useRef, useState, useEffect } from 'react';

const PongGame = ({ onGameOver, onPlayAgain, onEndGame }) => {
  const canvasRef = useRef(null);
  const paddleHeight = 100;
  const paddleWidth = 10;
  const ballRadius = 10;
  const paddleSpeed = 5;
  const ballSpeed = 3;

  const [playerScore, setPlayerScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false); // To track if the match has started
  const [gameOver, setGameOver] = useState(false); // Track if the game is over

  let ballX = 50;
  let ballY = 50;
  let ballVelocityX = ballSpeed;
  let ballVelocityY = ballSpeed;

  let playerPaddleY = 150;
  let cpuPaddleY = 150;

  const movePlayerPaddle = (e) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const paddleBounds = canvas.getBoundingClientRect();
      const mouseY = e.clientY - paddleBounds.top - paddleHeight / 2;
      playerPaddleY = Math.max(0, Math.min(mouseY, canvas.height - paddleHeight));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'a' || e.key === 'ArrowUp') {
      playerPaddleY = Math.max(0, playerPaddleY - paddleSpeed); // Move paddle up
    }
    if (e.key === 'd' || e.key === 'ArrowDown') {
      playerPaddleY = Math.min(canvasRef.current.height - paddleHeight, playerPaddleY + paddleSpeed); // Move paddle down
    }
  };

  const moveCpuPaddle = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Adding randomness to CPU's paddle movement
      const targetY = ballY - paddleHeight / 2;
      const randomOffset = Math.random() * 4 - 2; // Random factor to simulate imperfect CPU
      cpuPaddleY = Math.max(0, Math.min(targetY + randomOffset, canvas.height - paddleHeight));
    }
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Ball movement
      ballX += ballVelocityX;
      ballY += ballVelocityY;

      // Ball collision with top and bottom walls
      if (ballY - ballRadius <= 0 || ballY + ballRadius >= canvas.height) {
        ballVelocityY = -ballVelocityY;
      }

      // Ball collision with player paddle
      if (
        ballX - ballRadius <= paddleWidth &&
        ballY >= playerPaddleY &&
        ballY <= playerPaddleY + paddleHeight
      ) {
        ballVelocityX = -ballVelocityX;
      }

      // Ball collision with CPU paddle
      if (
        ballX + ballRadius >= canvas.width - paddleWidth &&
        ballY >= cpuPaddleY &&
        ballY <= cpuPaddleY + paddleHeight
      ) {
        ballVelocityX = -ballVelocityX;
      }

      // Ball reset if it goes past paddles
      if (ballX - ballRadius <= 0) {
        setCpuScore((prevScore) => prevScore + 1);
        resetBall();
      }

      if (ballX + ballRadius >= canvas.width) {
        setPlayerScore((prevScore) => prevScore + 1);
        resetBall();
      }

      // Draw ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#0095DD';
      ctx.fill();
      ctx.closePath();

      // Draw player paddle
      ctx.beginPath();
      ctx.rect(0, playerPaddleY, paddleWidth, paddleHeight);
      ctx.fillStyle = '#0095DD';
      ctx.fill();
      ctx.closePath();

      // Draw CPU paddle
      ctx.beginPath();
      ctx.rect(canvas.width - paddleWidth, cpuPaddleY, paddleWidth, paddleHeight);
      ctx.fillStyle = '#0095DD';
      ctx.fill();
      ctx.closePath();

      // Request next animation frame
      moveCpuPaddle();
      requestAnimationFrame(gameLoop);
    }
  };

  const resetBall = () => {
    ballX = canvasRef.current.width / 2;
    ballY = canvasRef.current.height / 2;
    ballVelocityX = -ballVelocityX; // Change direction of the ball
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 480;
      canvas.height = 320;

      const handleMouseMove = (e) => movePlayerPaddle(e);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('keydown', handleKeyDown);

      // Do not start the game until "Start!" button is clicked
      if (gameStarted) gameLoop(); // Start the game loop

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [gameStarted]);

  useEffect(() => {
    if (playerScore >= 5 || cpuScore >= 5) {
      // Game over condition: first to 5 points wins
      const winner = playerScore >= 5 ? 'You win!' : 'CPU wins!';
      setGameOver(true); // Game Over
      onGameOver(winner); // Notify parent component that the game is over
    }
  }, [playerScore, cpuScore, onGameOver]);

  const startGame = () => {
    setGameStarted(true); // Set gameStarted to true when the user clicks "Start"
    setGameOver(false); // Reset game over state
    setPlayerScore(0); // Reset player score
    setCpuScore(0); // Reset CPU score
  };

  const playAgain = () => {
    setGameOver(false); // Reset the game over state
    setPlayerScore(0); // Reset player score
    setCpuScore(0); // Reset CPU score
    setGameStarted(true); // Start a new game
    onPlayAgain(); // Notify the parent component to play again
  };

  const endGame = () => {
    setGameStarted(false); // Stop the game
    setGameOver(false); // Reset the game over state
    onEndGame(); // Notify the parent that the game ended
  };

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ border: '1px solid black' }} />
      {!gameStarted && !gameOver && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <button onClick={startGame}>Start!</button>
        </div>
      )}

      {gameOver && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <h2>Game Over!</h2>
          <h3>{playerScore >= 5 ? 'You win!' : 'CPU wins!'}</h3>
          <button onClick={playAgain}>Play Again</button>
          <button onClick={endGame}>End Game</button>
        </div>
      )}

      <div>
        <h3>Player: {playerScore} - CPU: {cpuScore}</h3>
      </div>
    </div>
  );
};

export default PongGame;