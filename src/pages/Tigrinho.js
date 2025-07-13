import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  Coins, 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Info,
  Trophy
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Tigrinho = () => {
  const { user, updateUser } = useAuth();
  const [betAmount, setBetAmount] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState(['🍎', '🍊', '🍇']);
  const [result, setResult] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [balance, setBalance] = useState(user?.credits || 0);
  const audioRef = useRef(null);

  const symbols = ['🍎', '🍊', '🍇', '🍒', '💎', '7️⃣', '🎰'];
  const multipliers = {
    '7️⃣': 50,
    '💎': 25,
    '🎰': 15,
    '🍎': 10,
    '🍊': 8,
    '🍇': 6,
    '🍒': 4
  };

  useEffect(() => {
    setBalance(user?.credits || 0);
  }, [user]);

  const playSound = () => {
    if (!isMuted && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const spin = async () => {
    if (isSpinning || balance < betAmount) {
      if (balance < betAmount) {
        toast.error('Créditos insuficientes!');
      }
      return;
    }

    setIsSpinning(true);
    setResult(null);
    playSound();

    try {
      const response = await axios.post('/games/tigrinho', { betAmount });
      const { reels, multiplier, winAmount, isWin, newBalance } = response.data;

      // Animar os rolos
      const spinDuration = 2000;
      const spinInterval = setInterval(() => {
        setReels([
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)]
        ]);
      }, 100);

      setTimeout(() => {
        clearInterval(spinInterval);
        setReels(reels);
        setResult({ multiplier, winAmount, isWin });
        setBalance(newBalance);
        updateUser({ ...user, credits: newBalance });

        if (isWin) {
          toast.success(`🎉 Vitória! +${winAmount} créditos`);
        } else {
          toast.error('Tente novamente!');
        }
        setIsSpinning(false);
      }, spinDuration);

    } catch (error) {
      console.error('Erro ao jogar:', error);
      toast.error('Erro ao processar jogo');
      setIsSpinning(false);
    }
  };

  const quickBets = [10, 25, 50, 100, 250, 500];

  return (
    <div className="min-h-screen py-8 px-4">
      <audio ref={audioRef} src="/sounds/spin.mp3" preload="auto" />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎰 Tigrinho</h1>
          <p className="text-white/80">Alinhe 3 símbolos iguais para ganhar!</p>
        </div>

        {/* Game Container */}
        <div className="glass rounded-2xl p-8 mb-8">
          {/* Reels */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              {reels.map((symbol, index) => (
                <motion.div
                  key={index}
                  className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-4xl shadow-lg"
                  animate={isSpinning ? {
                    rotateY: [0, 360],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{ duration: 0.5, repeat: isSpinning ? Infinity : 0 }}
                >
                  {symbol}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Result Display */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center mb-6"
              >
                {result.isWin ? (
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-4">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      🎉 VITÓRIA!
                    </h3>
                    <p className="text-white text-lg">
                      Multiplicador: {result.multiplier}x | Ganho: +{result.winAmount} créditos
                    </p>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-4">
                    <h3 className="text-2xl font-bold text-white">
                      Tente novamente!
                    </h3>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Bet Controls */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-white mb-3">
                Valor da Aposta
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {quickBets.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      betAmount === amount
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="1"
                  max="1000"
                  value={betAmount}
                  onChange={(e) => setBetAmount(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-white font-medium min-w-[60px]">
                  {betAmount}
                </span>
              </div>
            </div>

            {/* Spin Button */}
            <div className="flex flex-col items-center">
              <button
                onClick={spin}
                disabled={isSpinning || balance < betAmount}
                className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {isSpinning ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </button>
              <span className="text-white/80 text-sm mt-2">GIRAR</span>
            </div>

            {/* Balance */}
            <div className="flex-1 text-right">
              <div className="flex items-center justify-end space-x-2 mb-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-bold text-xl">{balance}</span>
              </div>
              <p className="text-white/60 text-sm">Créditos disponíveis</p>
            </div>
          </div>
        </div>

        {/* Multipliers Info */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Multiplicadores</h3>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="text-white/80 hover:text-white transition-colors duration-200"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(multipliers).map(([symbol, multiplier]) => (
              <div
                key={symbol}
                className="flex items-center justify-between bg-white/10 rounded-lg p-3"
              >
                <span className="text-2xl">{symbol}</span>
                <span className="text-white font-bold">{multiplier}x</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass rounded-xl p-6 text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h4 className="text-white font-bold text-lg">{user?.totalWins || 0}</h4>
            <p className="text-white/60">Vitórias</p>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h4 className="text-white font-bold text-lg">{user?.totalWagered || 0}</h4>
            <p className="text-white/60">Total Apostado</p>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-white font-bold text-sm">%</span>
            </div>
            <h4 className="text-white font-bold text-lg">
              {user?.totalWins && user?.totalLosses 
                ? Math.round((user.totalWins / (user.totalWins + user.totalLosses)) * 100)
                : 0}%
            </h4>
            <p className="text-white/60">Taxa de Vitória</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tigrinho; 