"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface CoinFlipGameProps {
  onGameComplete: (result: boolean) => void;
}

export default function CoinFlipGame({ onGameComplete }: CoinFlipGameProps) {
  const [selectedSide, setSelectedSide] = useState<'heads' | 'tails' | null>(null);
  const [betAmount, setBetAmount] = useState<string>('0.01');
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [flipResult, setFlipResult] = useState<'heads' | 'tails' | null>(null);

  const handlePlay = async () => {
    if (!selectedSide || isPlaying) return;

    setIsPlaying(true);
    // Simulate coin flip
    const randomResult = Math.random() < 0.5 ? 'heads' : 'tails';
    setFlipResult(randomResult);
    
    setTimeout(() => {
      const win = randomResult === selectedSide;
      setResult(win);
      onGameComplete(win);
      setIsPlaying(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Choose Heads or Tails
          </label>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSide('heads')}
              className={`p-4 rounded-lg text-lg font-bold transition-colors ${
                selectedSide === 'heads'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Heads
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSide('tails')}
              className={`p-4 rounded-lg text-lg font-bold transition-colors ${
                selectedSide === 'tails'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Tails
            </motion.button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Bet Amount (ETH)
          </label>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            min="0.01"
            step="0.01"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePlay}
          disabled={!selectedSide || isPlaying}
          className={`w-full py-3 px-4 rounded-lg font-bold transition-colors ${
            !selectedSide || isPlaying
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-purple-500 hover:bg-purple-600'
          }`}
        >
          {isPlaying ? 'Flipping...' : 'Flip Coin'}
        </motion.button>
      </div>

      {isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-4"
        >
          <div className="text-xl font-bold text-purple-400">Flipping...</div>
        </motion.div>
      )}

      {result !== null && !isPlaying && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-center py-4 rounded-lg ${
            result ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}
        >
          <div className="text-2xl font-bold mb-2">
            {result ? '🎉 You Won!' : '😢 You Lost'}
          </div>
          <div className="text-gray-300">
            Result was: {flipResult}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 