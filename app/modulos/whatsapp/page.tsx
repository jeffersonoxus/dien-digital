'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, CheckCircle, MessageCircle, ArrowRight } from 'lucide-react';

const perguntas = [
  {
    pergunta: "O que significa o tique azul no WhatsApp?",
    opcoes: ["Mensagem enviada", "Mensagem entregue", "Mensagem lida", "Contato online"],
    correta: 2,
    explicacao: "O tique azul indica que a mensagem foi lida pelo destinatário!"
  },
  {
    pergunta: "Como criar um link de convite para grupo?",
    opcoes: ["Configurar grupo → Link de convite", "Adicionar participantes → Gerar link", "Informações do grupo → Convidar via link", "Todas as anteriores"],
    correta: 3,
    explicacao: "Todas essas formas permitem criar um link de convite para o grupo!"
  },
  {
    pergunta: "O que é a criptografia de ponta a ponta?",
    opcoes: [
      "WhatsApp pode ler suas mensagens",
      "Apenas você e o destinatário podem ler",
      "Mensagens são públicas",
      "Não há segurança nas conversas"
    ],
    correta: 1,
    explicacao: "A criptografia garante que só vocês dois tenham acesso às mensagens!"
  }
];

export default function ModuloWhatsApp() {
  const [passo, setPasso] = useState(0);
  const [respostas, setRespostas] = useState<number[]>([]);
  const [mostrarResposta, setMostrarResposta] = useState(false);

  const handleResposta = (index: number) => {
    setRespostas([...respostas, index]);
    setMostrarResposta(true);
    
    setTimeout(() => {
      if (passo < perguntas.length - 1) {
        setPasso(passo + 1);
        setMostrarResposta(false);
      }
    }, 2000);
  };

  const acertou = respostas[passo] === perguntas[passo]?.correta;
  const finalizado = respostas.length === perguntas.length;

  if (finalizado) {
    const acertos = respostas.filter((r, i) => r === perguntas[i].correta).length;
    return (
      <div className="h-screen w-full bg-gradient-to-br from-green-600 to-emerald-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center"
        >
          <CheckCircle size={64} className="mx-auto text-white mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Módulo Concluído!</h2>
          <p className="text-white/80 mb-4">Você acertou {acertos} de {perguntas.length} perguntas</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-white text-green-600 px-6 py-3 rounded-full font-bold w-full"
          >
            Voltar ao Início
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-green-600 to-emerald-800 flex flex-col">
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
            <h1 className="text-white font-bold">WhatsApp na Prática</h1>
            <div className="h-1.5 bg-white/20 rounded-full mt-2">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${((passo + (mostrarResposta ? 1 : 0)) / perguntas.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Central */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            {!mostrarResposta ? (
              <motion.div
                key="pergunta"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-[#075E54] rounded-2xl p-6 text-center">
                  <MessageCircle size={48} className="mx-auto text-white/50 mb-4" />
                  <h3 className="text-white text-xl font-bold mb-4">
                    {perguntas[passo].pergunta}
                  </h3>
                </div>

                <div className="space-y-3">
                  {perguntas[passo].opcoes.map((opcao, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleResposta(idx)}
                      className="w-full bg-white/10 backdrop-blur-sm p-4 rounded-xl text-white text-left hover:bg-white/20 transition-colors"
                    >
                      {opcao}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="resposta"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-2xl p-8 text-center ${
                  acertou ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              >
                {acertou ? (
                  <CheckCircle size={64} className="mx-auto text-white mb-4" />
                ) : (
                  <div className="text-6xl mb-4">❌</div>
                )}
                <h3 className="text-white text-2xl font-bold mb-2">
                  {acertou ? 'Acertou!' : 'Ops, errou!'}
                </h3>
                <p className="text-white/90">
                  {perguntas[passo].explicacao}
                </p>
                <ArrowRight size={32} className="mx-auto mt-4 text-white animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}