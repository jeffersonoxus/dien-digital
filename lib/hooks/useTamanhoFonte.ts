'use client';

import { useEffect, useState } from 'react';

const NIVEIS_PX = [16, 18, 20, 22];
const CHAVE_LOCALSTORAGE = 'eja-tamanho-fonte';

/**
 * Controla o tamanho de fonte de toda a aplicação escalando o
 * font-size do <html>. Como o Tailwind usa unidades rem por padrão,
 * qualquer texto do app acompanha essa escala automaticamente.
 */
export function useTamanhoFonte() {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const salvo = Number(localStorage.getItem(CHAVE_LOCALSTORAGE));
    const indiceSalvo = NIVEIS_PX.indexOf(salvo);
    if (indiceSalvo >= 0) {
      setIndice(indiceSalvo);
      document.documentElement.style.fontSize = `${salvo}px`;
    }
  }, []);

  const aplicar = (novoIndice: number) => {
    const indiceValido = Math.min(Math.max(novoIndice, 0), NIVEIS_PX.length - 1);
    setIndice(indiceValido);
    document.documentElement.style.fontSize = `${NIVEIS_PX[indiceValido]}px`;
    localStorage.setItem(CHAVE_LOCALSTORAGE, String(NIVEIS_PX[indiceValido]));
  };

  return {
    aumentar: () => aplicar(indice + 1),
    diminuir: () => aplicar(indice - 1),
    podeAumentar: indice < NIVEIS_PX.length - 1,
    podeDiminuir: indice > 0,
    nivel: indice + 1,
    totalNiveis: NIVEIS_PX.length,
  };
}
