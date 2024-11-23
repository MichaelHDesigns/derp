import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const SnakeGame = () => {
  const gridSize = 20;
  const initialSnake = [{ x: 5, y: 5 }];
  const initialFood = { x: 10, y: 10 };
  const initialDirection = "RIGHT";

  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [direction, setDirection] = useState(initialDirection);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);  // Track if game is active
  const navigate = useNavigate();

  const changeDirection = (newDirection) => {
    if (
      (direction === "UP" && newDirection !== "DOWN") ||
      (direction === "DOWN" && newDirection !== "UP") ||
      (direction === "LEFT" && newDirection !== "RIGHT") ||
      (direction === "RIGHT" && newDirection !== "LEFT")
    ) {
      setDirection(newDirection);
    }
  };

  const moveSnake = () => {
    if (gameOver || !isGameActive) return;

    const newHead = { ...snake[0] };

    switch (direction) {
      case "UP":
        newHead.y -= 1;
        break;
      case "DOWN":
        newHead.y += 1;
        break;
      case "LEFT":
        newHead.x -= 1;
        break;
      case "RIGHT":
        newHead.x += 1;
        break;
      default:
        break;
    }

    const newSnake = [newHead, ...snake.slice(0, snake.length - 1)];
    setSnake(newSnake);

    // Check if snake eats the food
    if (newHead.x === food.x && newHead.y === food.y) {
      setScore(score + 10);
      setFood({
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      });
      setSnake([newHead, ...snake]); // Grow the snake
    }

    // Check if snake collides with walls or itself
    if (
      newHead.x < 0 ||
      newHead.x >= gridSize ||
      newHead.y < 0 ||
      newHead.y >= gridSize ||
      snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
    ) {
      setGameOver(true);
    }
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowUp":
        changeDirection("UP");
        break;
      case "ArrowDown":
        changeDirection("DOWN");
        break;
      case "ArrowLeft":
        changeDirection("LEFT");
        break;
      case "ArrowRight":
        changeDirection("RIGHT");
        break;
      default:
        break;
    }
  };

  const startGame = () => {
    setSnake(initialSnake);
    setFood(initialFood);
    setDirection(initialDirection);
    setScore(0);
    setGameOver(false);
    setIsGameActive(true);
  };

  const stopGame = () => {
    setIsGameActive(false);
    setGameOver(true);
  };

  useEffect(() => {
    if (gameOver || !isGameActive) return;

    const gameInterval = setInterval(() => {
      moveSnake();
    }, 100); // Speed of the game (snake moves every 100 ms)

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(gameInterval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [snake, direction, gameOver, isGameActive]);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', height: '100vh', overflow: 'hidden' }}>
      {/* Game control buttons on the left */}
      <div style={{ display: 'flex', flexDirection: 'column', padding: '20px', alignItems: 'flex-start' }}>
        <button
          onClick={startGame}
          style={{
            marginBottom: '10px',
            padding: '6px 12px',  // Smaller padding for smaller buttons
            fontSize: '14px',     // Smaller font size
            width: '150px',       // Adjusted width
            height: '35px',       // Adjusted height
            cursor: 'pointer'
          }}
        >
          Start
        </button>
        <button
          onClick={stopGame}
          style={{
            marginBottom: '10px',
            padding: '6px 12px', 
            fontSize: '14px',     
            width: '150px',
            height: '35px',
            cursor: 'pointer'
          }}
        >
          Stop
        </button>
        <button
          onClick={() => navigate('/games')}
          style={{
            marginBottom: '10px',
            padding: '6px 12px', 
            fontSize: '14px',     
            width: '150px',
            height: '35px',
            cursor: 'pointer'
          }}
        >
          Games
        </button>
      </div>

      {/* Game Area and Score Container */}
      <div style={{ textAlign: 'center', padding: '1px', flexGrow: 1, marginRight: '20%' }}>
        {/* Score Display */}
        <h3>Score: {score}</h3>

        {/* Game Area */}
        <div
          style={{
            position: "relative",
            width: "400px",
            height: "400px",
            border: "2px solid black",
            margin: "auto",
          }}
        >
          {gameOver ? (
            <div style={{ textAlign: "center" }}>
              <h2>Game Over</h2>
              <p>Score: {score}</p>
            </div>
          ) : (
            <div
              style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%" }}
            >
              {snake.map((segment, index) => (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    left: `${segment.x * (400 / gridSize)}px`,
                    top: `${segment.y * (400 / gridSize)}px`,
                    width: `${400 / gridSize}px`,
                    height: `${400 / gridSize}px`,
                    backgroundColor: "green",
                  }}
                ></div>
              ))}
              <div
                style={{
                  position: "absolute",
                  left: `${food.x * (400 / gridSize)}px`,
                  top: `${food.y * (400 / gridSize)}px`,
                  width: `${400 / gridSize}px`,
                  height: `${400 / gridSize}px`,
                  backgroundColor: "red",
                }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;