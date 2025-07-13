import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Coins, 
  Trophy, 
  TrendingUp, 
  Clock,
  Edit,
  Save,
  X,
  Gamepad2,
  Calendar,
  Shield
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });
  const [stats, setStats] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadProfileData();
  }, [currentPage]);

  const loadProfileData = async () => {
    try {
      const [statsResponse, gamesResponse] = await Promise.all([
        axios.get('/games/stats'),
        axios.get(`/games/history?page=${currentPage}&limit=10`)
      ]);

      setStats(statsResponse.data);
      setGames(gamesResponse.data.games);
      setTotalPages(gamesResponse.data.totalPages);
    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put('/users/profile', formData);
      updateUser(response.data.user);
      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao atualizar perfil';
      toast.error(message);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Perfil do Usuário
          </h1>
          <p className="text-white/80">
            Gerencie suas informações e visualize suas estatísticas
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="glass rounded-2xl p-8 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Informações</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
                >
                  {isEditing ? <X className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Nome de usuário
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="text-white font-medium">{user?.username}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="text-white font-medium">{user?.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Membro desde
                  </label>
                  <p className="text-white font-medium">
                    {formatDate(user?.createdAt)}
                  </p>
                </div>

                {isEditing && (
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleSave}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Estatísticas</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Coins className="w-5 h-5 text-yellow-400" />
                    <span className="text-white/80">Créditos</span>
                  </div>
                  <span className="text-white font-bold">{user?.credits || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-white/80">Vitórias</span>
                  </div>
                  <span className="text-white font-bold">{user?.totalWins || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <span className="text-white/80">Taxa de Vitória</span>
                  </div>
                  <span className="text-white font-bold">{stats?.winRate || 0}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Gamepad2 className="w-5 h-5 text-purple-400" />
                    <span className="text-white/80">Total Jogos</span>
                  </div>
                  <span className="text-white font-bold">{stats?.totalGames || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-green-400" />
                    <span className="text-white/80">Último Login</span>
                  </div>
                  <span className="text-white font-bold text-sm">
                    {formatDate(user?.lastLogin)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Game History */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="glass rounded-2xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Histórico de Jogos</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-white/60 text-sm">
                    Página {currentPage} de {totalPages}
                  </span>
                </div>
              </div>

              {games.length > 0 ? (
                <div className="space-y-4">
                  {games.map((game, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        game.result === 'win' 
                          ? 'bg-green-500/20 border border-green-500/30' 
                          : 'bg-red-500/20 border border-red-500/30'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Gamepad2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium capitalize">
                            {game.gameType}
                          </p>
                          <p className="text-white/60 text-sm">
                            {formatDate(game.timestamp)}
                          </p>
                          {game.gameType === 'tigrinho' && game.gameData.reels && (
                            <p className="text-white/60 text-sm">
                              {game.gameData.reels.join(' ')}
                            </p>
                          )}
                          {game.gameType === 'doble' && (
                            <p className="text-white/60 text-sm">
                              Aposta: {game.gameData.prediction} → Resultado: {game.gameData.result}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${
                          game.result === 'win' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {game.result === 'win' ? '+' : '-'}{game.betAmount}
                        </p>
                        <p className="text-white/60 text-sm">
                          {game.result === 'win' ? 'Vitória' : 'Derrota'}
                        </p>
                        {game.result === 'win' && (
                          <p className="text-green-400 text-sm">
                            +{game.winAmount} créditos
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60 text-lg">Nenhum jogo encontrado</p>
                  <p className="text-white/40">Comece a jogar para ver seu histórico!</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Anterior
                  </button>
                  <span className="px-4 py-2 text-white">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 