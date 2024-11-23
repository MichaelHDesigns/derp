import React, { useRef, useEffect, useState } from 'react';

const BreakoutGame = () => {
  const canvasRef = useRef(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const paddleWidth = 100;
  const paddleHeight = 10;
  const ballRadius = 10;
  const brickRowCount = 5;
  const brickColumnCount = 8;
  const brickWidth = 75;
  const brickHeight = 20;
  const brickPadding = 10;

  let paddleX = 0;
  let ballX = 0;
  let ballY = 0;
  let ballVelocityX = 4;
  let ballVelocityY = -4;
  let bricks = [];

  const resetGame = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      paddleX = (canvas.width - paddleWidth) / 2;
      ballX = canvas.width / 2;
      ballY = canvas.height - 30;
      ballVelocityX = 4;
      ballVelocityY = -4;

      bricks = [];
      for (let row = 0; row < brickRowCount; row++) {
        bricks[row] = [];
        for (let col = 0; col < brickColumnCount; col++) {
          bricks[row][col] = { x: 0, y: 0, status: 1 };
        }
      }
    }
  };

  const drawBricks = (ctx) => {
    bricks.forEach((row, rowIndex) => {
      row.forEach((brick, colIndex) => {
        if (brick.status === 1) {
          const brickX = colIndex * (brickWidth + brickPadding);
          const brickY = rowIndex * (brickHeight + brickPadding);
          brick.x = brickX;
          brick.y = brickY;

          ctx.fillStyle = '#0095DD';
          ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
        }
      });
    });
  };

  const drawBall = (ctx) => {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
  };

  const drawPaddle = (ctx, canvas) => {
    ctx.fillStyle = '#0095DD';
    ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  };

  const collisionDetection = () => {
    bricks.forEach((row) => {
      row.forEach((brick) => {
        if (brick.status === 1) {
          if (
            ballX > brick.x &&
            ballX < brick.x + brickWidth &&
            ballY > brick.y &&
            ballY < brick.y + brickHeight
          ) {
            ballVelocityY = -ballVelocityY;
            brick.status = 0;
          }
        }
      });
    });
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawBricks(ctx);
      drawBall(ctx);
      drawPaddle(ctx, canvas);

      collisionDetection();

      // Ball movement
      ballX += ballVelocityX;
      ballY += ballVelocityY;

      // Ball collision with walls
      if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballVelocityX = -ballVelocityX;
      }
      if (ballY - ballRadius < 0) {
        ballVelocityY = -ballVelocityY;
      }

      // Ball collision with paddle
      if (
        ballY + ballRadius > canvas.height - paddleHeight &&
        ballX > paddleX &&
        ballX < paddleX + paddleWidth
      ) {
        ballVelocityY = -ballVelocityY;
      }

      // Ball falls off screen
      if (ballY + ballRadius > canvas.height) {
        setGameOver(true);
        setGameRunning(false);
      }

      // Check if all bricks are destroyed
      const allBricksCleared = bricks.flat().every((brick) => brick.status === 0);
      if (allBricksCleared) {
        setGameOver(true);
        setGameRunning(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    const canvas = canvasRef.current;
    if (canvas) {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        paddleX = Math.max(paddleX - 20, 0);
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        paddleX = Math.min(paddleX + 20, canvas.width - paddleWidth);
      }
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      paddleX = Math.max(0, Math.min(mouseX - paddleWidth / 2, canvas.width - paddleWidth));
    }
  };

  useEffect(() => {
    resetGame();
    const interval = setInterval(() => {
      if (gameRunning) draw();
    }, 16);

    return () => clearInterval(interval);
  }, [gameRunning]);

  return (
    <div style={{ textAlign: 'center' }}>
      {gameOver && <h2>Game Over</h2>}
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        style={{ border: '1px solid black' }}
        onMouseMove={handleMouseMove}
        tabIndex="0"
        onKeyDown={handleKeyDown}
      />
      <div>
        <button onClick={() => setGameRunning(true)} disabled={gameRunning}>
          Start Game
        </button>
        <button onClick={() => setGameRunning(false)}>End Game</button>
        <button onClick={resetGame}>Reset</button>
      </div>
    </div>
  );
};

export default BreakoutGame;