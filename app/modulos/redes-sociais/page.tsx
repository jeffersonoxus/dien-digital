'use client';

import { Music, Film, Video } from 'lucide-react';
import { EmBreve } from '@/components/EmBreve';

export default function ModuloRedesSociais() {
  return (
    <EmBreve
      titulo="Redes Sociais Conscientes"
      cor="from-purple-600 to-pink-600"
      corTexto="text-purple-600"
      icones={[
        <Music key="music" size={48} />,
        <Film key="film" size={48} />,
        <Video key="video" size={48} />,
      ]}
    />
  );
}
