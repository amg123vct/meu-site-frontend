import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  Gamepad2, 
  Trophy, 
  Coins, 
  TrendingUp, 
  Users, 
  Clock,
  ArrowRight,
  Play
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, gamesResponse] = await Promise.all([
        axios.get('/games/stats'),
        axios.get('/games/history?limit=5')
      ]);

      setStats(statsResponse.data);
      setRecentGames(gamesResponse.data.games);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const games = [
    {
      name: 'Tigrinho',
      description: 'Alinhe 3 símbolos iguais para ganhar!',
      icon: '🎰',
      color: 'from-purple-500 to-pink-500',
      path: '/tigrinho',
      plays: stats?.tigrinhoGames || 0
    },
    {
      name: 'Doble',
      description: 'Preveja o número correto e ganhe 13x!',
      icon: '🎲',
      color: 'from-blue-500 to-cyan-500',
      path: '/doble',
      plays: stats?.dobleGames || 0
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Bem-vindo de volta, {user?.username}! 👋
          </h1>
          <p className="text-xl text-white/80">
            Pronto para mais uma rodada de diversão?
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Créditos</p>
                <p className="text-3xl font-bold text-white">{user?.credits || 0}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Vitórias</p>
                <p className="text-3xl font-bold text-white">{user?.totalWins || 0}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Taxa de Vitória</p>
                <p className="text-3xl font-bold text-white">
                  {stats?.winRate || 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Jogos</p>
                <p className="text-3xl font-bold text-white">{stats?.totalGames || 0}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Games Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Escolha seu jogo
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {games.map((game, index) => (
              <motion.div
                key={game.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                className="glass rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${game.color} rounded-2xl flex items-center justify-center text-4xl`}>
                    {game.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{game.name}</h3>
                  <p className="text-white/80 mb-6">{game.description}</p>
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className="text-center">
                      <p className="text-white/60 text-sm">Jogadas</p>
                      <p className="text-white font-bold">{game.plays}</p>
                    </div>
                  </div>
                  <Link
                    to={game.path}
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Jogar Agora
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Games */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="glass rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Jogos Recentes</h3>
              <Link
                to="/profile"
                className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
              >
                Ver todos
              </Link>
            </div>
            
            {recentGames.length > 0 ? (
              <div className="space-y-4">
                {recentGames.map((game, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      game.result === 'win' 
                        ? 'bg-green-500/20 border border-green-500/30' 
                        : 'bg-red-500/20 border border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Gamepad2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium capitalize">
                          {game.gameType}
                        </p>
                        <p className="text-white/60 text-sm">
                          {new Date(game.timestamp).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        game.result === 'win' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {game.result === 'win' ? '+' : '-'}{game.betAmount}
                      </p>
                      <p className="text-white/60 text-sm">
                        {game.result === 'win' ? 'Vitória' : 'Derrota'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">Nenhum jogo recente</p>
                <p className="text-white/40 text-sm">Comece a jogar para ver seu histórico!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 