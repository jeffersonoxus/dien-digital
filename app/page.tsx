'use client';

import { useState } from 'react';
import { 
  Smartphone, MessageCircle, Shield, 
  TrendingUp, BookOpen, ChevronRight, 
  Wifi, Battery, Zap, Calendar,
  CalendarCheck, Activity, Wallet,
  Gamepad2, HelpCircle, Info,
  Clock, CheckCircle, Car, Navigation,
  Mail, DollarSign
} from 'lucide-react';

interface Modulo {
  id: string;
  titulo: string;
  descricao: string;
  icone: React.ReactNode;
  cor: string;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
  tipo: 'quiz' | 'simulador' | 'informacao';
  status: 'disponivel' | 'em-breve'; // Adicionar status
}

const modulos: Modulo[] = [
  // SIMULADORES
  {
    id: 'simulador-agendamento',
    titulo: 'Simulador de Agendamentos',
    descricao: 'Aprenda na prática como marcar consultas e exames pelo WhatsApp',
    icone: <CalendarCheck size={32} />,
    cor: 'from-teal-500 to-cyan-600',
    nivel: 'Iniciante',
    tipo: 'simulador',
    status: 'disponivel' // DISPONÍVEL
  },
  {
    id: 'simulador-uber',
    titulo: 'Simulador Uber',
    descricao: 'Aprenda a pedir carros por aplicativo na prática',
    icone: <Car size={32} />,
    cor: 'from-gray-800 to-black',
    nivel: 'Iniciante',
    tipo: 'simulador',
    status: 'disponivel' // DISPONÍVEL
  },
  {
    id: 'email',
    titulo: 'Simulador de E-mail',
    descricao: 'Aprenda a usar o Gmail: escrever, anexar fotos e identificar golpes',
    icone: <Mail size={32} />,
    cor: 'from-red-600 to-orange-600',
    nivel: 'Iniciante',
    tipo: 'simulador',
    status: 'disponivel'
  },
  {
    id: 'govbr',
    titulo: 'Simulador Gov.br',
    descricao: 'Acesse serviços públicos digitais: CPF, INSS, Carteira de Trabalho e mais',
    icone: <Shield size={32} />,
    cor: 'from-blue-700 to-blue-900',
    nivel: 'Intermediário',
    tipo: 'simulador',
    status: 'disponivel'
  },
  {
    id: 'pix',
    titulo: 'Simulador PIX',
    descricao: 'Aprenda a fazer e receber PIX, usar Copia e Cola e evitar golpes',
    icone: <DollarSign size={32} />,
    cor: 'from-green-500 to-teal-600',
    nivel: 'Iniciante',
    tipo: 'simulador',
    status: 'disponivel'
  },
  
  // QUIZZES
  {
    id: 'whatsapp',
    titulo: 'WhatsApp na Prática',
    descricao: 'Aprenda a usar o WhatsApp com segurança e eficiência no dia a dia',
    icone: <MessageCircle size={32} />,
    cor: 'from-green-600 to-emerald-600',
    nivel: 'Iniciante',
    tipo: 'quiz',
    status: 'em-breve' // EM BREVE
  },
  {
    id: 'conscientizacao-financeira',
    titulo: 'Conscientização Financeira',
    descricao: 'Aprenda a identificar golpes, evitar agiotas e fazer escolhas financeiras seguras',
    icone: <Wallet size={32} />,
    cor: 'from-yellow-600 to-amber-700',
    nivel: 'Intermediário',
    tipo: 'quiz',
    status: 'disponivel' // DISPONÍVEL
  },
  
  // CONTEÚDOS INFORMATIVOS
  {
    id: 'apps-uteis',
    titulo: 'Apps Úteis do Dia a Dia',
    descricao: 'Descubra aplicativos que facilitam sua rotina',
    icone: <Smartphone size={32} />,
    cor: 'from-orange-600 to-red-600',
    nivel: 'Iniciante',
    tipo: 'informacao',
    status: 'em-breve' // EM BREVE
  },
  {
    id: 'seguranca',
    titulo: 'Segurança Digital',
    descricao: 'Proteja seus dados e evite golpes online',
    icone: <Shield size={32} />,
    cor: 'from-blue-600 to-cyan-600',
    nivel: 'Intermediário',
    tipo: 'informacao',
    status: 'em-breve' // EM BREVE
  },
  {
    id: 'redes-sociais',
    titulo: 'Redes Sociais Conscientes',
    descricao: 'Use as redes sociais de forma saudável e produtiva',
    icone: <TrendingUp size={32} />,
    cor: 'from-purple-600 to-pink-600',
    nivel: 'Intermediário',
    tipo: 'informacao',
    status: 'em-breve' // EM BREVE
  }
];

// Componente de seção
function Secao({ titulo, icone, cor, children }: { 
  titulo: string; 
  icone: React.ReactNode; 
  cor: string;
  children: React.ReactNode;
}) {
  if (!children || (Array.isArray(children) && children.length === 0)) {
    return null;
  }
  
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-xl bg-gradient-to-br ${cor} bg-opacity-20`}>
          {icone}
        </div>
        <h2 className="text-2xl font-bold text-white">{titulo}</h2>
        <div className="flex-1 h-px bg-white/10"></div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  );
}

interface StatCardProps {
  valor: string | number; // Pode ser texto como "6/10" ou número como 6
  legenda: string;
  corTexto: string;
  delay?: string;        // O "?" indica que é opcional
}

function StatCard({ valor, legenda, corTexto, delay = "0" }: StatCardProps) {
  return (
    <div 
      className="p-1 text-center transition-all duration-300 border md:p-4 bg-white/5 backdrop-blur-sm border-white/30 rounded-2xl hover:bg-white/10"
      style={{ animationDelay: delay }}
    >
      <div className={`text-lg md:text-2xl lg:text-3xl font-bold ${corTexto}`}>
        {valor}
      </div>
      <div className="text-xs font-medium md:text-lg text-white/80">
        {legenda}
      </div>
    </div>
  );
}

// Componente de card do módulo
function CardModulo({ modulo, onClick }: { modulo: Modulo; onClick: () => void }) {
  const isDisponivel = modulo.status === 'disponivel';
  
  return (
    <div
      onClick={isDisponivel ? onClick : undefined}
      className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${modulo.cor} p-[2px] transition-all duration-300 ${
        isDisponivel 
          ? 'cursor-pointer hover:scale-105 hover:shadow-2xl active:scale-95' 
          : 'cursor-not-allowed opacity-60'
      }`}
    >
      <div className="h-full p-6 transition-all duration-300 bg-slate-900/90 backdrop-blur-sm rounded-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className={`text-white transition-transform duration-300 ${isDisponivel ? 'hover:scale-105' : ''}`}>
            {modulo.icone}
          </div>
          <div className="flex gap-2">
            {/* Badge de status */}
            {modulo.status === 'disponivel' ? (
              <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded-full bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <CheckCircle size={12} />
                Disponível
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-yellow-400 border rounded-full bg-yellow-500/20 border-yellow-500/30">
                <Clock size={12} />
                Em breve
              </span>
            )}
            
            {/* Badge de nível */}
            <span className="px-2 py-1 text-xs font-medium text-white border rounded-full bg-white/20 border-white/30">
              {modulo.nivel}
            </span>
          </div>
        </div>
        
        <h3 className="mb-2 text-xl font-bold text-white">{modulo.titulo}</h3>
        <p className="mb-4 text-sm text-white/80">{modulo.descricao}</p>
        
        <div className="flex justify-end mt-4">
          <ChevronRight size={20} className={`text-white/40 transition-transform duration-300 ${isDisponivel ? 'group-hover:translate-x-1' : ''}`} />
        </div>
        
      </div>
    </div>
  );
}

export default function Home() {
  const [moduloSelecionado, setModuloSelecionado] = useState<string | null>(null);

  const handleModuloClick = (moduloId: string) => {
    setModuloSelecionado(moduloId);
  };

  if (moduloSelecionado) {
    const ModuloComponent = require(`./modulos/${moduloSelecionado}/page`).default;
    return <ModuloComponent />;
  }

  // Separar módulos por tipo e status
  const simuladores = modulos.filter(m => m.tipo === 'simulador');
  const quizzes = modulos.filter(m => m.tipo === 'quiz');
  const informacoes = modulos.filter(m => m.tipo === 'informacao');
  
  // Contagem de disponíveis
  const disponiveis = modulos.filter(m => m.status === 'disponivel').length;
  const total = modulos.length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

      <div className="px-4 pt-4 pb-12 mx-auto md:max-w-7xl lg:max-w-9xl md:pt-10">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-white/5 backdrop-blur-sm">
            <BookOpen strokeWidth={2.4} size={18} className="text-emerald-400" />
            <span className="text-sm font-medium text-white/90">Letramento Digital</span>
          </div>
          <h1 className="mb-4 text-5xl font-black text-transparent md:text-6xl bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 bg-clip-text">
            EJA-RL
          </h1>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-white/80">
            Aprenda sobre tecnologia no seu ritmo.
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4 mx-auto mb-12 md:max-w-5xl lg:max-w-7xl md:grid-cols-4 animate-slide-up">
          
          <StatCard 
            valor={simuladores.length} 
            legenda="Simuladores" 
            corTexto="text-teal-400" 
          />

          <StatCard 
            valor={quizzes.length} 
            legenda="Quizzes" 
            corTexto="text-emerald-400" 
          />

          <StatCard 
            valor={informacoes.length} 
            legenda="Informativos" 
            corTexto="text-blue-400" 
          />

          <StatCard 
            valor={`${disponiveis}/${total}`} 
            legenda="Disponíveis" 
            corTexto="text-yellow-400" 
          />

        </div>

        {/* Seção Simuladores */}
        {simuladores.length > 0 && (
          <Secao titulo="Simuladores" icone={<Gamepad2 size={28} />} cor="from-teal-500 to-cyan-600">
            {simuladores.map((modulo) => (
              <CardModulo 
                key={modulo.id} 
                modulo={modulo} 
                onClick={() => handleModuloClick(modulo.id)} 
              />
            ))}
          </Secao>
        )}

        {/* Seção Quizzes */}
        {quizzes.length > 0 && (
          <Secao titulo="Quizzes" icone={<HelpCircle size={28} />} cor="from-emerald-500 to-green-600">
            {quizzes.map((modulo) => (
              <CardModulo 
                key={modulo.id} 
                modulo={modulo} 
                onClick={() => handleModuloClick(modulo.id)} 
              />
            ))}
          </Secao>
        )}

        {/* Seção Informativos */}
        {informacoes.length > 0 && (
          <Secao titulo="Informativos" icone={<Info size={28} />} cor="from-blue-500 to-cyan-600">
            {informacoes.map((modulo) => (
              <CardModulo 
                key={modulo.id} 
                modulo={modulo} 
                onClick={() => handleModuloClick(modulo.id)} 
              />
            ))}
          </Secao>
        )}
        
      </div>
      
      <footer className="w-full py-8 mt-12 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="flex flex-col items-center gap-1 tracking-wide md:flex-row md:gap-3 text-white/50">
              <span className="font-medium text-white/80">
                Projeto de Letramento Digital
              </span>
              <span className="hidden md:block text-white/40">|</span>
              <span className="text-sm uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded bg-gradient-to-r from-green-400 via-esmerald-100 to-green-400 bg-clip-text text-transparent">
                EJA-RL
              </span>
            </div>
            <p className="flex items-center gap-1 text-xs font-light text-white/60">
              Desenvolvido por Jefferson
            </p>
            <span className="text-[10px] text-white/40 uppercase tracking-tighter">
              © {new Date().getFullYear()} — Todos os direitos reservados
            </span>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </main>
  );
}