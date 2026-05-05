// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, MessageCircle, Shield, 
  TrendingUp, BookOpen, ChevronRight, 
  Wifi, Battery, Zap 
} from 'lucide-react';

interface Modulo {
  id: string;
  titulo: string;
  descricao: string;
  icone: React.ReactNode;
  cor: string;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
  progresso?: number;
}

const modulos: Modulo[] = [
  {
    id: 'whatsapp',
    titulo: 'WhatsApp na Prática',
    descricao: 'Aprenda a usar o WhatsApp com segurança e eficiência no dia a dia',
    icone: <MessageCircle size={32} />,
    cor: 'from-green-600 to-emerald-600',
    nivel: 'Iniciante',
    progresso: 0
  },
  {
    id: 'seguranca',
    titulo: 'Segurança Digital',
    descricao: 'Proteja seus dados e evite golpes online',
    icone: <Shield size={32} />,
    cor: 'from-blue-600 to-cyan-600',
    nivel: 'Intermediário',
    progresso: 0
  },
  {
    id: 'redes-sociais',
    titulo: 'Redes Sociais Conscientes',
    descricao: 'Use as redes sociais de forma saudável e produtiva',
    icone: <TrendingUp size={32} />,
    cor: 'from-purple-600 to-pink-600',
    nivel: 'Intermediário',
    progresso: 0
  },
  {
    id: 'apps-uteis',
    titulo: 'Apps Úteis do Dia a Dia',
    descricao: 'Descubra aplicativos que facilitam sua rotina',
    icone: <Smartphone size={32} />,
    cor: 'from-orange-600 to-red-600',
    nivel: 'Iniciante',
    progresso: 0
  },
  {
    id: 'economia-digital',
    titulo: 'Economia Digital',
    descricao: 'Entenda como ganhar e economizar dinheiro online',
    icone: <Zap size={32} />,
    cor: 'from-yellow-600 to-amber-600',
    nivel: 'Avançado',
    progresso: 0
  }
];

export default function Home() {
  const [modulosCompletados, setModulosCompletados] = useState<string[]>([]);
  const [moduloSelecionado, setModuloSelecionado] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('modulosCompletados');
    if (saved) setModulosCompletados(JSON.parse(saved));
  }, []);

  const handleModuloClick = (moduloId: string) => {
    setModuloSelecionado(moduloId);
  };

  const handleModuloCompleto = (moduloId: string) => {
    const novosCompletados = [...modulosCompletados, moduloId];
    setModulosCompletados(novosCompletados);
    localStorage.setItem('modulosCompletados', JSON.stringify(novosCompletados));
    setModuloSelecionado(null);
  };

  if (moduloSelecionado) {
    const ModuloComponent = require(`./modulos/${moduloSelecionado}/page`).default;
    return <ModuloComponent onComplete={() => handleModuloCompleto(moduloSelecionado)} />;
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
            <BookOpen size={18} className="text-emerald-400" />
            <span className="text-sm text-white/80">Letramento Digital</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent">
            DIEN Digital
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Aprenda sobre tecnologia no seu ritmo, sem internet e de forma prática
          </p>
        </motion.div>

        {/* Estatísticas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{modulosCompletados.length}</div>
            <div className="text-xs text-white/60">Módulos Concluídos</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{modulos.length}</div>
            <div className="text-xs text-white/60">Total de Módulos</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">100%</div>
            <div className="text-xs text-white/60">Disponível Offline</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">Gratuito</div>
            <div className="text-xs text-white/60">Sem custos</div>
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
                  <div className="flex gap-2">
                    {modulosCompletados.includes(modulo.id) && (
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">
                        ✅ Concluído
                      </span>
                    )}
                    <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded-full">
                      {modulo.nivel}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{modulo.titulo}</h3>
                <p className="text-white/60 text-sm mb-4">{modulo.descricao}</p>
                
                {/* Barra de Progresso */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-white/50 mb-1">
                    <span>Progresso</span>
                    <span>{modulosCompletados.includes(modulo.id) ? '100%' : `${modulo.progresso || 0}%`}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: modulosCompletados.includes(modulo.id) ? '100%' : `${modulo.progresso || 0}%` }}
                      className="h-full bg-white/50 rounded-full"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <ChevronRight size={20} className="text-white/40" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}