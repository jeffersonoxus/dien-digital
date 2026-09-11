'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlignJustify, Minus, Plus } from 'lucide-react';
import { useTamanhoFonte } from '@/lib/hooks/useTamanhoFonte';

interface BotaoAcessibilidadeProps {
  /** Classes Tailwind de cor do botão principal, ex: "bg-blue-700 hover:bg-blue-800" */
  cor?: string;
  /** Classes Tailwind de posição, ex: "bottom-24 right-4" */
  posicao?: string;
  /** Passe isto apenas em módulos que já suportam texto em caixa alta */
  maiusculoAtivo?: boolean;
  onToggleMaiusculo?: () => void;
}

export function BotaoAcessibilidade({
  cor = 'bg-slate-700 hover:bg-slate-800',
  posicao = 'bottom-4 right-4',
  maiusculoAtivo,
  onToggleMaiusculo,
}: BotaoAcessibilidadeProps) {
  const [aberto, setAberto] = useState(false);
  const { aumentar, diminuir, podeAumentar, podeDiminuir, nivel, totalNiveis } = useTamanhoFonte();

  return (
    <div className={`fixed z-50 ${posicao}`}>
      <button
        onClick={() => setAberto((v) => !v)}
        aria-label="Abrir opções de acessibilidade"
        aria-expanded={aberto}
        className={`p-3 text-white rounded-full shadow-lg transition-colors ${cor}`}
      >
        <Activity size={24} />
      </button>

      {aberto && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          role="menu"
          aria-label="Opções de acessibilidade"
          className="absolute right-0 p-3 space-y-3 bg-white rounded-2xl shadow-xl bottom-16 min-w-[220px]"
        >
          <p className="px-2 text-xs text-gray-400">Acessibilidade</p>

          <div className="flex items-center justify-between px-3 py-1">
            <span className="text-sm text-gray-700">Tamanho do texto</span>
            <div className="flex items-center gap-1">
              <button
                onClick={diminuir}
                disabled={!podeDiminuir}
                aria-label="Diminuir tamanho do texto"
                className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus size={16} className="text-gray-700" />
              </button>
              <span className="w-8 text-xs text-center text-gray-400 tabular-nums" aria-live="polite">
                {nivel}/{totalNiveis}
              </span>
              <button
                onClick={aumentar}
                disabled={!podeAumentar}
                aria-label="Aumentar tamanho do texto"
                className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus size={16} className="text-gray-700" />
              </button>
            </div>
          </div>

          {onToggleMaiusculo && (
            <button
              onClick={() => {
                onToggleMaiusculo();
                setAberto(false);
              }}
              className="flex items-center w-full gap-3 px-3 py-2 rounded-xl hover:bg-gray-100"
            >
              <AlignJustify size={18} className="text-gray-700" />
              <span className="text-sm text-gray-700">Texto em CAIXA ALTA</span>
              {maiusculoAtivo && (
                <span className="ml-auto text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Ativo</span>
              )}
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
