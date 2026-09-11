'use client';

import { TrendingUp, Wallet, PiggyBank, CreditCard, DollarSign } from 'lucide-react';
import { EmBreve } from '@/components/EmBreve';

export default function ModuloEconomiaDigital() {
  return (
    <EmBreve
      titulo="Economia Digital"
      cor="from-yellow-600 to-amber-700"
      corTexto="text-amber-600"
      icones={[
        <TrendingUp key="trending" size={48} />,
        <Wallet key="wallet" size={48} />,
        <PiggyBank key="piggy" size={48} />,
        <CreditCard key="card" size={48} />,
        <DollarSign key="dollar" size={48} />,
      ]}
    />
  );
}
