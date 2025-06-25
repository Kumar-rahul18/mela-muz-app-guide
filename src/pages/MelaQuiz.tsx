
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

interface QuizAttempt {
  name: string;
  phone: string;
  score: number;
  timestamp: number;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Baba Garibnath Dham is located in which state?",
    options: ["Uttarakhand", "Himachal Pradesh", "Haryana", "Punjab"],
    correct: 0
  },
  {
    id: 2,
    question: "What is the significance of Shravani Mela?",
    options: ["Festival of lights", "Monsoon pilgrimage", "Harvest festival", "New Year celebration"],
    correct: 1
  },
  {
    id: 3,
    question: "During which month does Shravani Mela primarily take place?",
    options: ["Kartik", "Chaitra", "Shravan", "Bhadrapada"],
    correct: 2
  },
  {
    id: 4,
    question: "What do devotees carry during Shravani Mela?",
    options: ["Flowers", "Kanwar with Ganga water", "Fruits", "Sweets"],
    correct: 1
  },
  {
    id: 5,
    question: "Baba Garibnath is considered as:",
    options: ["Lord Vishnu", "Lord Shiva", "Lord Ganesha", "Lord Hanuman"],
    correct: 1
  },
  {
    id: 6,
    question: "The word 'Garibnath' means:",
    options: ["Lord of the poor", "Mountain lord", "River lord", "Forest lord"],
    correct: 0
  },
  {
    id: 7,
    question: "What is the traditional color worn during Shravani Mela?",
    options: ["Red", "Yellow", "Saffron/Orange", "White"],
    correct: 2
  },
  {
    id: 8,
    question: "How long does the Shravani Mela typically last?",
    options: ["1 week", "Entire month of Shravan", "15 days", "3 days"],
    correct: 1
  },
  {
    id: 9,
    question: "What is the main offering made to Baba Garibnath?",
    options: ["Rice", "Flowers", "Water from Ganga", "Coconut"],
    correct: 2
  },
  {
    id: 10,
    question: "Devotees walk barefoot during Shravani Mela as a sign of:",
    options: ["Tradition", "Devotion and humility", "Comfort", "Custom"],
    correct: 1
  }
];

const MelaQuiz = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'register' | 'quiz' | 'result' | 'leaderboard'>('register');
  const [userInfo, setUserInfo] = useState({ name: '', phone: '' });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [score, setScore] = useState(0);
  const [rank, setRank] = useState(0);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    // Load previous attempts from localStorage
    const savedAttempts = localStorage.getItem('melaQuizAttempts');
    if (savedAttempts) {
      setAttempts(JSON.parse(savedAttempts));
    }
  }, []);

  useEffect(() => {
    if (currentStep === 'quiz' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (currentStep === 'quiz' && timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [currentStep, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validatePhone = (phone: string) => {
    return /^[6-9]\d{9}$/.test(phone);
  };

  const handleRegister = () => {
    if (!userInfo.name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!validatePhone(userInfo.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    // Check if phone number already attempted
    const existingAttempt = attempts.find(attempt => attempt.phone === userInfo.phone);
    if (existingAttempt) {
      setError('This phone number has already attempted the quiz');
      return;
    }

    setError('');
    setCurrentStep('quiz');
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = () => {
    const calculatedScore = answers.reduce((total, answer, index) => {
      return total + (answer === QUIZ_QUESTIONS[index].correct ? 1 : 0);
    }, 0);

    const newAttempt: QuizAttempt = {
      name: userInfo.name,
      phone: userInfo.phone,
      score: calculatedScore,
      timestamp: Date.now()
    };

    const updatedAttempts = [...attempts, newAttempt];
    
    // Sort by score (descending) and then by timestamp (ascending) for tie-breaking
    updatedAttempts.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.timestamp - b.timestamp;
    });

    const userRank = updatedAttempts.findIndex(attempt => attempt.phone === userInfo.phone) + 1;

    setAttempts(updatedAttempts);
    setScore(calculatedScore);
    setRank(userRank);
    localStorage.setItem('melaQuizAttempts', JSON.stringify(updatedAttempts));
    setCurrentStep('result');
  };

  const renderRegistration = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold text-orange-600">
          🧠 Mela Quiz Registration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={userInfo.name}
            onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            value={userInfo.phone}
            onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter 10-digit phone number"
            maxLength={10}
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        <div className="bg-yellow-50 p-3 rounded-md text-sm text-yellow-800">
          <strong>Quiz Rules:</strong>
          <ul className="mt-1 space-y-1">
            <li>• 10 questions about Baba Garibnath Dham & Shravani Mela</li>
            <li>• 10 minutes time limit</li>
            <li>• One attempt per phone number</li>
            <li>• Questions will auto-submit when time expires</li>
          </ul>
        </div>
        <Button onClick={handleRegister} className="w-full bg-orange-500 hover:bg-orange-600">
          Start Quiz
        </Button>
      </CardContent>
    </Card>
  );

  const renderQuiz = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">
            Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
          </CardTitle>
          <div className="flex items-center space-x-2 text-orange-600 font-bold">
            <Timer size={20} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-4">
            {QUIZ_QUESTIONS[currentQuestion].question}
          </h3>
          <div className="space-y-2">
            {QUIZ_QUESTIONS[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-3 text-left rounded-md border transition-colors ${
                  answers[currentQuestion] === index
                    ? 'bg-orange-100 border-orange-500 text-orange-700'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleNextQuestion}
            disabled={answers[currentQuestion] === undefined}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {currentQuestion === QUIZ_QUESTIONS.length - 1 ? 'Submit Quiz' : 'Next Question'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderResult = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold text-green-600">
          🎉 Quiz Completed!
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {score}/{QUIZ_QUESTIONS.length}
          </div>
          <div className="text-gray-600">Your Score</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            Rank #{rank}
          </div>
          <div className="text-gray-600">Your Position</div>
        </div>
        <div className="space-y-2">
          <Button
            onClick={() => setCurrentStep('leaderboard')}
            variant="outline"
            className="w-full"
          >
            View Leaderboard
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            Back to Home
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderLeaderboard = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold text-purple-600">
          🏆 Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {attempts.slice(0, 10).map((attempt, index) => (
            <div
              key={attempt.phone}
              className={`flex justify-between items-center p-3 rounded-md ${
                attempt.phone === userInfo.phone
                  ? 'bg-yellow-100 border border-yellow-400'
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{attempt.name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(attempt.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-lg font-bold text-green-600">
                {attempt.score}/{QUIZ_QUESTIONS.length}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button
            onClick={() => navigate('/')}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Back to Home
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="app-gradient text-white px-4 py-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/')} className="text-white">
            ←
          </button>
          <h1 className="text-lg font-semibold">Mela Quiz</h1>
        </div>
      </div>

      <div className="p-4">
        {currentStep === 'register' && renderRegistration()}
        {currentStep === 'quiz' && renderQuiz()}
        {currentStep === 'result' && renderResult()}
        {currentStep === 'leaderboard' && renderLeaderboard()}
      </div>
    </div>
  );
};

export default MelaQuiz;
