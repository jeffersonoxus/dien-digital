'use client';

import { Smartphone, Calendar, Cloud, Map, Music } from 'lucide-react';
import { EmBreve } from '@/components/EmBreve';

export default function ModuloAppsUteis() {
  return (
    <EmBreve
      titulo="Apps Úteis do Dia a Dia"
      cor="from-orange-600 to-red-600"
      corTexto="text-orange-600"
      icones={[
        <Smartphone key="smartphone" size={48} />,
        <Calendar key="calendar" size={48} />,
        <Cloud key="cloud" size={48} />,
        <Map key="map" size={48} />,
        <Music key="music" size={48} />,
      ]}
    />
  );
}
