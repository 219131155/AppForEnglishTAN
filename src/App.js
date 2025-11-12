import React, { useState, useEffect, useRef } from "react";
// The entire React prototype code will go here.
import React, { useState, useEffect, useRef } from "react";

// 🧠 PROJECT: Lower-Grade English Learning Prototype
// 🏗️ TECHNOLOGY USED:
// This prototype is built using **React** (a JavaScript library for building user interfaces) and **Tailwind CSS** for styling.
// - React allows us to build an interactive app using reusable components.
// - Tailwind CSS provides ready-to-use utility classes for beautiful, responsive designs without writing custom CSS.
// - We also use the **Web Speech API** to pronounce words (text-to-speech).
// - Browser **localStorage** is used to save the learner’s progress.

// 🌈 GOAL:
// Create a fun and educational English learning app for children (ages 6–10).
// The learner can choose a category (Colors, Animals, Fruits, Sentences), learn new words with visuals and hints, and then play quizzes to test knowledge.

// 🎮 MAIN FEATURES:
// 1. Home Screen – Choose category & view progress.
// 2. Learning Screen – Displays words, emojis (images), hints, and allows hearing pronunciation.
// 3. Quiz Screen – Lets learners choose or arrange correct answers.
// 4. Result Screen – Shows scores and friendly feedback.
// 5. Teacher View – Displays learner’s progress stored in localStorage.

// 🧩 CODE STRUCTURE:
// - Constants: CATEGORIES data (colors, animals, fruits, sentences)
// - Main App: Handles navigation between screens
// - Screens: HomeScreen, LearnScreen, QuizScreen, ResultScreen, TeacherView
// - Utilities: shuffle() function for randomizing quiz options

// DATA: Categories with sample items (words, hints, emojis)
const CATEGORIES = {
  Colors: [
    { id: "red", word: "Red", hint: "A bright color", emoji: "🔴" },
    { id: "blue", word: "Blue", hint: "Like the sky", emoji: "🔵" },
    { id: "green", word: "Green", hint: "Like grass", emoji: "🟢" },
    { id: "yellow", word: "Yellow", hint: "Like the sun", emoji: "🟡" },
    { id: "black", word: "Black", hint: "Very dark", emoji: "⚫" },
  ],
  Animals: [
    { id: "dog", word: "Dog", hint: "Barks", emoji: "🐶" },
    { id: "cat", word: "Cat", hint: "Says meow", emoji: "🐱" },
    { id: "cow", word: "Cow", hint: "Gives milk", emoji: "🐮" },
    { id: "bird", word: "Bird", hint: "Can fly", emoji: "🐦" },
    { id: "fish", word: "Fish", hint: "Lives in water", emoji: "🐟" },
  ],
  Fruits: [
    { id: "apple", word: "Apple", hint: "Crunchy and sweet", emoji: "🍎" },
    { id: "banana", word: "Banana", hint: "Yellow and soft", emoji: "🍌" },
    { id: "grapes", word: "Grapes", hint: "Small and round", emoji: "🍇" },
    { id: "orange", word: "Orange", hint: "Citrus fruit", emoji: "🍊" },
    { id: "pear", word: "Pear", hint: "Soft and juicy", emoji: "🍐" },
  ],
  Sentences: [
    { id: "s1", sentence: "The cat is black.", pieces: ["The", "cat", "is", "black"], picture: "🐱" },
    { id: "s2", sentence: "I like apples.", pieces: ["I", "like", "apples"], picture: "🍎" },
    { id: "s3", sentence: "The dog runs.", pieces: ["The", "dog", "runs"], picture: "🐶" },
  ],
};

const STORAGE_KEY = "lg_english_progress_v1";

export default function LowerGradeEnglishApp() {
  // 🧠 State variables
  // screen → controls which part of the app is displayed (home, learn, quiz, result)
  // category → selected learning category
  // score → tracks quiz performance
  // progress → stores learner’s saved progress in localStorage

  const [screen, setScreen] = useState("home");
  const [category, setCategory] = useState("Colors");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [quizType, setQuizType] = useState("match");
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [progress, setProgress] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });

  // Web Speech API for pronunciation
  const synthRef = useRef(window.speechSynthesis);

  // Auto-save learner progress when updated
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // 🗣️ Speak the given text aloud
  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    synthRef.current.cancel();
    synthRef.current.speak(utter);
  }

  // 🌟 Navigation handlers
  function startLearning(cat) {
    setCategory(cat);
    setSelectedIndex(0);
    setScreen("learn");
  }

  function nextLearning() {
    setSelectedIndex((i) => Math.min(i + 1, CATEGORIES[category].length - 1));
  }

  function prevLearning() {
    setSelectedIndex((i) => Math.max(i - 1, 0));
  }

  function startQuiz(type = "match") {
    setQuizType(type);
    setScreen("quiz");
    setScore({ correct: 0, total: 0 });
  }

  function finishQuiz(correctCount, total) {
    setScore({ correct: correctCount, total });
    setScreen("result");
    // Save learner progress
    setProgress((p) => ({ ...p, [category]: { score: correctCount, total, date: new Date().toISOString() } }));
  }

  // 📱 Render UI screens
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        {/* Header section */}
        <header className="mb-4">
          <h1 className="text-3xl font-bold text-sky-700">Fun English — Lower Grades</h1>
          <p className="text-sm text-sky-500">Learn words, listen, and play. Friendly for ages 6–10.</p>
        </header>

        {/* Screen router: displays different screens */}
        {screen === "home" && <HomeScreen onChooseCategory={startLearning} progress={progress} setScreen={setScreen} />}
        {screen === "learn" && <LearnScreen category={category} items={CATEGORIES[category]} index={selectedIndex} onBack={() => setScreen("home")} onNext={nextLearning} onPrev={prevLearning} onSpeak={speak} onStartQuiz={() => startQuiz("choose")} onStartSentenceQuiz={() => startQuiz("sentence")} />}
        {screen === "quiz" && <QuizScreen category={category} items={CATEGORIES[category]} type={quizType} onCancel={() => setScreen("home")} onFinish={finishQuiz} onSpeak={speak} />}
        {screen === "result" && <ResultScreen score={score} onBack={() => setScreen("home")} />}

        {/* Teacher/Parent view at bottom */}
        <footer className="mt-6">
          <TeacherView progress={progress} onReset={() => { localStorage.removeItem(STORAGE_KEY); setProgress({}); }} />
        </footer>
      </div>
    </div>
  );
}

// 🏠 HOME SCREEN — lets user pick category and shows last progress
function HomeScreen({ onChooseCategory, setScreen, progress }) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3">
        {Object.keys(CATEGORIES).map((cat) => (
          <button key={cat} onClick={() => onChooseCategory(cat)} className="p-4 rounded-2xl bg-white shadow hover:shadow-lg text-left">
            <div className="text-lg font-semibold">{cat}</div>
            <div className="text-xs text-sky-500 mt-1">Learn and practise {cat.toLowerCase()}</div>
            <div className="mt-2 text-3xl">{renderPreviewEmoji(cat)}</div>
            {progress[cat] && <div className="mt-2 text-xs text-slate-500">Last: {new Date(progress[cat].date).toLocaleDateString()}</div>}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => setScreen("learn")} className="px-4 py-2 bg-sky-600 text-white rounded">Quick Learn</button>
        <button onClick={() => setScreen("quiz")} className="px-4 py-2 bg-emerald-500 text-white rounded">Play a Quiz</button>
      </div>
    </div>
  );
}

// Utility: show emoji icons for preview
function renderPreviewEmoji(cat) {
  if (cat === "Colors") return "🎨";
  if (cat === "Animals") return "🐾";
  if (cat === "Fruits") return "🍉";
  return "✏️";
}

// 📚 LEARNING SCREEN — displays emoji, word, and pronunciation buttons
function LearnScreen({ category, items, index, onBack, onNext, onPrev, onSpeak, onStartQuiz, onStartSentenceQuiz }) {
  const item = items[index];
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="text-slate-500">← Back</button>
        <div className="text-sky-700 font-semibold">Learning: {category}</div>
        <div />
      </div>

      {/* Word display */}
      <div className="flex items-center gap-6">
        <div className="text-7xl">{item.emoji || "❓"}</div>
        <div>
          <div className="text-2xl font-bold">{item.word}</div>
          <div className="text-sm text-slate-500">{item.hint}</div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => onSpeak(item.word)} className="px-3 py-1 bg-sky-100 rounded">🔊 Hear</button>
            <button onClick={() => onSpeak(`${item.word}. ${item.hint}`)} className="px-3 py-1 bg-sky-50 rounded">Say More</button>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="mt-6 flex justify-between">
        <div className="flex gap-2">
          <button onClick={onPrev} className="px-3 py-1 bg-slate-100 rounded">Previous</button>
          <button onClick={onNext} className="px-3 py-1 bg-slate-100 rounded">Next</button>
        </div>
        <div className="flex gap-2">
          <button onClick={onStartQuiz} className="px-3 py-1 bg-emerald-500 text-white rounded">Quiz: Choose</button>
          <button onClick={onStartSentenceQuiz} className="px-3 py-1 bg-indigo-500 text-white rounded">Sentence Game</button>
        </div>
      </div>
    </div>
  );
}

// 💬 RESULT SCREEN — shows score and message
function ResultScreen({ score, onBack }) {
  const message = score.correct === score.total ? "Excellent! Perfect score 🎉" : score.correct >= score.total / 2 ? "Good job! Keep practising 🙂" : "Nice try — keep practicing!";
  return (
    <div className="bg-white p-6 rounded-2xl shadow text-center">
      <div className="text-2xl font-bold">Results</div>
      <div className="text-5xl my-4">{score.correct} / {score.total}</div>
      <div className="text-slate-600">{message}</div>
      <div className="mt-4">
        <button onClick={onBack} className="px-4 py-2 bg-sky-600 text-white rounded">Back to Home</button>
      </div>
    </div>
  );
}

// 🧮 TEACHER VIEW — shows saved scores and reset option
function TeacherView({ progress, onReset }) {
  return (
    <div className="mt-6 p-4 rounded-2xl bg-white shadow">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-sm text-slate-600">Teacher / Parent view</div>
          <div className="text-lg font-semibold">Learner progress</div>
        </div>
        <div>
          <button onClick={onReset} className="px-3 py-1 bg-red-100 text-red-700 rounded">Reset</button>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {Object.keys(CATEGORIES).map((cat) => (
          <div key={cat} className="p-3 bg-sky-50 rounded">
            <div className="font-semibold">{cat}</div>
            {progress[cat] ? (
              <div className="text-sm">Score: {progress[cat].score} / {progress[cat].total} <br /> {new Date(progress[cat].date).toLocaleString()}</div>
            ) : (
              <div className="text-sm text-slate-500">No attempts yet</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 🔀 Utility: Randomly shuffles array elements
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
