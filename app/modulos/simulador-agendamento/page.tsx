'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Send, Check, CheckCheck, Phone, Video, 
  MoreVertical, Paperclip, Smile, Mic, 
  Activity, AlignJustify
} from 'lucide-react';

interface Mensagem {
  id: number;
  texto: string;
  tipo: 'bot' | 'usuario';
  timestamp: string;
}

interface DadosAgendamento {
  nome?: string;
  especialidade?: string;
  dataNascimento?: string;
  tipoExame?: string;
  unidade?: string;
  cpf?: string;
}

// Componente de botões de acessibilidade (apenas caixa alta)
function AcessibilidadeButtons({ 
  onToggleUppercase,
  isUppercase 
}: { 
  onToggleUppercase: () => void;
  isUppercase: boolean;
}) {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="fixed z-50 bottom-20 right-4">
      <button
        onClick={() => setMenuAberto(!menuAberto)}
        className="p-3 text-white transition-all duration-300 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700"
      >
        <Activity size={24} />
      </button>

      {menuAberto && (
        <div className="absolute bottom-16 right-0 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl space-y-2 min-w-[180px] animate-slide-up">
          <div className="px-2 mb-2 text-xs text-gray-500">Acessibilidade</div>
          
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

export default function ModuloSimuladorAgendamento() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [etapa, setEtapa] = useState(0);
  const [simulacaoConcluida, setSimulacaoConcluida] = useState(false);
  const [dados, setDados] = useState<DadosAgendamento>({});
  const [isUppercase, setIsUppercase] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Carregar preferência de caixa alta
  useEffect(() => {
    const savedUppercase = localStorage.getItem('isUppercase');
    if (savedUppercase) setIsUppercase(JSON.parse(savedUppercase));
  }, []);

  const handleToggleUppercase = () => {
    const newValue = !isUppercase;
    setIsUppercase(newValue);
    localStorage.setItem('isUppercase', JSON.stringify(newValue));
  };

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  // Mensagem inicial
  useEffect(() => {
    const boasVindas = {
      id: Date.now(),
      texto: "🤖 Olá! Sou o assistente virtual do Saúde Digital App. 🏥\n\nEstou aqui para ajudar você com:\n\n📅 Agendamento de consultas\n🔬 Agendamento de exames\n📊 Resultados de exames\n💬 Falar com atendente\n\nPara começar, digite o número da opção desejada:\n\n0️⃣ - Agendar consulta\n1️⃣ - Agendar exame\n2️⃣ - Ver resultados de exames\n9️⃣ - Falar com atendente\n\n⚡ Digite o número e tecle ENVIAR",
      tipo: 'bot' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMensagens([boasVindas]);
  }, []);

  const transformText = (text: string) => {
    if (isUppercase) {
      return text.toUpperCase();
    }
    return text;
  };

  const adicionarMensagem = (texto: string, tipo: 'bot' | 'usuario') => {
    const novaMensagem = {
      id: Date.now(),
      texto,
      tipo,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMensagens(prev => [...prev, novaMensagem]);
  };

  const processarRespostaBot = (resposta: string) => {
    const opcao = resposta.trim();
    
    switch(etapa) {
      case 0:
        if (opcao === '0') {
          adicionarMensagem("🔹 Agendamento de Consulta\n\nPor favor, informe seu nome completo:", 'bot');
          setEtapa(1);
        } 
        else if (opcao === '1') {
          adicionarMensagem("🔬 Agendamento de Exame\n\nQual tipo de exame você precisa?\n\n1 - Exame de sangue\n2 - Raio-X\n3 - Ultrassom\n4 - Eletrocardiograma\n5 - Outro", 'bot');
          setEtapa(10);
        }
        else if (opcao === '2') {
          adicionarMensagem("📊 Consulta de Resultados\n\nPara acessar seus resultados, informe seu CPF (apenas números):", 'bot');
          setEtapa(20);
        }
        else if (opcao === '9') {
          adicionarMensagem("👨‍⚕️ Atendente Humano\n\nNossa equipe entrará em contato em até 15 minutos.\n\nDigite 0 para voltar ao menu ou 1 para encerrar:", 'bot');
          setEtapa(30);
        }
        else {
          adicionarMensagem("❌ Opção inválida! Digite:\n0 - Consulta\n1 - Exame\n2 - Resultados\n9 - Atendente", 'bot');
        }
        break;

      case 1:
        setDados(prev => ({ ...prev, nome: opcao }));
        adicionarMensagem(`✅ Nome registrado: ${opcao}\n\nConfirme se o nome está correto:\n\n1 - Sim, continuar\n2 - Não, corrigir nome`, 'bot');
        setEtapa(1.5);
        break;

      case 1.5:
        if (opcao === '1') {
          adicionarMensagem("Qual especialidade médica você deseja?\n\n1 - Clínico Geral\n2 - Pediatria\n3 - Cardiologia\n4 - Dermatologia\n5 - Ginecologia\n6 - Ortopedia\n7 - Oftalmologia", 'bot');
          setEtapa(2);
        } else if (opcao === '2') {
          adicionarMensagem("Por favor, digite seu nome completo novamente:", 'bot');
          setEtapa(1);
        } else {
          adicionarMensagem("❌ Opção inválida! Digite 1 (continuar) ou 2 (corrigir):", 'bot');
        }
        break;

      case 2:
        const especialidades: {[key: string]: string} = {
          '1': 'Clínico Geral',
          '2': 'Pediatria',
          '3': 'Cardiologia',
          '4': 'Dermatologia',
          '5': 'Ginecologia',
          '6': 'Ortopedia',
          '7': 'Oftalmologia'
        };
        
        if (especialidades[opcao]) {
          setDados(prev => ({ ...prev, especialidade: especialidades[opcao] }));
          adicionarMensagem(`📋 Especialidade selecionada: ${especialidades[opcao]}\n\nAgora, informe sua data de nascimento (DD/MM/AAAA):`, 'bot');
          setEtapa(3);
        } else {
          adicionarMensagem("❌ Especialidade inválida! Digite um número de 1 a 7:", 'bot');
        }
        break;

      case 3:
        if (validaData(opcao)) {
          setDados(prev => ({ ...prev, dataNascimento: opcao }));
          adicionarMensagem(`📅 Data registrada: ${opcao}\n\n✅ Solicitação de consulta enviada com sucesso!\n\n📌 Resumo da solicitação:\n• Nome: ${dados.nome}\n• Especialidade: ${dados.especialidade}\n• Data de Nascimento: ${opcao}\n\n🔔 Você receberá a confirmação do horário em breve.\n\nDeseja fazer outra solicitação?\n\n0 - Sim (voltar ao menu)\n1 - Não (encerrar)`, 'bot');
          setEtapa(4);
        } else {
          adicionarMensagem("❌ Data inválida! Use o formato DD/MM/AAAA. Exemplo: 25/12/1980", 'bot');
        }
        break;

      case 4:
        if (opcao === '0') {
          setDados({});
          adicionarMensagem("🔄 Voltando ao menu principal...\n\n0 - Consulta\n1 - Exame\n2 - Resultados\n9 - Atendente", 'bot');
          setEtapa(0);
        } else if (opcao === '1') {
          adicionarMensagem("✨ Atendimento finalizado! ✨\n\nObrigado por usar nossos serviços. 💙\n\n*Esta é uma simulação de aprendizado*", 'bot');
          setSimulacaoConcluida(true);
        } else {
          adicionarMensagem("❓ Digite 0 para continuar ou 1 para encerrar:", 'bot');
        }
        break;

      case 10:
        const exames: {[key: string]: string} = {
          '1': 'Exame de Sangue',
          '2': 'Raio-X',
          '3': 'Ultrassom',
          '4': 'Eletrocardiograma',
          '5': 'Outro Exame'
        };
        
        if (exames[opcao]) {
          setDados(prev => ({ ...prev, tipoExame: exames[opcao] }));
          adicionarMensagem(`🔬 Exame selecionado: ${exames[opcao]}\n\nInforme seu nome completo:`, 'bot');
          setEtapa(11);
        } else {
          adicionarMensagem("❌ Exame inválido! Digite um número de 1 a 5:", 'bot');
        }
        break;

      case 11:
        setDados(prev => ({ ...prev, nome: opcao }));
        adicionarMensagem(`✅ Nome registrado: ${opcao}\n\nQual unidade de saúde você prefere?\n\n1 - Unidade Central\n2 - Unidade Norte\n3 - Unidade Sul\n4 - Unidade Leste\n5 - Unidade Oeste`, 'bot');
        setEtapa(12);
        break;

      case 12:
        const unidades: {[key: string]: string} = {
          '1': 'Unidade Central',
          '2': 'Unidade Norte',
          '3': 'Unidade Sul',
          '4': 'Unidade Leste',
          '5': 'Unidade Oeste'
        };
        
        if (unidades[opcao]) {
          setDados(prev => ({ ...prev, unidade: unidades[opcao] }));
          adicionarMensagem(`📍 Unidade selecionada: ${unidades[opcao]}\n\n⚠️ Informações importantes:\n• Jejum de 8 horas para exames de sangue\n• Levar pedido médico\n• Documento com foto\n\n✅ Solicitação enviada! Você receberá a data do exame.\n\nDeseja mais alguma informação?\n\n0 - Menu principal\n1 - Encerrar`, 'bot');
          setEtapa(13);
        } else {
          adicionarMensagem("❌ Unidade inválida! Digite um número de 1 a 5:", 'bot');
        }
        break;

      case 13:
        if (opcao === '0') {
          setDados({});
          adicionarMensagem("🔄 Voltando ao menu principal...\n\n0 - Consulta\n1 - Exame\n2 - Resultados\n9 - Atendente", 'bot');
          setEtapa(0);
        } else if (opcao === '1') {
          adicionarMensagem("✨ Atendimento finalizado! ✨\n\nObrigado pela confiança! 🏥\n\n*Esta é uma simulação de aprendizado*", 'bot');
          setSimulacaoConcluida(true);
        } else {
          adicionarMensagem("❓ Digite 0 para voltar ao menu ou 1 para encerrar:", 'bot');
        }
        break;

      case 20:
        if (opcao.length === 11 && /^\d+$/.test(opcao)) {
          setDados(prev => ({ ...prev, cpf: opcao }));
          adicionarMensagem(`🔍 Buscando resultados para CPF: ***${opcao.slice(-4)}\n\n📊 Resultados disponíveis:\n\n1️⃣ Exame de Sangue - 10/01/2024\n2️⃣ Raio-X Tórax - 05/01/2024\n3️⃣ Ultrassom - 20/12/2023\n\nDigite o número do exame desejado ou 0 para voltar ao menu:`, 'bot');
          setEtapa(21);
        } else {
          adicionarMensagem("❌ CPF inválido! Digite apenas os 11 números do CPF:", 'bot');
        }
        break;

      case 21:
        if (opcao === '0') {
          adicionarMensagem("🔄 Voltando ao menu principal...\n\n0 - Consulta\n1 - Exame\n2 - Resultados\n9 - Atendente", 'bot');
          setEtapa(0);
        } else if (['1', '2', '3'].includes(opcao)) {
          adicionarMensagem(`📄 Solicitação enviada!\n\nO resultado do exame será enviado para seu WhatsApp e e-mail cadastrados.\n\nDeseja mais alguma ajuda?\n\n0 - Menu\n1 - Encerrar`, 'bot');
          setEtapa(22);
        } else {
          adicionarMensagem("❌ Opção inválida! Digite 1, 2, 3 ou 0 para voltar:", 'bot');
        }
        break;

      case 22:
        if (opcao === '0') {
          adicionarMensagem("Menu principal:\n\n0 - Consulta\n1 - Exame\n2 - Resultados\n9 - Atendente", 'bot');
          setEtapa(0);
        } else if (opcao === '1') {
          adicionarMensagem("✅ Atendimento finalizado! Obrigado! 💙", 'bot');
          setSimulacaoConcluida(true);
        } else {
          adicionarMensagem("❌ Opção inválida! Digite 0 (menu) ou 1 (encerrar):", 'bot');
        }
        break;

      case 30:
        if (opcao === '0') {
          adicionarMensagem("Menu principal:\n\n0 - Consulta\n1 - Exame\n2 - Resultados\n9 - Atendente", 'bot');
          setEtapa(0);
        } else if (opcao === '1') {
          adicionarMensagem("✅ Atendimento finalizado! Estamos à disposição! 💙", 'bot');
          setSimulacaoConcluida(true);
        } else {
          adicionarMensagem("❌ Opção inválida! Digite 0 (menu) ou 1 (encerrar):", 'bot');
        }
        break;

      default:
        break;
    }
  };

  const validaData = (data: string) => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(data)) return false;
    
    const [dia, mes, ano] = data.split('/').map(Number);
    const dataObj = new Date(ano, mes - 1, dia);
    
    return dataObj.getFullYear() === ano && 
           dataObj.getMonth() === mes - 1 && 
           dataObj.getDate() === dia &&
           ano >= 1900 && 
           ano <= new Date().getFullYear();
  };

  const handleEnviarMensagem = () => {
    if (inputValue.trim() === '') return;
    
    const mensagemUsuario = inputValue.trim();
    adicionarMensagem(mensagemUsuario, 'usuario');
    
    setTimeout(() => {
      processarRespostaBot(mensagemUsuario);
    }, 500);
    
    setInputValue('');
    
    // Resetar altura do textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensagem();
    }
  };

  const handleReiniciar = () => {
    setSimulacaoConcluida(false);
    setEtapa(0);
    setDados({});
    setMensagens([]);
    const boasVindas = {
      id: Date.now(),
      texto: "🤖 Olá! Sou o assistente virtual do Saúde Digital App. 🏥\n\nEstou aqui para ajudar você com:\n\n📅 Agendamento de consultas\n🔬 Agendamento de exames\n📊 Resultados de exames\n💬 Falar com atendente\n\nPara começar, digite o número da opção desejada:\n\n0️⃣ - Agendar consulta\n1️⃣ - Agendar exame\n2️⃣ - Ver resultados de exames\n9️⃣ - Falar com atendente\n\n⚡ Digite o número e tecle ENVIAR",
      tipo: 'bot' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMensagens([boasVindas]);
  };

  if (simulacaoConcluida) {
    return (
      <div className="flex items-center justify-center w-full h-screen p-4 bg-gradient-to-br from-green-600 to-emerald-800">
        <div className="w-full max-w-md p-8 text-center bg-white/10 backdrop-blur-lg rounded-2xl">
          <div className="mb-4 text-6xl">🎉</div>
          <h2 className="mb-4 text-2xl font-bold text-white">Simulação Concluída!</h2>
          <p className="mb-6 text-white/80">
            Você aprendeu como agendar consultas e exames pelo WhatsApp!
          </p>
          <p className="mb-6 text-sm text-white/60">
            💡 Agora você já sabe como interagir com atendimento virtual
          </p>
          <div className="space-y-3">
            <button
              onClick={handleReiniciar}
              className="w-full px-6 py-3 font-bold text-white transition-all duration-300 rounded-full bg-white/20 hover:bg-white/30"
            >
              🔄 Fazer Nova Simulação
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-6 py-3 font-bold text-green-600 transition-all duration-300 bg-white rounded-full hover:bg-white/90"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#ECE5DD] flex flex-col">
      {/* Header WhatsApp */}
      <div className="bg-[#075E54] text-white px-2 md:px-4 py-2 md:py-4 flex items-center justify-between shadow-lg flex-shrink-0">
        <div className="flex items-center gap-1 md:gap-3">
          <button
            onClick={() => window.location.href = '/'}
            className="p-1 transition-colors rounded-full hover:bg-white/10"
          >
            <ArrowLeft size={20} className="text-white md:hidden" />
            <ArrowLeft size={24} className="hidden text-white md:block" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#25D366] rounded-full flex items-center justify-center">
              <Phone size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold md:text-lg">Saúde Digital App</h1>
              <p className="text-xs text-white/80">Online • Assistente Virtual</p>
            </div>
          </div>
        </div>
        {/** Celular */}
        <div className="flex gap-1 md:hidden md:gap-1">
          <button className="p-1 transition-colors rounded-full hover:bg-white/10"><Video size={16} /></button>
          <button className="p-1 transition-colors rounded-full hover:bg-white/10"><Phone size={16} /></button>
          <button className="p-1 transition-colors rounded-full hover:bg-white/10"><MoreVertical size={16} /></button>
        </div>
        {/** Desktop */}
        <div className="hidden gap-3 md:block md:gap-3">
          <button className="px-3 transition-colors rounded-full hover:bg-white/10"><Video size={22} /></button>
          <button className="px-3 transition-colors rounded-full hover:bg-white/10"><Phone size={20} /></button>
          <button className="px-3 transition-colors rounded-full hover:bg-white/10"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* Área das Mensagens */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 bg-[#ECE5DD]">
        {mensagens.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] flex rounded-2xl p-1.5 ${
                msg.tipo === 'usuario'
                  ? 'bg-[#DCF8C6] text-gray-800 rounded-tr-none'
                  : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
              } text-sm md:text-lg`}
            >
              <div className="mb-4 break-words whitespace-pre-wrap">
                {transformText(msg.texto)}
              </div>
              <div className="text-[10px] text-gray-400 flex justify-end items-end ml-1 mr-1">
                {msg.timestamp}
                {msg.tipo === 'usuario' && <span className="text-[#25D366] ml-1 mb-1"><CheckCheck size={16} /></span>}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#075E54] p-3 flex-shrink-0">
        <div className="flex items-end gap-2 p-2 bg-white rounded-2xl">
          <button className="flex-shrink-0 p-2 transition-colors rounded-full hover:bg-gray-100">
            <Smile size={24} className="text-gray-600" />
          </button>
          <button className="flex-shrink-0 p-2 transition-colors rounded-full hover:bg-gray-100">
            <Paperclip size={24} className="text-gray-600" />
          </button>
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua resposta..."
            rows={1}
            className="flex-1 p-2 text-gray-800 outline-none resize-none max-h-32 min-h-[40px] text-sm md:text-base"
            style={{ fontFamily: 'inherit' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 128) + 'px';
            }}
          />
          {inputValue.trim() ? (
            <button
              onClick={handleEnviarMensagem}
              className="bg-[#25D366] p-2 rounded-full hover:bg-[#20B959] transition-colors flex-shrink-0"
            >
              <Send size={24} className="text-white" />
            </button>
          ) : (
            <button className="flex-shrink-0 p-2 transition-colors rounded-full hover:bg-gray-100">
              <Mic size={24} className="text-gray-600" />
            </button>
          )}
        </div>
      </div>

      <AcessibilidadeButtons 
        onToggleUppercase={handleToggleUppercase}
        isUppercase={isUppercase}
      />

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