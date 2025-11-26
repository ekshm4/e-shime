import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Smile, MessageCircle, Palette, BookOpen, TrendingUp, Calendar, Users, Heart } from 'lucide-react';
import { Card } from '../components/ui/card';

interface DashboardProps {
  darkMode: boolean;
}

const motivationalQuotes = [
  "You are stronger than you think.",
  "Every day is a fresh start.",
  "Your feelings are valid and important.",
  "Progress, not perfection.",
  "You matter. Your story matters.",
  "Healing is not linear.",
  "Be gentle with yourself.",
  "You deserve peace and happiness.",
];

export function Dashboard({ darkMode }: DashboardProps) {
  const [userName, setUserName] = useState('Friend');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('eshime_user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.name || 'Friend');
    }
    
    // Set random motivational quote
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);
  }, []);

  const quickActions = [
    {
      icon: <Smile className="h-8 w-8" />,
      title: "Log My Mood",
      description: "Track how you're feeling today",
      link: "/mood",
      color: darkMode ? "bg-blue-900/30" : "bg-blue-50",
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Chat with Counselor",
      description: "Anonymous support available now",
      link: "/chat",
      color: darkMode ? "bg-green-900/30" : "bg-green-50",
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Explore Art & Music",
      description: "Healing through creative expression",
      link: "/creative",
      color: darkMode ? "bg-purple-900/30" : "bg-purple-50",
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Read Peer Stories",
      description: "Find strength in shared experiences",
      link: "/stories",
      color: darkMode ? "bg-yellow-900/30" : "bg-yellow-50",
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Book Therapist",
      description: "Schedule a professional session",
      link: "/booking",
      color: darkMode ? "bg-pink-900/30" : "bg-pink-50",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Peer Support",
      description: "Connect with the community",
      link: "/chat?tab=peer",
      color: darkMode ? "bg-indigo-900/30" : "bg-indigo-50",
    },
  ];

  const recentMoods = [
    { date: 'Today', mood: '😊', color: 'bg-green-500' },
    { date: 'Yesterday', mood: '😐', color: 'bg-yellow-500' },
    { date: 'Nov 3', mood: '😔', color: 'bg-orange-500' },
    { date: 'Nov 2', mood: '😊', color: 'bg-green-500' },
    { date: 'Nov 1', mood: '😌', color: 'bg-blue-500' },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-[#F5F5DC]'} transition-colors duration-300 pb-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`${darkMode ? 'text-white' : 'text-black'} mb-2`}>
            Hello {userName}, how are you feeling today?
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Welcome back to your safe space
          </p>
        </motion.div>

        {/* Motivational Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-white to-gray-50'} rounded-2xl p-6 mb-8 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <div className="flex items-start gap-4">
            <Heart className={`h-8 w-8 ${darkMode ? 'text-beige' : 'text-black'} flex-shrink-0 mt-1`} />
            <div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} italic mb-2`}>
                "{quote}"
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Your daily affirmation
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className={`${darkMode ? 'text-white' : 'text-black'} mb-4`}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
                >
                  <div className={`${action.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                    <div className={darkMode ? 'text-white' : 'text-gray-800'}>
                      {action.icon}
                    </div>
                  </div>
                  <h3 className={`${darkMode ? 'text-white' : 'text-black'} mb-2`}>
                    {action.title}
                  </h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {action.description}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

      
      </div>
    </div>
  );
}
