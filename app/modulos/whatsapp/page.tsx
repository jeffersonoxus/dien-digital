'use client';

import { useState, useEffect } from 'react';
import {
  Send, CheckCircle, BanIcon, MessageCircle, ArrowRight,
  Shield, Users, Image, Mic, Video, Camera, Smile, Paperclip,
  Clock, Lock, Globe, Download, Phone, FileText, Trash2, Star,
  Type, AlignJustify, ZoomIn, ZoomOut
} from 'lucide-react';
import { BotaoVoltar } from '@/components/BotaoVoltar';

const perguntas = [
  {
    pergunta: "O que significa um tique cinza (✓) no WhatsApp?",
    opcoes: ["Mensagem lida", "Mensagem entregue", "Mensagem enviada", "Contato bloqueado"],
    correta: 2,
    explicacao: "Um tique cinza significa que a mensagem foi enviada do seu celular, mas ainda não chegou ao destinatário.",
    icone: "✓"
  },
  {
    pergunta: "O que significa dois tiques cinzas (✓✓) no WhatsApp?",
    opcoes: ["Mensagem lida", "Mensagem entregue ao servidor", "Mensagem enviada", "Mensagem visualizada"],
    correta: 1,
    explicacao: "Dois tiques cinzas indicam que a mensagem foi entregue ao servidor do WhatsApp, mas o destinatário ainda não recebeu.",
    icone: "✓✓"
  },
  {
    pergunta: "O que significa dois tiques azuis (✓✓) no WhatsApp?",
    opcoes: ["Mensagem enviada", "Mensagem entregue", "Mensagem lida", "Contato online"],
    correta: 2,
    explicacao: "Dois tiques azuis indicam que a mensagem foi lida pelo destinatário!",
    icone: "✓✓💙"
  },
  {
    pergunta: "Como criar um link de convite para grupo?",
    opcoes: [
      "Configurar grupo → Link de convite", 
      "Adicionar participantes → Gerar link", 
      "Informações do grupo → Convidar via link", 
      "Todas as anteriores"
    ],
    correta: 3,
    explicacao: "Todas essas formas permitem criar um link de convite para o grupo!",
    icone: <Users size={24} />
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
    explicacao: "A criptografia garante que só vocês dois tenham acesso às mensagens! 🔒",
    icone: <Lock size={24} />
  },
  {
    pergunta: "O ícone do microfone é utilizado para:",
    opcoes: ["Enviar textos", "Enviar mensagens de voz", "Anexar arquivos", "Enviar um emoji"],
    correta: 1,
    explicacao: "O ícone do microfone permite gravar e enviar áudios.",
    icone: <Mic className='animate-pulse' size={30} />
  },
  {
    pergunta: "Como saber se alguém está online no WhatsApp?",
    opcoes: [
      "Status 'Online' no topo da conversa",
      "Tique azul imediato",
      "Ícone de câmera verde",
      "Não tem como saber"
    ],
    correta: 0,
    explicacao: "Quando a pessoa está online, aparece 'online' no topo da conversa.",
    icone: <Globe size={24} />
  },
  {
    pergunta: "O que significa a câmera ao lado do nome?",
    opcoes: [
      "Está com a câmera aberta", 
      "Está em uma chamada de vídeo", 
      "Está no status", 
      "Acabou de tirar uma foto"
    ],
    correta: 2,
    explicacao: "A câmera ao lado do nome indica que a pessoa está visualizando os status.",
    icone: <Camera size={24} />
  },
  {
    pergunta: "Como apagar uma mensagem para todos?",
    opcoes: [
      "Pressionar a tecla voltar do celular",
      "Segurar mensagem → Apagar para mim",
      "Segurar mensagem → Apagar para todos",
      "Bloquear o contato"
    ],
    correta: 2,
    explicacao: "Você tem até 1 hora para apagar uma mensagem para todos após enviá-la.",
    icone: <Trash2 size={24} />
  },
  {
    pergunta: "Qual o limite de tempo para apagar mensagem para todos?",
    opcoes: ["15 minutos", "1 hora", "24 horas", "7 dias"],
    correta: 1,
    explicacao: "Após 1 hora, você só consegue apagar a mensagem para você mesmo.",
    icone: <Clock size={24} />
  },
  {
    pergunta: "O que é o 'Modo Avião' no WhatsApp?",
    opcoes: [
      "Ativar para não receber mensagens",
      "Ler mensagens sem enviar confirmação de leitura",
      "Voar no jogo do WhatsApp",
      "Desativar criptografia"
    ],
    correta: 1,
    explicacao: "Com o modo avião, você lê as mensagens sem enviar os tiques azuis de confirmação.",
    icone: <Send size={24} />
  },
  {
    pergunta: "Como silenciar notificações de um grupo?",
    opcoes: [
      "Sair do grupo",
      "Bloquear o grupo", 
      "Usar modo silencioso do grupo (Silenciar notificações)",
      "Desinstalar WhatsApp"
    ],
    correta: 2,
    explicacao: "Vá em Informações do Grupo → Silenciar notificações → Escolha o período.",
    icone: <Bell size={24} />
  }
];

// Ícone de sino
function Bell({ size = 24, className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

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
      {/* Botão principal */}
      <button
        onClick={() => setMenuAberto(!menuAberto)}
        className="p-3 text-white transition-all duration-300 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700"
      >
        <Type size={24} />
      </button>

      {/* Menu de acessibilidade */}
      {menuAberto && (
        <div className="absolute bottom-16 right-0 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl space-y-2 min-w-[300px] animate-slide-up">
          <div className="px-2 mb-2 text-xs text-gray-500">Acessibilidade</div>
          
          {/* Aumentar fonte */}
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

          {/* Diminuir fonte */}
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

          {/* Caixa alta */}
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
    </div>
  );
}

export default function ModuloWhatsApp() {
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

  // Salvar preferências
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

  // Função para aplicar transformações de texto
  const transformText = (text: string) => {
    if (isUppercase) {
      return text.toUpperCase();
    }
    return text;
  };

  if (finalizado) {
    const acertos = respostas.filter((r, i) => r === perguntas[i].correta).length;
    return (
      <div className="flex items-center justify-center w-full h-screen p-4 bg-gradient-to-br from-green-600 to-emerald-800">
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
              transformText("🎉 Perfeito! Você é expert em WhatsApp!")
            ) : acertos >= perguntas.length / 2 ? (
              transformText("👍 Bom trabalho! Continue praticando!")
            ) : (
              transformText("💪 Continue aprendendo, você vai melhorar!")
            )}
          </div>
          <BotaoVoltar
            className="block w-full px-6 py-3 font-bold text-center text-green-600 transition-all duration-300 bg-white rounded-full hover:scale-105"
            label="Voltar ao Início"
          >
            {transformText("Voltar ao Início")}
          </BotaoVoltar>
        </div>
      </div>
    );
  }

  const perguntaAtual = perguntas[passo];

  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-br from-green-600 to-emerald-800">
      {/* Header */}
      <div className="px-4 py-3 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <BotaoVoltar className="p-2 transition-colors rounded-full hover:bg-white/10" />
          <div className="flex-1">
            <h1 className="font-bold text-white" style={{ fontSize: `${fontSize}px` }}>
              {transformText("WhatsApp na Prática")}
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
              <div className='text-center'>Imagem</div>

              <div className="bg-[#075E54] rounded-2xl p-6 text-center">
                {/* Ícone geral para outras perguntas */}
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
                    <span className="font-bold text-white bg-[#075E54] px-3 py-1 rounded-full">
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
                <CheckCircle size={64} className="mx-auto mb-4 text-white" />
              ) : (
                <BanIcon size={64} className="mx-auto mb-4 text-white" />
              )}
              <h3 className="mb-2 font-bold text-white" style={{ fontSize: `${fontSize + 6}px` }}>
                {transformText(acertou ? 'Acertou!' : 'Ops, errou!')}
              </h3>
              <p className="mb-6 font-bold text-white">
                {transformText(perguntaAtual.explicacao)}
              </p>
              
              {/* Botões de controle manual */}
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
                  } py-3 bg-white rounded-xl text-green-600 font-bold hover:bg-white/90 transition-all duration-300`}
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
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.2s ease-out;
        }
        
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}