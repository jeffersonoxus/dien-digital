'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, MessageCircle, Shield, 
  TrendingUp, BookOpen, ChevronRight, 
  Wifi, Battery, Zap, Calendar,
  CalendarCheck, Activity
} from 'lucide-react';

interface Modulo {
  id: string;
  titulo: string;
  descricao: string;
  icone: React.ReactNode;
  cor: string;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
}

const modulos: Modulo[] = [
  {
    id: 'whatsapp',
    titulo: 'WhatsApp na Prática',
    descricao: 'Aprenda a usar o WhatsApp com segurança e eficiência no dia a dia',
    icone: <MessageCircle size={32} />,
    cor: 'from-green-600 to-emerald-600',
    nivel: 'Iniciante'
  },
  {
    id: 'simulador-agendamento',
    titulo: 'Simulador de Agendamentos',
    descricao: 'Aprenda na prática como marcar consultas e exames pelo WhatsApp',
    icone: <CalendarCheck size={32} />,
    cor: 'from-teal-500 to-cyan-600',
    nivel: 'Iniciante'
  },
  {
    id: 'apps-uteis',
    titulo: 'Apps Úteis do Dia a Dia',
    descricao: 'Descubra aplicativos que facilitam sua rotina',
    icone: <Smartphone size={32} />,
    cor: 'from-orange-600 to-red-600',
    nivel: 'Iniciante'
  },
  {
    id: 'seguranca',
    titulo: 'Segurança Digital',
    descricao: 'Proteja seus dados e evite golpes online',
    icone: <Shield size={32} />,
    cor: 'from-blue-600 to-cyan-600',
    nivel: 'Intermediário'
  },
  {
    id: 'redes-sociais',
    titulo: 'Redes Sociais Conscientes',
    descricao: 'Use as redes sociais de forma saudável e produtiva',
    icone: <TrendingUp size={32} />,
    cor: 'from-purple-600 to-pink-600',
    nivel: 'Intermediário'
  },
  {
    id: 'economia-digital',
    titulo: 'Economia Digital',
    descricao: 'Entenda como ganhar e economizar dinheiro online',
    icone: <Zap size={32} />,
    cor: 'from-yellow-600 to-amber-600',
    nivel: 'Avançado'
  }
];

export default function Home() {
  const [moduloSelecionado, setModuloSelecionado] = useState<string | null>(null);

  const handleModuloClick = (moduloId: string) => {
    setModuloSelecionado(moduloId);
  };

  if (moduloSelecionado) {
    const ModuloComponent = require(`./modulos/${moduloSelecionado}/page`).default;
    // Não passa onComplete mais
    return <ModuloComponent />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Status Bar Simulada */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm px-6 py-3 flex justify-between items-center text-white/70 text-sm">
        <div className="flex gap-2">
          <Wifi size={14} />
          <span>Offline Ready</span>
        </div>
        <div className="flex gap-2">
          <Battery size={14} />
          <span>100%</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-20 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
            <BookOpen strokeWidth={2.4} size={18} className="text-emerald-400" />
            <span className="text-sm font-medium text-white/90">Letramento Digital</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent">
            EJA-RL
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mt-4">
            Aprenda sobre tecnologia no seu ritmo.
          </p>
        </motion.div>

        {/* Estatísticas - Versão sem progresso */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/30 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">6</div>
            <div className="text-xs font-medium text-white/80">Módulos</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/30 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">100%</div>
            <div className="text-xs font-medium text-white/80">Disponível Offline</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/30 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">Grátis</div>
            <div className="text-xs font-medium text-white/80">Sem custos</div>
          </div>
        </motion.div>

        {/* Grid de Módulos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {modulos.map((modulo, index) => (
            <motion.div
              key={modulo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModuloClick(modulo.id)}
              className={`relative cursor-pointer rounded-2xl overflow-hidden bg-gradient-to-br ${modulo.cor} p-[2px] transition-all hover:shadow-2xl`}
            >
              <div className="bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6 h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-white">
                    {modulo.icone}
                  </div>
                  <span className="text-xs bg-white/20 border border-white/30 text-white font-medium px-2 py-1 rounded-full">
                    {modulo.nivel}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{modulo.titulo}</h3>
                <p className="text-white/80 text-sm mb-4">{modulo.descricao}</p>
                
                <div className="mt-4 flex justify-end">
                  <ChevronRight size={20} className="text-white/40" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
      <footer className="w-full border-t border-white/10 bg-black/20 backdrop-blur-sm py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-3">
            
            {/* Linha Principal */}
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3 text-white/50 tracking-wide">
              <span className="font-medium text-white/80">
                Projeto de Letramento Digital
              </span>
              <span className="hidden md:block text-white/40">|</span>
              <span className="text-sm uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded bg-gradient-to-r from-green-400 via-esmerald-100 to-green-400 bg-clip-text text-transparent">
                EJA-RL
              </span>
            </div>

            {/* Créditos */}
            <p className="text-xs text-white/60 font-light flex items-center gap-1">
              Desenvolvido por Jefferson
            </p>

            {/* Copyright Simbólico */}
            <span className="text-[10px] text-white/40 uppercase tracking-tighter">
              © {new Date().getFullYear()} — Todos os direitos reservados
            </span>

          </div>
        </div>
      </footer>
    </main>
  );
}