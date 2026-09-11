'use client';

import { Shield, Lock, Eye, AlertTriangle, Key } from 'lucide-react';
import { EmBreve } from '@/components/EmBreve';

export default function ModuloSeguranca() {
  return (
    <EmBreve
      titulo="Segurança Digital"
      cor="from-slate-900 to-slate-800"
      corTexto="text-slate-800"
      icones={[
        <Shield key="shield" size={48} />,
        <Lock key="lock" size={48} />,
        <Key key="key" size={48} />,
        <Eye key="eye" size={48} />,
        <AlertTriangle key="alert" size={48} />,
      ]}
    />
  );
}
