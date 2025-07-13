import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Gamepad2, 
  Trophy, 
  Users, 
  Zap, 
  Shield, 
  Star,
  ArrowRight,
  Play
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Gamepad2,
      title: 'Jogos Diversos',
      description: 'Tigrinho e Doble com gráficos incríveis e jogabilidade envolvente'
    },
    {
      icon: Trophy,
      title: 'Sistema de Recompensas',
      description: 'Ganhe créditos e suba no ranking dos melhores jogadores'
    },
    {
      icon: Users,
      title: 'Comunidade Ativa',
      description: 'Conecte-se com outros jogadores e participe de torneios'
    },
    {
      icon: Zap,
      title: 'Jogos em Tempo Real',
      description: 'Experiência fluida com Socket.IO para máxima performance'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Sistema de autenticação seguro e proteção de dados'
    },
    {
      icon: Star,
      title: 'Interface Moderna',
      description: 'Design responsivo e intuitivo para todas as plataformas'
    }
  ];

  const games = [
    {
      name: 'Tigrinho',
      description: 'O clássico jogo de slots com símbolos coloridos e multiplicadores incríveis',
      image: '🎰',
      color: 'from-purple-500 to-pink-500',
      path: '/tigrinho'
    },
    {
      name: 'Doble',
      description: 'Teste sua sorte prevendo números de 1 a 14 com multiplicador de 13x',
      image: '🎲',
      color: 'from-blue-500 to-cyan-500',
      path: '/doble'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              🎮 Plataforma de{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Jogos Online
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
              Divirta-se com os melhores jogos online. Tigrinho, Doble e muito mais em uma plataforma moderna e segura.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                Começar Agora
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 glass text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200"
              >
                Já tenho conta
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nossos Jogos
            </h2>
            <p className="text-xl text-white/80">
              Escolha seu jogo favorito e comece a jogar agora mesmo
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {games.map((game, index) => (
              <motion.div
                key={game.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${game.color} rounded-2xl flex items-center justify-center text-4xl`}>
                    {game.image}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{game.name}</h3>
                  <p className="text-white/80 mb-6">{game.description}</p>
                  <Link
                    to={game.path}
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                  >
                    Jogar Agora
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Por que escolher nossa plataforma?
            </h2>
            <p className="text-xl text-white/80">
              Oferecemos a melhor experiência de jogos online
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/80">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto para começar?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Junte-se a milhares de jogadores e comece sua jornada agora mesmo
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
            >
              <Play className="w-5 h-5 mr-2" />
              Criar Conta Grátis
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home; 