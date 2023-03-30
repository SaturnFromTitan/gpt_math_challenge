import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

function App() {
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [firstNumber, setFirstNumber] = useState(0);
  const [secondNumber, setSecondNumber] = useState(0);
  const [operator, setOperator] = useState("+");
  const [userAnswer, setUserAnswer] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]);

  const generateNewQuestion = useCallback(() => {
    function setNewOperator() {
      const operators = ["+", "-", "*", "/"];
      const newOperator = operators[Math.floor(Math.random() * operators.length)];

      if (newOperator === "/") {
        const product = firstNumber * secondNumber;
        setFirstNumber(product);
      }

      setOperator(newOperator);
    }

    setFirstNumber(Math.floor(Math.random() * 10));
    setSecondNumber(Math.floor(Math.random() * 10) + 1);  // avoid division by 0
    setNewOperator();
  }, [firstNumber, secondNumber]);

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

    setTotalQuestions(totalQuestions + 1);

    if (parseFloat(userAnswer) === correctAnswer) {
      setScore(score + 1);
    } else {
      setWrongAnswers((prev) => [
        ...prev,
        {
          question: `${firstNumber} ${operator} ${secondNumber}`,
          userAnswer,
          correctAnswer,
        },
      ]);
    }
    setUserAnswer("");
    generateNewQuestion();
  }

  function restartGame() {
    if (score > highestScore) {
      setHighestScore(score);
    }
    setSecondsLeft(10);
    setScore(0);
    setUserAnswer("");
    setGameOver(false);
    setWrongAnswers([]);
    setTotalQuestions(0);
    generateNewQuestion();
  }

  if (gameOver) {
    return (
      <div className="App">
        <h1>Time's up!</h1>
        <h2>Your score: {score} / {totalQuestions}</h2>
        <h3>Highest score: {highestScore}</h3>
        <h3>Great effort!</h3>
        {wrongAnswers.length > 0 && (
          <>
            <h4>Wrong Answers:</h4>
            <ul>
              {wrongAnswers.map((answer, index) => (
                <li key={index}>
                  {answer.question} = {answer.userAnswer} (Correct: {answer.correctAnswer})
                </li>
              ))}
            </ul>
          </>
        )}
        <button onClick={restartGame}>Play again</button>
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
