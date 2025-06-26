
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer, SkipForward } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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
    question: "What is the significance of Baba Garibnath Dham?",
    options: [
      "It is a modern temple built in the 21st century",
      "It is a sacred place dedicated to Lord Shiva",
      "It is primarily a tourist destination",
      "It is a government heritage site"
    ],
    correct: 1
  },
  {
    id: 2,
    question: "During which Hindu month is Shravani Mela primarily celebrated?",
    options: ["Kartik", "Chaitra", "Shravan (Sawan)", "Bhadrapada"],
    correct: 2
  },
  {
    id: 3,
    question: "What do devotees typically carry during the Shravani Mela pilgrimage?",
    options: [
      "Holy water (Ganga Jal) in decorated pots (Kanwar)",
      "Prasad offerings",
      "Religious books",
      "Flowers and fruits"
    ],
    correct: 0
  },
  {
    id: 4,
    question: "Baba Garibnath is considered to be which form of Lord Shiva?",
    options: [
      "Nataraja",
      "Rudra",
      "A compassionate form who helps the poor and needy",
      "Mahakaal"
    ],
    correct: 2
  },
  {
    id: 5,
    question: "What is the main ritual performed by Kanwariyas during Shravani Mela?",
    options: [
      "Offering flowers to the deity",
      "Carrying holy water from the Ganges to offer to Lord Shiva",
      "Performing classical dances",
      "Reciting religious texts"
    ],
    correct: 1
  },
  {
    id: 6,
    question: "How long does the Shravani Mela typically last?",
    options: ["One day", "One week", "The entire month of Shravan", "15 days"],
    correct: 2
  },
  {
    id: 7,
    question: "What color of clothing do most Kanwariyas wear during the pilgrimage?",
    options: ["White", "Red", "Saffron/Orange", "Yellow"],
    correct: 2
  },
  {
    id: 8,
    question: "What is the literal meaning of \"Garibnath\"?",
    options: [
      "Lord of the Mountains",
      "Lord of the Poor/Needy",
      "Lord of Knowledge",
      "Lord of Wealth"
    ],
    correct: 1
  },
  {
    id: 9,
    question: "Which river's water is considered most sacred for the Shravani Mela rituals?",
    options: ["Yamuna", "Saraswati", "Narmada", "Ganga (Ganges)"],
    correct: 3
  },
  {
    id: 10,
    question: "What is the primary purpose of the Shravani Mela pilgrimage?",
    options: [
      "Social gathering and entertainment",
      "Seeking blessings, purification, and fulfilling religious vows",
      "Cultural preservation",
      "Economic activities"
    ],
    correct: 1
  }
];

const MelaQuiz = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
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
    console.log('MelaQuiz component mounted');
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
    console.log('Register button clicked', userInfo);
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
    console.log('Starting quiz...');
    setCurrentStep('quiz');
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleSkipQuestion = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
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
          🧠 {t('quiz_registration')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t('full_name')}</label>
          <input
            type="text"
            value={userInfo.name}
            onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder={t('enter_name')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('phone_number')}</label>
          <input
            type="tel"
            value={userInfo.phone}
            onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder={t('enter_phone')}
            maxLength={10}
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        <div className="bg-yellow-50 p-3 rounded-md text-sm text-yellow-800">
          <strong>{t('quiz_rules')}</strong>
          <ul className="mt-1 space-y-1">
            <li>{t('quiz_rule_1')}</li>
            <li>{t('quiz_rule_2')}</li>
            <li>{t('quiz_rule_3')}</li>
            <li>{t('quiz_rule_4')}</li>
          </ul>
        </div>
        <Button onClick={handleRegister} className="w-full bg-orange-500 hover:bg-orange-600">
          {t('start_quiz')}
        </Button>
      </CardContent>
    </Card>
  );

  const renderQuiz = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">
            {t('question_of').replace('{current}', (currentQuestion + 1).toString()).replace('{total}', QUIZ_QUESTIONS.length.toString())}
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
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
          >
            {t('previous')}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleSkipQuestion}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <SkipForward size={16} />
            <span>{t('skip_question')}</span>
          </Button>

          <Button
            onClick={handleNextQuestion}
            disabled={answers[currentQuestion] === undefined}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {currentQuestion === QUIZ_QUESTIONS.length - 1 ? t('submit_quiz') : t('next_question')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderResult = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold text-green-600">
          🎉 {t('quiz_completed')}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {score}/{QUIZ_QUESTIONS.length}
          </div>
          <div className="text-gray-600">{t('your_score')}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {t('rank')}{rank}
          </div>
          <div className="text-gray-600">{t('your_position')}</div>
        </div>
        <div className="space-y-2">
          <Button
            onClick={() => setCurrentStep('leaderboard')}
            variant="outline"
            className="w-full"
          >
            {t('view_leaderboard')}
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            {t('back_to_home')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderLeaderboard = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold text-purple-600">
          🏆 {t('leaderboard')}
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
            {t('back_to_home')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  console.log('Current step:', currentStep);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="app-gradient text-white px-4 py-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/')} className="text-white">
            ←
          </button>
          <h1 className="text-lg font-semibold">{t('mela_quiz')}</h1>
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
