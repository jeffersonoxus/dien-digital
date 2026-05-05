'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, CheckCircle, Lock, Eye, AlertTriangle, Key } from 'lucide-react';

const dicas = [
  {
    icone: <Lock size={32} />,
    titulo: "Senhas Fortes",
    texto: "Use senhas com 8+ caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos",
    exemplo: "Exemplo: D!3n@2024Tech",
    cor: "from-blue-500 to-cyan-500"
  },
  {
    icone: <Key size={32} />,
    titulo: "Autenticação em 2 Fatores",
    texto: "Ative a verificação em duas etapas em todas as contas importantes",
    exemplo: "Senha + código SMS + biometria",
    cor: "from-purple-500 to-pink-500"
  },
  {
    icone: <AlertTriangle size={32} />,
    titulo: "Golpes Comuns",
    texto: "Desconfie de prêmios, links suspeitos e ofertas milagrosas",
    exemplo: "Nunca clique em links de números desconhecidos",
    cor: "from-red-500 to-orange-500"
  },
  {
    icone: <Eye size={32} />,
    titulo: "Privacidade",
    texto: "Revise regularmente quem pode ver suas informações nas redes sociais",
    exemplo: "Configure perfil como privado",
    cor: "from-green-500 to-emerald-500"
  }
];

export default function ModuloSeguranca() {
  const [passo, setPasso] = useState(0);
  const [revelar, setRevelar] = useState(false);

  const avancar = () => {
    if (passo < dicas.length - 1) {
      setPasso(passo + 1);
      setRevelar(false);
    } else {
      window.location.href = '/';
    }
  };

  const dica = dicas[passo];

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.href = '/'}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white font-bold">Segurança Digital</h1>
            <div className="h-1.5 bg-white/20 rounded-full mt-2">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${((passo + 1) / dicas.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Central */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <motion.div
            key={passo}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className={`bg-gradient-to-br ${dica.cor} rounded-2xl p-8 text-center shadow-2xl`}
          >
            <div className="inline-flex p-4 bg-white/20 rounded-full mb-6">
              {dica.icone}
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">{dica.titulo}</h2>
            <p className="text-white/90 text-lg mb-6">{dica.texto}</p>
            
            <button
              onClick={() => setRevelar(!revelar)}
              className="px-6 py-3 bg-white/20 rounded-xl text-white hover:bg-white/30 transition-colors"
            >
              {revelar ? 'Ocultar Exemplo' : 'Ver Exemplo'}
            </button>
            
            <AnimatePresence>
              {revelar && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 p-4 bg-black/20 rounded-xl"
                >
                  <p className="text-white font-mono text-lg">{dica.exemplo}</p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              onClick={avancar}
              className="mt-8 w-full py-4 bg-white/20 rounded-xl text-white font-bold hover:bg-white/30 transition-colors"
            >
              {passo < dicas.length - 1 ? 'Próxima Dica →' : '✨ Concluir Módulo'}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}