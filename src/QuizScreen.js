// src/QuizScreen.js
import React, { useState } from "react";

const QuizScreen = ({ category, setScreen, setScore }) => {
  // Basic quiz data for each category
  const quizData = {
    Colors: [
      { word: "Red", image: "🔴" },
      { word: "Blue", image: "🔵" },
      { word: "Green", image: "🟢" },
      { word: "Yellow", image: "🟡" },
      { word: "Purple", image: "🟣" },
    ],
    Animals: [
      { word: "Cat", image: "🐱" },
      { word: "Dog", image: "🐶" },
      { word: "Elephant", image: "🐘" },
      { word: "Lion", image: "🦁" },
      { word: "Fish", image: "🐟" },
    ],
    Fruits: [
      { word: "Apple", image: "🍎" },
      { word: "Banana", image: "🍌" },
      { word: "Grapes", image: "🍇" },
      { word: "Orange", image: "🍊" },
      { word: "Watermelon", image: "🍉" },
    ],
  };

  const questions = quizData[category] || quizData["Colors"];
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (word, selected) => {
    setAnswers({ ...answers, [word]: selected });
  };

  const handleSubmit = () => {
    let score = 0;
    questions.forEach((q) => {
      if (answers[q.word] === q.image) score++;
    });
    setScore(score);
    setSubmitted(true);
    setScreen("result");
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold mb-4">🎮 Quiz: Match the Word to the Picture</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {questions.map((q, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow-md text-center">
            <p className="text-lg font-semibold mb-2">{q.word}</p>
            <div className="flex justify-around">
              {questions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(q.word, opt.image)}
                  className={`text-2xl p-2 rounded-lg ${
                    answers[q.word] === opt.image
                      ? "bg-green-300"
                      : "bg-gray-100 hover:bg-yellow-200"
                  }`}
                >
                  {opt.image}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-6 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
      >
        Submit Answers
      </button>
    </div>
  );
};

export default QuizScreen;
