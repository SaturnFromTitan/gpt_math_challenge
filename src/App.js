import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

function App() {
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [firstNumber, setFirstNumber] = useState(0);
  const [secondNumber, setSecondNumber] = useState(0);
  const [operator, setOperator] = useState("+");
  const [userAnswer, setUserAnswer] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const generateNewQuestion = useCallback(() => {
    setFirstNumber(Math.floor(Math.random() * 10));
    setSecondNumber(Math.floor(Math.random() * 10) + 1);
    setNewOperator();
  }, []);

  useEffect(() => {
    generateNewQuestion();
    const timer = setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds <= 0) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [generateNewQuestion]);

  function setNewOperator() {
    const operators = ["+", "-", "*", "/"];
    const newOperator = operators[Math.floor(Math.random() * operators.length)];

    if (newOperator === "/") {
      const product = firstNumber * secondNumber;
      setFirstNumber(product);
    }

    setOperator(newOperator);
  }

  function handleSubmit(e) {
    e.preventDefault();
    let correctAnswer;
    switch (operator) {
      case "+":
        correctAnswer = firstNumber + secondNumber;
        break;
      case "-":
        correctAnswer = firstNumber - secondNumber;
        break;
      case "*":
        correctAnswer = firstNumber * secondNumber;
        break;
      case "/":
        correctAnswer = firstNumber / secondNumber;
        break;
      default:
        break;
    }
    if (parseFloat(userAnswer) === correctAnswer) {
      setScore(score + 1);
    }
    setUserAnswer("");
    generateNewQuestion();
  }

  if (gameOver) {
    return (
      <div className="App">
        <h1>Time's up!</h1>
        <h2>Your score: {score}</h2>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Mental Math Game</h1>
      <h2>Time remaining: {secondsLeft} seconds</h2>
      <h3>Score: {score}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          {firstNumber} {operator} {secondNumber} ={" "}
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
