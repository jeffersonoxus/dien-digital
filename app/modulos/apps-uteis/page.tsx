'use client';

import { ArrowLeft, Smartphone, Calendar, Cloud, Map, Music, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function ModuloAppsUteis() {
  const [concluido, setConcluido] = useState(false);

  if (concluido) {
    return (
      <div className="flex items-center justify-center w-full h-screen p-4 bg-gradient-to-br from-orange-600 to-red-600">
        <div className="w-full max-w-md p-8 text-center bg-white/10 backdrop-blur-lg rounded-2xl animate-fade-in">
          <CheckCircle size={64} className="mx-auto mb-4 text-white" />
          <h2 className="mb-4 text-2xl font-bold text-white">Em Breve!</h2>
          <p className="mb-6 text-white/80">Este módulo será disponibilizado em breve.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-6 py-3 font-bold text-orange-600 transition-all duration-300 bg-white rounded-full hover:scale-105 active:scale-95"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-br from-orange-600 to-red-600">
      <div className="px-4 py-3 bg-black/20 backdrop-blur-md">
        <button
          onClick={() => window.location.href = '/'}
          className="inline-flex p-2 transition-colors rounded-full hover:bg-white/10"
        >
          <ArrowLeft size={24} className="text-white" />
        </button>
        <h1 className="mt-2 font-bold text-center text-white">Apps Úteis do Dia a Dia</h1>
      </div>
      
      <div className="flex items-center justify-center flex-1 p-6">
        <div className="text-center animate-fade-in">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Smartphone size={48} className="text-white transition-all duration-300 hover:scale-110 hover:rotate-12" />
            <Calendar size={48} className="text-white transition-all duration-300 hover:scale-110 hover:rotate-12" />
            <Cloud size={48} className="text-white transition-all duration-300 hover:scale-110 hover:rotate-12" />
            <Map size={48} className="text-white transition-all duration-300 hover:scale-110 hover:rotate-12" />
            <Music size={48} className="text-white transition-all duration-300 hover:scale-110 hover:rotate-12" />
          </div>
          <p className="mb-8 text-xl text-white">Conteúdo em desenvolvimento...</p>
          <button
            onClick={() => setConcluido(true)}
            className="px-8 py-3 font-bold text-white transition-all duration-300 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 hover:scale-105 active:scale-95"
          >
            Marcar como Lido
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}