'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, CheckCircle, BanIcon, TrendingUp, 
  Wallet, PiggyBank, CreditCard, DollarSign, AlertTriangle,
  Shield, Smartphone, Landmark, Receipt, Scale,
  Type, AlignJustify, ZoomIn, ZoomOut
} from 'lucide-react';

const perguntas = [
  {
    pergunta: "Você recebeu uma mensagem no WhatsApp dizendo que ganhou R$ 5.000,00 em um sorteio que não participou. O que fazer?",
    opcoes: [
      "Clicar no link e informar seus dados",
      "Ignorar e denunciar como golpe",
      "Pagar a taxa para liberar o prêmio",
      "Compartilhar com os amigos"
    ],
    correta: 1,
    explicacao: "Golpistas usam prêmios falsos para roubar dados. Nunca clique em links suspeitos!",
    icone: <AlertTriangle size={24} />
  },
  {
    pergunta: "Qual o problema de pegar dinheiro com agiota?",
    opcoes: [
      "Juros baixos e tranquilos",
      "Juros abusivos e ameaças",
      "Não precisa comprovar renda",
      "É a mesma coisa que banco"
    ],
    correta: 1,
    explicacao: "Agiotas cobram juros extorsivos (às vezes 20% ao mês) e usam violência para cobrar.",
    icone: <BanIcon size={24} />
  },
  {
    pergunta: "O que significa 'apostas online' (bets)?",
    opcoes: [
      "Investimento seguro",
      "Forma de ganhar dinheiro fácil",
      "Jogos de azar que viciam",
      "Economia para o futuro"
    ],
    correta: 2,
    explicacao: "Bets são jogos de azar que causam vício e fazem pessoas perderem muito dinheiro.",
    icone: <TrendingUp size={24} />
  },
  {
    pergunta: "Comprar algo parcelado no cartão SEM JUROS é sempre uma boa ideia?",
    opcoes: [
      "Sim, sempre",
      "Não, só se couber no orçamento",
      "Sim, pois não paga juros",
      "Não, nunca se deve parcelar"
    ],
    correta: 1,
    explicacao: "Mesmo sem juros, parcelas comprometem sua renda futura. Só parcele se couber no bolso!",
    icone: <CreditCard size={24} />
  },
  {
    pergunta: "Uma oferta de 'investimento' promete 30% de retorno em 1 mês. Isso é:",
    opcoes: [
      "Investimento legítimo",
      "Esquema de pirâmide/golpe",
      "Fundo de ações seguro",
      "Tesouro direto"
    ],
    correta: 1,
    explicacao: "Retornos muito altos em pouco tempo são quase sempre golpes (pirâmide financeira).",
    icone: <Shield size={24} />
  },
  {
    pergunta: "Qual a melhor forma de guardar dinheiro para emergências?",
    opcoes: [
      "Na carteira",
      "Em uma poupança ou conta separada",
      "Emprestar para amigos",
      "Investir em apostas"
    ],
    correta: 1,
    explicacao: "Ter uma reserva de emergência em local seguro ajuda em imprevistos sem precisar de agiotas.",
    icone: <PiggyBank size={24} />
  },
  {
    pergunta: "Recebeu um e-mail do banco pedindo sua senha para 'atualizar cadastro'. O que fazer?",
    opcoes: [
      "Enviar a senha imediatamente",
      "Clicar no link do e-mail",
      "Não enviar e contatar o banco por canal oficial",
      "Responder o e-mail com os dados"
    ],
    correta: 2,
    explicacao: "Bancos NUNCA pedem senha por e-mail. É golpe de phishing!",
    icone: <Smartphone size={24} />
  },
  {
    pergunta: "Alguém te oferece um 'negócio da China' com lucro garantido. Isso é:",
    opcoes: [
      "Oportunidade única",
      "Provavelmente um golpe",
      "Investimento seguro",
      "Indicação de amigo"
    ],
    correta: 1,
    explicacao: "Nada no mundo financeiro tem lucro garantido. Desconfie de ofertas milagrosas!",
    icone: <AlertTriangle size={24} />
  },
  {
    pergunta: "Por que não se deve parcelar compras pequenas no cartão?",
    opcoes: [
      "Porque não pode",
      "Pois acumulam jurando ocultos",
      "O cartão não permite",
      "É mais seguro à vista"
    ],
    correta: 1,
    explicacao: "Mesmo parcelas pequenas, quando acumuladas, comprometem grande parte da sua renda futura.",
    icone: <CreditCard size={24} />
  },
  {
    pergunta: "Uma pessoa te pede dinheiro emprestado prometendo pagar depois. O que considerar?",
    opcoes: [
      "Só emprestar se for parente",
      "Empresar sempre",
      "Avaliar se pode perder o dinheiro",
      "Cobrar juros de agiota"
    ],
    correta: 2,
    explicacao: "Só empreste dinheiro que você pode perder. Amizades podem acabar por causa de dívidas.",
    icone: <Scale size={24} />
  },
  {
    pergunta: "Como identificar um esquema de pirâmide financeira?",
    opcoes: [
      "Promessa de lucros rápidos e altos",
      "Indicação de famosos",
      "Cadastro em aplicativo",
      "Grupo no WhatsApp"
    ],
    correta: 0,
    explicacao: "Pirâmides prometem dinheiro fácil recrutando pessoas. Você perde dinheiro e amigos!",
    icone: <AlertTriangle size={24} />
  },
  {
    pergunta: "Qual o problema de jogar em bets (apostas esportivas)?",
    opcoes: [
      "Pode viciar e causar perdas financeiras",
      "É muito divertido",
      "Dá para ganhar sempre",
      "É investimento seguro"
    ],
    correta: 0,
    explicacao: "Bets causam vício em dopamina e fazem pessoas perderem dinheiro que não têm.",
    icone: <TrendingUp size={24} />
  }
];

// Componente de botões de acessibilidade
function AcessibilidadeButtons({ 
  onIncreaseFont, 
  onDecreaseFont, 
  onToggleUppercase,
  fontSize,
  isUppercase 
}: { 
  onIncreaseFont: () => void;
  onDecreaseFont: () => void;
  onToggleUppercase: () => void;
  fontSize: number;
  isUppercase: boolean;
}) {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="fixed z-50 bottom-4 right-4">
      <button
        onClick={() => setMenuAberto(!menuAberto)}
        className="p-3 text-white transition-all duration-300 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700"
      >
        <Type size={24} />
      </button>

      {menuAberto && (
        <div className="absolute bottom-16 right-0 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl space-y-2 min-w-[300px] animate-slide-up">
          <div className="px-2 mb-2 text-xs text-gray-500">Acessibilidade</div>
          
          <button
            onClick={() => {
              onIncreaseFont();
              setMenuAberto(false);
            }}
            className="flex items-center w-full gap-3 px-3 py-2 transition-colors rounded-xl hover:bg-gray-100"
          >
            <ZoomIn size={18} className="text-blue-600" />
            <span className="text-sm text-gray-700">Aumentar fonte</span>
            <span className="ml-auto text-xs text-gray-400">{fontSize}px</span>
          </button>

          <button
            onClick={() => {
              onDecreaseFont();
              setMenuAberto(false);
            }}
            className="flex items-center w-full gap-3 px-3 py-2 transition-colors rounded-xl hover:bg-gray-100"
          >
            <ZoomOut size={18} className="text-blue-600" />
            <span className="text-sm text-gray-700">Diminuir fonte</span>
          </button>

          <button
            onClick={() => {
              onToggleUppercase();
              setMenuAberto(false);
            }}
            className="flex items-center w-full gap-3 px-3 py-2 transition-colors rounded-xl hover:bg-gray-100"
          >
            <AlignJustify size={18} className="text-blue-600" />
            <span className="text-sm text-gray-700">Texto em CAIXA ALTA</span>
            {isUppercase && (
              <span className="ml-auto text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Ativo</span>
            )}
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

export default function ModuloConscientizacaoFinanceira() {
  const [passo, setPasso] = useState(0);
  const [respostas, setRespostas] = useState<number[]>([]);
  const [mostrarResposta, setMostrarResposta] = useState(false);
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null);
  
  // Estados de acessibilidade
  const [fontSize, setFontSize] = useState(16);
  const [isUppercase, setIsUppercase] = useState(false);

  // Carregar preferências salvas
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize');
    const savedUppercase = localStorage.getItem('isUppercase');
    
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    if (savedUppercase) setIsUppercase(JSON.parse(savedUppercase));
  }, []);

  const handleIncreaseFont = () => {
    const newSize = Math.min(fontSize + 2, 32);
    setFontSize(newSize);
    localStorage.setItem('fontSize', newSize.toString());
  };

  const handleDecreaseFont = () => {
    const newSize = Math.max(fontSize - 2, 12);
    setFontSize(newSize);
    localStorage.setItem('fontSize', newSize.toString());
  };

  const handleToggleUppercase = () => {
    const newValue = !isUppercase;
    setIsUppercase(newValue);
    localStorage.setItem('isUppercase', JSON.stringify(newValue));
  };

  const handleResposta = (index: number) => {
    setRespostaSelecionada(index);
    setMostrarResposta(true);
  };

  const handleProxima = () => {
    if (respostaSelecionada !== null) {
      setRespostas([...respostas, respostaSelecionada]);
      
      if (passo < perguntas.length - 1) {
        setPasso(passo + 1);
        setMostrarResposta(false);
        setRespostaSelecionada(null);
      }
    }
  };

  const handleTentarNovamente = () => {
    setMostrarResposta(false);
    setRespostaSelecionada(null);
  };

  const acertou = respostaSelecionada !== null && respostaSelecionada === perguntas[passo]?.correta;
  const finalizado = respostas.length === perguntas.length;

  const transformText = (text: string) => {
    if (isUppercase) {
      return text.toUpperCase();
    }
    return text;
  };

  if (finalizado) {
    const acertos = respostas.filter((r, i) => r === perguntas[i].correta).length;
    return (
      <div className="flex items-center justify-center w-full h-screen p-4 bg-gradient-to-br from-yellow-600 to-amber-700">
        <div className="w-full max-w-md p-8 text-center bg-white/10 backdrop-blur-lg rounded-2xl animate-fade-in" style={{ fontSize: `${fontSize}px` }}>
          <CheckCircle size={64} className="mx-auto mb-4 text-white" />
          <h2 className="mb-2 font-bold text-white" style={{ fontSize: `${fontSize + 8}px` }}>
            {transformText("Módulo Concluído!")}
          </h2>
          <p className="mb-4 text-white/80">
            {transformText(`Você acertou ${acertos} de ${perguntas.length} perguntas`)}
          </p>
          <div className="mb-6 text-sm text-white/60">
            {acertos === perguntas.length ? (
              transformText("🎉 Excelente! Você sabe se proteger financeiramente!")
            ) : acertos >= perguntas.length / 2 ? (
              transformText("👍 Bom trabalho! Continue aprendendo sobre finanças!")
            ) : (
              transformText("💪 Vamos aprender mais sobre educação financeira!")
            )}
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-6 py-3 font-bold transition-all duration-300 bg-white rounded-full text-amber-600 hover:scale-105"
          >
            {transformText("Voltar ao Início")}
          </button>
        </div>
      </div>
    );
  }

  const perguntaAtual = perguntas[passo];

  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-br from-yellow-600 to-amber-700">
      {/* Header */}
      <div className="px-4 py-3 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.href = '/'}
            className="p-2 transition-colors rounded-full hover:bg-white/10"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-white" style={{ fontSize: `${fontSize}px` }}>
              {transformText("Conscientização Financeira")}
            </h1>
            <div className="h-1.5 bg-white/20 rounded-full mt-2">
              <div 
                className="h-full transition-all duration-500 bg-white rounded-full"
                style={{ width: `${(respostas.length / perguntas.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="text-sm font-bold text-white/80">
            {respostas.length + 1}/{perguntas.length}
          </div>
        </div>
      </div>

      {/* Conteúdo Central */}
      <div className="flex items-center justify-center flex-1 p-6 overflow-y-auto">
        <div className="w-full max-w-2xl">
          {!mostrarResposta ? (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="inline-flex p-4 rounded-full bg-white/20">
                  <Wallet size={40} className="text-white" />
                </div>
              </div>

              <div className="bg-[#1E3A5F] rounded-2xl p-6 text-center">
                {typeof perguntaAtual.icone === 'object' && (
                  <div className="flex justify-center mb-4 text-white">
                    {perguntaAtual.icone}
                  </div>
                )}
                
                <h3 className="font-bold text-white" style={{ fontSize: `${fontSize + 6}px` }}>
                  {transformText(perguntaAtual.pergunta)}
                </h3>
              </div>

              <div className="space-y-3">
                {perguntaAtual.opcoes.map((opcao, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleResposta(idx)}
                    className="w-full bg-white/10 backdrop-blur-sm p-4 items-center rounded-xl text-white font-bold text-left hover:bg-white/20 transition-all duration-300 flex gap-3 hover:scale-[1.02] active:scale-98"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    <span className="font-bold text-white bg-[#1E3A5F] px-3 py-1 rounded-full">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{transformText(opcao)}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className={`rounded-2xl p-8 text-center animate-scale-in ${
              acertou ? 'bg-green-600' : 'bg-red-500'
            }`} style={{ fontSize: `${fontSize}px` }}>
              {acertou ? (
                <>
                  <CheckCircle size={64} className="mx-auto mb-4 text-white" />
                  <div className="mb-4 text-3xl">🎉</div>
                </>
              ) : (
                <>
                  <BanIcon size={64} className="mx-auto mb-4 text-white" />
                  <div className="mb-4 text-3xl">💡</div>
                </>
              )}
              <h3 className="mb-2 font-bold text-white" style={{ fontSize: `${fontSize + 6}px` }}>
                {transformText(acertou ? 'Acertou!' : 'Ops, errou!')}
              </h3>
              <p className="mb-6 font-bold text-white">
                {transformText(perguntaAtual.explicacao)}
              </p>
              
              {/* Dica extra para conscientização */}
              {!acertou && (
                <div className="mb-6 text-sm text-white/80">
                  💰 {transformText("Educação financeira é a chave para evitar golpes e dívidas!")}
                </div>
              )}
              
              <div className="flex gap-3">
                {!acertou && (
                  <button
                    onClick={handleTentarNovamente}
                    className="flex-1 py-3 font-bold text-red-500 transition-all duration-300 bg-white rounded-xl hover:bg-white/90"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {transformText("Tentar Novamente")}
                  </button>
                )}
                <button
                  onClick={handleProxima}
                  className={`${
                    acertou ? 'w-full' : 'flex-1'
                  } py-3 bg-white rounded-xl text-amber-600 font-bold hover:bg-white/90 transition-all duration-300`}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {transformText(passo === perguntas.length - 1 ? 'Finalizar' : 'Próxima Pergunta')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botões de Acessibilidade */}
      <AcessibilidadeButtons 
        onIncreaseFont={handleIncreaseFont}
        onDecreaseFont={handleDecreaseFont}
        onToggleUppercase={handleToggleUppercase}
        fontSize={fontSize}
        isUppercase={isUppercase}
      />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scale-in {
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
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
        
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}