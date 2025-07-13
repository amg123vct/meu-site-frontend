import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  Coins, 
  Play, 
  Target,
  Info,
  Trophy,
  TrendingUp
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Doble = () => {
  const { user, updateUser } = useAuth();
  const [betAmount, setBetAmount] = useState(10);
  const [prediction, setPrediction] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [balance, setBalance] = useState(user?.credits || 0);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  const numbers = Array.from({ length: 14 }, (_, i) => i + 1);
  const quickBets = [10, 25, 50, 100, 250, 500];

  useEffect(() => {
    setBalance(user?.credits || 0);
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    try {
      const response = await axios.get('/games/history?gameType=doble&limit=10');
      setHistory(response.data.games);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const play = async () => {
    if (isSpinning || balance < betAmount || prediction === null) {
      if (balance < betAmount) {
        toast.error('Créditos insuficientes!');
      } else if (prediction === null) {
        toast.error('Escolha um número!');
      }
      return;
    }

    setIsSpinning(true);
    setResult(null);

    try {
      const response = await axios.post('/games/doble', { 
        betAmount, 
        prediction 
      });
      
      const { result: gameResult, winAmount, isWin, newBalance } = response.data;

      // Simular suspense
      setTimeout(() => {
        setResult({ number: gameResult, winAmount, isWin });
        setBalance(newBalance);
        updateUser({ ...user, credits: newBalance });

        if (isWin) {
          toast.success(`🎉 Vitória! +${winAmount} créditos`);
        } else {
          toast.error(`Número sorteado: ${gameResult}`);
        }
        setIsSpinning(false);
        loadHistory();
      }, 3000);

    } catch (error) {
      console.error('Erro ao jogar:', error);
      toast.error('Erro ao processar jogo');
      setIsSpinning(false);
    }
  };

  const getNumberColor = (number) => {
    if (number <= 7) return 'from-red-500 to-red-600';
    if (number <= 14) return 'from-black-500 to-gray-700';
    return 'from-green-500 to-green-600';
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎲 Doble</h1>
          <p className="text-white/80">Preveja o número correto e ganhe 13x sua aposta!</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Game Area */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-8 mb-8">
              {/* Number Grid */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  Escolha seu número
                </h3>
                <div className="grid grid-cols-7 gap-3">
                  {numbers.map((number) => (
                    <motion.button
                      key={number}
                      onClick={() => setPrediction(number)}
                      className={`w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl transition-all duration-200 transform hover:scale-105 ${
                        prediction === number
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-110 shadow-lg'
                          : `bg-gradient-to-r ${getNumberColor(number)} hover:scale-105`
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {number}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Result Display */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center mb-6"
                  >
                    <div className={`rounded-lg p-6 ${
                      result.isWin 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : 'bg-gradient-to-r from-red-500 to-pink-500'
                    }`}>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {result.isWin ? '🎉 VITÓRIA!' : '❌ Tente novamente!'}
                      </h3>
                      <p className="text-white text-lg">
                        Número sorteado: <span className="font-bold">{result.number}</span>
                      </p>
                      {result.isWin && (
                        <p className="text-white text-lg mt-2">
                          Ganho: +{result.winAmount} créditos
                        </p>
                      )}
                    </div>
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

                {/* Play Button */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={play}
                    disabled={isSpinning || balance < betAmount || prediction === null}
                    className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    {isSpinning ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    ) : (
                      <Play className="w-8 h-8 ml-1" />
                    )}
                  </button>
                  <span className="text-white/80 text-sm mt-2">JOGAR</span>
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

            {/* Game Info */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Como jogar</h3>
                <Info className="w-5 h-5 text-white/60" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">🎯 Objetivo</h4>
                  <p className="text-white/80 text-sm">
                    Escolha um número de 1 a 14. Se acertar, você ganha 13x o valor da sua aposta!
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">💰 Multiplicador</h4>
                  <p className="text-white/80 text-sm">
                    Aposta x 13 = Ganho total. Exemplo: 100 créditos = 1300 créditos de ganho.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Estatísticas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-white/80">Vitórias</span>
                  </div>
                  <span className="text-white font-bold">{user?.totalWins || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <span className="text-white/80">Taxa de Vitória</span>
                  </div>
                  <span className="text-white font-bold">
                    {user?.totalWins && user?.totalLosses 
                      ? Math.round((user.totalWins / (user.totalWins + user.totalLosses)) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Coins className="w-5 h-5 text-yellow-400" />
                    <span className="text-white/80">Total Apostado</span>
                  </div>
                  <span className="text-white font-bold">{user?.totalWagered || 0}</span>
                </div>
              </div>
            </div>

            {/* Recent History */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Histórico Recente</h3>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-white/60 hover:text-white transition-colors duration-200"
                >
                  {showHistory ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              
              {showHistory && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {history.map((game, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        game.result === 'win' 
                          ? 'bg-green-500/20 border border-green-500/30' 
                          : 'bg-red-500/20 border border-red-500/30'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">
                          {game.gameData.prediction}
                        </span>
                        <span className="text-white/60">→</span>
                        <span className="text-white font-medium">
                          {game.gameData.result}
                        </span>
                      </div>
                      <span className={`text-sm font-medium ${
                        game.result === 'win' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {game.result === 'win' ? '+' : '-'}{game.betAmount}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Number Distribution */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Distribuição</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-red-500/20 rounded-lg">
                  <span className="text-white font-bold">1-7</span>
                  <p className="text-white/60 text-xs">Vermelho</p>
                </div>
                <div className="text-center p-2 bg-black/20 rounded-lg">
                  <span className="text-white font-bold">8-14</span>
                  <p className="text-white/60 text-xs">Preto</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doble; 