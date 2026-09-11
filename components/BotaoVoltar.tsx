'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

interface BotaoVoltarProps {
  /** Se informado, volta para uma tela interna do simulador em vez de sair para o início */
  onClick?: () => void;
  className?: string;
  size?: number;
  corIcone?: string;
  label?: string;
  /** Conteúdo alternativo ao ícone padrão, ex: um texto de botão */
  children?: ReactNode;
}

export function BotaoVoltar({
  onClick,
  className = 'p-1',
  size = 24,
  corIcone = 'text-white',
  label = 'Voltar para o início',
  children,
}: BotaoVoltarProps) {
  const conteudo = children ?? <ArrowLeft size={size} className={corIcone} />;

  if (onClick) {
    return (
      <button onClick={onClick} aria-label={label} className={className}>
        {conteudo}
      </button>
    );
  }

  return (
    <Link href="/" aria-label={label} className={className}>
      {conteudo}
    </Link>
  );
}
