"use client";

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from 'framer-motion';
import LuckyNumberGame from './components/LuckyNumberGame';
import CoinFlipGame from './components/CoinFlipGame';

export default function LuckSoulPage() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalGames: 0,
    totalWinnings: 0,
    currentStreak: 0,
  });

  const handleGameComplete = (win: boolean) => {
    setStats(prev => ({
      totalGames: prev.totalGames + 1,
      totalWinnings: win ? prev.totalWinnings + 0.02 : prev.totalWinnings,
      currentStreak: win ? prev.currentStreak + 1 : 0,
    }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center mb-12"
        >
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">LS</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              LuckSoul
            </h1>
          </div>
          <ConnectButton />
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {isConnected ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Navigation Tabs */}
              <div className="flex space-x-4 border-b border-gray-700">
                {['dashboard', 'games', 'rewards', 'profile'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
                      activeTab === tab
                        ? 'bg-purple-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Dashboard Content */}
              {activeTab === 'dashboard' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {/* Stats Cards */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg"
                  >
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">Total Games Played</h3>
                    <p className="text-3xl font-bold text-purple-400">{stats.totalGames}</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg"
                  >
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">Total Winnings</h3>
                    <p className="text-3xl font-bold text-green-400">{stats.totalWinnings} ETH</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg"
                  >
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">Current Streak</h3>
                    <p className="text-3xl font-bold text-pink-400">{stats.currentStreak} days</p>
                  </motion.div>
                </motion.div>
              )}

              {/* Games Content */}
              {activeTab === 'games' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg"
                  >
                    <h3 className="text-xl font-semibold mb-4">Lucky Number</h3>
                    <LuckyNumberGame onGameComplete={handleGameComplete} />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg"
                  >
                    <h3 className="text-xl font-semibold mb-4">Coin Flip</h3>
                    <CoinFlipGame onGameComplete={handleGameComplete} />
                  </motion.div>
                </motion.div>
              )}

              {/* Rewards Content */}
              {activeTab === 'rewards' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg"
                  >
                    <h3 className="text-xl font-semibold mb-4">Your Rewards</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Daily Bonus</span>
                        <button className="bg-purple-500 hover:bg-purple-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                          Claim
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Weekly Streak</span>
                        <button className="bg-purple-500 hover:bg-purple-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                          Claim
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Profile Content */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg"
                  >
                    <h3 className="text-xl font-semibold mb-4">Your Profile</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                        <input
                          type="text"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter your username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <input
                          type="email"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter your email"
                        />
                      </div>
                      <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200">
                        Save Changes
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <h2 className="text-2xl font-semibold mb-4">Welcome to LuckSoul</h2>
              <p className="text-gray-400 mb-8">Connect your wallet to start playing and earning rewards!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
} 