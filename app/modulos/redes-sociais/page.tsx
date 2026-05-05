'use client';

import { ArrowLeft, Instagram, Facebook, Twitter, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ModuloRedesSociais() {
  const [concluido, setConcluido] = useState(false);

  if (concluido) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center p-4">
        <motion.div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center max-w-md w-full">
          <CheckCircle size={64} className="mx-auto text-white mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Em Breve!</h2>
          <p className="text-white/80 mb-6">Este módulo será disponibilizado em breve.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-white text-purple-600 px-6 py-3 rounded-full font-bold w-full"
          >
            Voltar ao Início
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-purple-600 to-pink-600 flex flex-col">
      <div className="bg-black/20 backdrop-blur-md px-4 py-3">
        <button
          onClick={() => window.location.href = '/'}
          className="p-2 hover:bg-white/10 rounded-full transition-colors inline-flex"
        >
          <ArrowLeft size={24} className="text-white" />
        </button>
        <h1 className="text-white font-bold text-center mt-2">Redes Sociais Conscientes</h1>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="flex gap-4 justify-center mb-8">
            <Instagram size={48} className="text-white" />
            <Facebook size={48} className="text-white" />
            <Twitter size={48} className="text-white" />
          </div>
          <p className="text-white text-xl mb-8">Conteúdo em desenvolvimento...</p>
          <button
            onClick={() => setConcluido(true)}
            className="bg-white/20 backdrop-blur-sm px-8 py-3 rounded-full text-white font-bold"
          >
            Marcar como Lido
          </button>
        </div>
      </div>
    </div>
  );
}