'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, X, ChevronRight, Star, MapPin, Clock,
  Navigation, Car, Shield, Phone, MessageCircle,
  User, Search, Activity, AlignJustify, Home, Briefcase,
  GraduationCap, Heart, DollarSign, Bike
} from 'lucide-react';

// ─── Tipos ────────────────────────────────────────────────
type Tela = 'home' | 'destino' | 'buscando' | 'aCaminho' | 'viagem' | 'chegou';

interface Local {
  nome: string;
  endereco: string;
  cidade: string;
  regiao: 'maceio' | 'riolargo';
}

interface Motorista {
  nome: string;
  placa: string;
  carro: string;
  cor: string;
  avaliacao: number;
  viagens: number;
}

interface OpcaoViagem {
  id: string;
  nome: string;
  icone: React.ReactNode;
  info: string;
  multiplicador: number;
}

// ─── Dados ────────────────────────────────────────────────
const ORIGEM: Local = {
  nome: 'Sua localizacao',
  endereco: 'Rua Sao Jose, 45 - Centro',
  cidade: 'Rio Largo - AL',
  regiao: 'riolargo'
};

const DESTINOS: Local[] = [
  { nome: 'Aeroporto Zumbi dos Palmares', endereco: 'Rod. BR 104, Km 91 - Tabuleiro do Pinto', cidade: 'Rio Largo - AL', regiao: 'riolargo' },
  { nome: 'Shopping Patio Maceio', endereco: 'Av. Menino Marcelo, 3800 - Cid. Universitaria', cidade: 'Maceio - AL', regiao: 'maceio' },
  { nome: 'Hospital Metropolitano', endereco: 'Av. Menino Marcelo, 9100 - Cid. Universitaria', cidade: 'Maceio - AL', regiao: 'maceio' },
  { nome: 'Praia de Ponta Verde', endereco: 'Av. Silvio Carlos Viana, 1000 - Ponta Verde', cidade: 'Maceio - AL', regiao: 'maceio' },
  { nome: 'Centro de Maceio', endereco: 'Rua do Comercio, 200 - Centro', cidade: 'Maceio - AL', regiao: 'maceio' },
  { nome: 'Estacao Ferroviaria', endereco: 'Av. Presidente Vargas - Centro', cidade: 'Rio Largo - AL', regiao: 'riolargo' },
  { nome: 'IFAL Campus Rio Largo', endereco: 'Rod. BR 104, Km 89 - Cruzeiro do Sul', cidade: 'Rio Largo - AL', regiao: 'riolargo' },
  { nome: 'Terminal Rodoviario Joao Paulo II', endereco: 'Av. Leste, s/n - Feitosa', cidade: 'Maceio - AL', regiao: 'maceio' },
  { nome: 'Orla de Pajucara', endereco: 'Av. Dr. Antonio Gouveia, 1000 - Pajucara', cidade: 'Maceio - AL', regiao: 'maceio' },
  { nome: 'Prefeitura de Rio Largo', endereco: 'Praca da Matriz, s/n - Centro', cidade: 'Rio Largo - AL', regiao: 'riolargo' },
];

const CASA: Local = { nome: 'Casa', endereco: 'Rua Sao Jose, 45 - Centro', cidade: 'Rio Largo - AL', regiao: 'riolargo' };
const TRABALHO: Local = { nome: 'Trabalho', endereco: 'Rua do Comercio, 200 - Centro', cidade: 'Maceio - AL', regiao: 'maceio' };
const ESCOLA: Local = { nome: 'Escola', endereco: 'IFAL Campus Rio Largo - Rod. BR 104, Km 89', cidade: 'Rio Largo - AL', regiao: 'riolargo' };
const HOSPITAL: Local = { nome: 'Hospital', endereco: 'Hospital Metropolitano - Av. Menino Marcelo, 9100', cidade: 'Maceio - AL', regiao: 'maceio' };

const OPCOES: OpcaoViagem[] = [
  { id: 'uberx', nome: 'UberX', info: 'Ate 4 pessoas', multiplicador: 1.0,
    icone: <div className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-xl"><Car size={22} className="text-white" /></div> },
  { id: 'comfort', nome: 'Comfort', info: 'Carro mais novo, mais espaco', multiplicador: 1.4,
    icone: <div className="flex items-center justify-center w-10 h-10 bg-blue-700 rounded-xl"><Car size={22} className="text-white" /></div> },
  { id: 'black', nome: 'Black', info: 'Premium, maximo conforto', multiplicador: 2.2,
    icone: <div className="flex items-center justify-center w-10 h-10 bg-black rounded-xl border border-gray-600"><Star size={22} className="text-white" fill="#fff" /></div> },
  { id: 'moto', nome: 'Moto', info: '1 pessoa, mais rapido', multiplicador: 0.6,
    icone: <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-xl"><Bike size={22} className="text-white" /></div> },
];

const MOTORISTA_BASE: Motorista = {
  nome: 'Jose Cicero dos Santos',
  placa: 'QWE-5F89',
  carro: 'Toyota Corolla Branco',
  cor: 'Branco',
  avaliacao: 4.92,
  viagens: 3840
};

function getPrecoBase(origem: Local, destino: Local): number {
  const mesmaCidade = origem.regiao === destino.regiao;
  const dist = mesmaCidade ? 12 : 28;
  const hora = new Date().getHours();
  const multiplicadorHorario = (hora >= 7 && hora <= 9) || (hora >= 17 && hora <= 19) ? 1.5 : 1.0;
  return Math.round(dist * 1.45 * multiplicadorHorario * 100) / 100;
}

function getTempoEstimado(origem: Local, destino: Local): string {
  const mesmaCidade = origem.regiao === destino.regiao;
  const hora = new Date().getHours();
  const pico = (hora >= 7 && hora <= 9) || (hora >= 17 && hora <= 19);
  const base = mesmaCidade ? (pico ? 18 : 10) : (pico ? 35 : 22);
  return `${base} min`;
}

// ─── Mapa SVG ─────────────────────────────────────────────
function MapaFundo({ origem, destino, className }: { origem?: Local; destino?: Local; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className || ''}`} style={{ background: '#e8e4dc' }}>
      <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice">
        {/* Ruas horizontais principais */}
        <line x1="0" y1="80" x2="400" y2="80" stroke="#fff" strokeWidth="3" />
        <line x1="0" y1="180" x2="400" y2="180" stroke="#fff" strokeWidth="3" />
        <line x1="0" y1="280" x2="400" y2="280" stroke="#fff" strokeWidth="3" />
        <line x1="0" y1="380" x2="400" y2="380" stroke="#fff" strokeWidth="3" />
        <line x1="0" y1="480" x2="400" y2="480" stroke="#fff" strokeWidth="3" />
        <line x1="0" y1="580" x2="400" y2="580" stroke="#fff" strokeWidth="3" />

        {/* Ruas verticais principais */}
        <line x1="80" y1="0" x2="80" y2="700" stroke="#fff" strokeWidth="3" />
        <line x1="180" y1="0" x2="180" y2="700" stroke="#fff" strokeWidth="3" />
        <line x1="260" y1="0" x2="260" y2="700" stroke="#fff" strokeWidth="3" />
        <line x1="340" y1="0" x2="340" y2="700" stroke="#fff" strokeWidth="3" />

        {/* Ruas secundarias tracejadas */}
        <line x1="130" y1="0" x2="130" y2="700" stroke="#fff" strokeWidth="1.5" strokeDasharray="6,4" />
        <line x1="220" y1="0" x2="220" y2="700" stroke="#fff" strokeWidth="1.5" strokeDasharray="6,4" />
        <line x1="300" y1="0" x2="300" y2="700" stroke="#fff" strokeWidth="1.5" strokeDasharray="6,4" />
        <line x1="0" y1="130" x2="400" y2="130" stroke="#fff" strokeWidth="1.5" strokeDasharray="6,4" />
        <line x1="0" y1="230" x2="400" y2="230" stroke="#fff" strokeWidth="1.5" strokeDasharray="6,4" />
        <line x1="0" y1="330" x2="400" y2="330" stroke="#fff" strokeWidth="1.5" strokeDasharray="6,4" />
        <line x1="0" y1="430" x2="400" y2="430" stroke="#fff" strokeWidth="1.5" strokeDasharray="6,4" />
        <line x1="0" y1="530" x2="400" y2="530" stroke="#fff" strokeWidth="1.5" strokeDasharray="6,4" />

        {/* Quarteiroes verdes */}
        {[[85, 85, 90, 90], [185, 85, 70, 90], [265, 85, 70, 90], [85, 185, 90, 90], [185, 185, 70, 90], [265, 185, 70, 90], [85, 285, 90, 90], [185, 285, 70, 90], [265, 285, 70, 90], [85, 385, 90, 90], [185, 385, 70, 90], [265, 385, 70, 90], [85, 485, 90, 90], [185, 485, 70, 90], [265, 485, 70, 90], [85, 585, 90, 90], [185, 585, 70, 90], [265, 585, 70, 90]].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill="#c8e6c9" opacity="0.4" rx="2" />
        ))}

        {/* Edificios */}
        {[[90, 90, 18, 22], [120, 95, 18, 18], [150, 90, 14, 25], [190, 90, 16, 20], [215, 95, 18, 16], [270, 90, 20, 22], [300, 92, 16, 18], [92, 190, 20, 18], [122, 195, 16, 22], [192, 190, 18, 20], [218, 190, 16, 16], [270, 192, 22, 18], [295, 195, 18, 14], [88, 290, 20, 22], [120, 292, 18, 16], [190, 290, 16, 20], [220, 292, 18, 16], [270, 290, 22, 20], [300, 295, 14, 18], [90, 390, 18, 16], [122, 395, 18, 20], [192, 390, 16, 22], [218, 392, 18, 16], [272, 390, 20, 18], [88, 490, 22, 18], [120, 492, 16, 20], [190, 490, 18, 22], [220, 495, 20, 16], [272, 490, 16, 22], [92, 590, 18, 18], [122, 592, 18, 20], [192, 590, 16, 22], [218, 592, 20, 16], [272, 595, 18, 18]].map(([x, y, w, h], i) => (
          <rect key={`b${i}`} x={x} y={y} width={w} height={h} fill="#bdbdbd" opacity="0.5" rx="1" />
        ))}

        {/* Rio sinuoso no canto inferior direito */}
        <path d="M300,500 Q330,520 310,560 Q290,590 320,620 Q340,640 360,680 Q370,700 380,700" fill="none" stroke="#90caf9" strokeWidth="14" opacity="0.4" />
        <path d="M310,500 Q340,520 320,560 Q300,590 330,620 Q350,640 370,680 Q380,700 390,700" fill="none" stroke="#90caf9" strokeWidth="8" opacity="0.3" />
      </svg>

      {/* Origem */}
      <div className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2" style={{ top: '52%', left: '30%' }}>
        <div className="relative">
          <div className="absolute w-10 h-10 bg-blue-300 rounded-full opacity-30 animate-ping" />
          <div className="w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-lg" />
        </div>
      </div>

      {/* Destino */}
      {destino && (
        <div className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2" style={{ top: '22%', left: '68%' }}>
          <MapPin size={24} className="text-red-500 drop-shadow-md" fill="#ef4444" strokeWidth={1.5} />
        </div>
      )}

      {/* Rota tracejada */}
      {destino && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice">
          <path d="M120,364 Q200,260 260,185 Q272,175 272,154" fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray="8,5" opacity="0.5" />
        </svg>
      )}
    </div>
  );
}

// ─── Acessibilidade ──────────────────────────────────────
function BtnAcessibilidade({ onToggle, isActive }: { onToggle: () => void; isActive: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed z-50 bottom-24 right-4">
      <button onClick={() => setOpen(!open)}
        className="p-3 text-white bg-gray-800 rounded-full shadow-lg hover:bg-gray-900">
        <Activity size={24} />
      </button>
      {open && (
        <div className="absolute right-0 p-3 space-y-2 bg-white rounded-2xl shadow-xl bottom-16 min-w-[200px] animate-slide-up">
          <p className="px-2 text-xs text-gray-400">Acessibilidade</p>
          <button onClick={() => { onToggle(); setOpen(false); }}
            className="flex items-center w-full gap-3 px-3 py-2 rounded-xl hover:bg-gray-100">
            <AlignJustify size={18} className="text-gray-700" />
            <span className="text-sm text-gray-700">Texto em CAIXA ALTA</span>
            {isActive && <span className="ml-auto text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Ativo</span>}
          </button>
        </div>
      )}
      <style jsx>{`
        .animate-slide-up { animation: slideUp 0.2s ease-out; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════
export default function SimuladorUber() {
  const [tela, setTela] = useState<Tela>('home');
  const [destino, setDestino] = useState<Local | null>(null);
  const [busca, setBusca] = useState('');
  const [opcaoId, setOpcaoId] = useState('uberx');
  const [pagamento, setPagamento] = useState('pix');
  const [progresso, setProgresso] = useState(0);
  const [avaliacao, setAvaliacao] = useState(5);
  const [isUppercase, setIsUppercase] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem('isUppercase');
    if (s) setIsUppercase(JSON.parse(s));
  }, []);

  const toggleUppercase = useCallback(() => {
    setIsUppercase(v => {
      const nv = !v;
      localStorage.setItem('isUppercase', JSON.stringify(nv));
      return nv;
    });
  }, []);

  const txt = useCallback((s: string) => (isUppercase ? s.toUpperCase() : s), [isUppercase]);
  const resetar = useCallback(() => { setDestino(null); setBusca(''); setProgresso(0); }, []);

  const precoBase = getPrecoBase(ORIGEM, destino || ORIGEM);
  const tempoBase = getTempoEstimado(ORIGEM, destino || ORIGEM);

  const opcaoAtual = OPCOES.find(o => o.id === opcaoId) || OPCOES[0];

  // Viagem - barra de progresso
  useEffect(() => {
    if (tela !== 'viagem') return;
    const interval = setInterval(() => {
      setProgresso(p => {
        if (p >= 100) { clearInterval(interval); setTela('chegou'); return 100; }
        return p + 1;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [tela]);

  // Buscando -> motorista a caminho
  useEffect(() => {
    if (tela !== 'buscando') return;
    const timeout = setTimeout(() => setTela('aCaminho'), 5000);
    return () => clearTimeout(timeout);
  }, [tela]);

  // Motorista a caminho -> usuario decide iniciar
  // (manual via botao)

  const destinosFiltrados = busca
    ? DESTINOS.filter(d =>
        d.nome.toLowerCase().includes(busca.toLowerCase()) ||
        d.endereco.toLowerCase().includes(busca.toLowerCase())
      )
    : DESTINOS;

  // ─── RENDER ────────────────────────────────────────────
  const voltarHome = () => { resetar(); setTela('home'); };

  if (tela === 'home') {
    return (
      <div className="relative h-screen w-full max-w-md mx-auto overflow-hidden shadow-2xl md:rounded-3xl"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <MapaFundo origem={ORIGEM} destino={destino || undefined} className="absolute inset-0" />

        {/* Botao voltar flutuante */}
        <button onClick={() => window.location.href = '/'}
          className="absolute z-20 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg top-4 left-4 hover:bg-gray-100">
          <ArrowLeft size={22} className="text-gray-700" />
        </button>

        {!destino ? (
          /* Home sem destino */
          <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pt-6 pb-8 bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                <User size={20} className="text-gray-600" />
              </div>
              <p className="font-semibold text-gray-800">{txt('Ola, bom dia!')}</p>
            </div>
            <button onClick={() => { setBusca(''); setTela('destino'); }}
              className="flex items-center gap-3 w-full p-4 bg-gray-50 rounded-2xl hover:bg-gray-100">
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                <div className="w-0.5 h-7 bg-gray-300" />
                <div className="w-2.5 h-2.5 bg-black rounded-full" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-800 truncate">{txt(ORIGEM.endereco)}</p>
                <p className="text-xs text-gray-400">{txt('Para onde?')}</p>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          </div>
        ) : (
          /* Home com destino */
          <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pt-6 pb-8 bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setDestino(null)}
                className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200">
                <X size={20} className="text-gray-600" />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{txt(destino.nome)}</p>
                <p className="text-xs text-gray-400 truncate">{txt(destino.endereco)}</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              {OPCOES.map(op => {
                const preco = Math.round(precoBase * op.multiplicador * 100) / 100;
                return (
                  <button key={op.id} onClick={() => setOpcaoId(op.id)}
                    className={`flex items-center gap-3 w-full p-3 rounded-2xl border-2 transition-all ${
                      opcaoId === op.id ? 'border-gray-800 bg-gray-50' : 'border-transparent bg-gray-50 hover:bg-gray-100'
                    }`}>
                    {op.icone}
                    <div className="flex-1 text-left">
                      <p className="text-sm font-bold text-gray-800">{op.multiplicador === 2.2 ? 'Uber ' : ''}{op.nome}</p>
                      <p className="text-xs text-gray-400">{txt(op.info)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-800">R$ {preco.toFixed(2).replace('.', ',')}</p>
                      <p className="text-xs text-gray-400">{tempoBase}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Forma de pagamento */}
            <p className="mb-2 text-xs font-semibold text-gray-400 uppercase">{txt('Forma de pagamento')}</p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { id: 'pix', label: 'PIX', icon: '💠' },
                { id: 'debito', label: 'Debito', icon: '💳' },
                { id: 'credito', label: 'Credito', icon: '🏦' },
                { id: 'dinheiro', label: 'Dinheiro', icon: '💵' },
              ].map(pg => (
                <button key={pg.id} onClick={() => setPagamento(pg.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                    pagamento === pg.id
                      ? 'border-gray-800 bg-gray-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}>
                  <span className="text-xl">{pg.icon}</span>
                  <span className="text-[11px] font-semibold text-gray-700">{txt(pg.label)}</span>
                </button>
              ))}
            </div>

            <button onClick={() => { setProgresso(0); setTela('buscando'); }}
              className="w-full py-4 text-lg font-bold text-white bg-gray-900 rounded-2xl hover:bg-gray-800 active:scale-95 transition-all">
              {txt(`Confirmar ${opcaoAtual.nome.toUpperCase()}`)}
            </button>
          </div>
        )}
        <BtnAcessibilidade onToggle={toggleUppercase} isActive={isUppercase} />
      </div>
    );
  }

  if (tela === 'destino') {
    return (
      <div className="relative h-screen w-full max-w-md mx-auto overflow-hidden bg-white shadow-2xl md:rounded-3xl"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => { setDestino(null); setTela('home'); }} className="p-1">
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-800">{txt('Para onde?')}</h1>
          </div>
          <div className="flex items-center gap-3 p-3 mb-2 bg-gray-50 rounded-xl">
            <Search size={20} className="text-gray-400" />
            <input type="text" value={busca} onChange={e => setBusca(e.target.value)}
              placeholder={txt('Buscar destino...')} autoFocus
              className="flex-1 text-gray-800 bg-transparent outline-none" />
            {busca && <button onClick={() => setBusca('')}><X size={18} className="text-gray-400" /></button>}
          </div>
          {!busca && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { label: 'Casa', icon: <Home size={16} />, local: CASA },
                { label: 'Trabalho', icon: <Briefcase size={16} />, local: TRABALHO },
                { label: 'Escola', icon: <GraduationCap size={16} />, local: ESCOLA },
                { label: 'Hospital', icon: <Heart size={16} />, local: HOSPITAL },
              ].map((f, i) => (
                <button key={i} onClick={() => { setDestino(f.local); setTela('home'); }}
                  className="flex items-center gap-1.5 flex-shrink-0 px-3 py-2 text-sm bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200">
                  {f.icon} {txt(f.label)}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 overflow-auto">
          <p className="px-4 mb-2 text-xs font-semibold text-gray-400">{txt('DESTINOS EM RIO LARGO E MACEIO')}</p>
          {destinosFiltrados.map((d, i) => (
            <button key={i} onClick={() => { setDestino(d); setTela('home'); }}
              className="flex items-center gap-3 w-full p-4 text-left hover:bg-gray-50 border-b border-gray-50">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                <MapPin size={20} className="text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{txt(d.nome)}</p>
                <p className="text-xs text-gray-400 truncate">
                  {txt(d.endereco)} • {d.cidade}
                </p>
              </div>
            </button>
          ))}
          {busca && destinosFiltrados.length === 0 && (
            <div className="p-8 text-center">
              <MapPin size={40} className="mx-auto mb-2 text-gray-300" />
              <p className="text-gray-400">{txt('Nenhum destino encontrado')}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── BUSCANDO ──────────────────────────────────────────
  if (tela === 'buscando') {
    return (
      <div className="relative h-screen w-full max-w-md mx-auto overflow-hidden bg-white shadow-2xl md:rounded-3xl"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div className="flex flex-col items-center justify-center h-full px-5 text-center">
          <button onClick={voltarHome} className="absolute p-2 top-4 left-4 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <div className="w-16 h-16 mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Car size={32} className="text-gray-700" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-800">{txt('Buscando motorista...')}</h2>
          <p className="mb-1 text-sm text-gray-500">{txt('Procurando o motorista mais proximo')}</p>
          <p className="text-xs text-gray-400">
            {destino ? txt(destino.nome) : ''}
          </p>
          <div className="flex justify-center gap-2 mt-6">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-3 h-3 bg-gray-800 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
          <style jsx>{`
            .animate-bounce { animation: bounceDots 1.2s infinite; }
            @keyframes bounceDots {
              0%, 80%, 100% { transform: translateY(0); opacity: 0.3; }
              40% { transform: translateY(-12px); opacity: 1; }
            }
          `}</style>
          <p className="mt-6 text-sm text-gray-400">{txt('Tempo estimado: 2-5 min')}</p>
        </div>
      </div>
    );
  }

  // ─── MOTORISTA A CAMINHO ──────────────────────────────
  if (tela === 'aCaminho') {
    const tempoChegada = 10;

    return (
      <div className="relative h-screen w-full max-w-md mx-auto overflow-hidden bg-white shadow-2xl md:rounded-3xl"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div className="flex flex-col h-full">
          <div className="px-5 py-4 bg-gray-50 border-b">
            <button onClick={voltarHome} className="p-1 mb-3"><ArrowLeft size={24} className="text-gray-700" /></button>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={32} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-lg font-bold text-gray-800">{txt(MOTORISTA_BASE.nome)}</p>
                  <p className="text-sm font-bold text-blue-600">{tempoChegada} min</p>
                </div>
                <p className="text-sm text-gray-500">{MOTORISTA_BASE.carro} • {MOTORISTA_BASE.placa}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={14} className="text-yellow-500" fill="#eab308" />
                  <span className="text-sm font-semibold text-gray-700">{MOTORISTA_BASE.avaliacao}</span>
                  <span className="text-xs text-gray-400">• {MOTORISTA_BASE.viagens} {txt('viagens')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de progresso de chegada */}
          <div className="px-5 pt-6 pb-2">
            <p className="mb-2 text-sm text-gray-500">{txt('Motorista a caminho do ponto de partida')}</p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full animate-progress-bar" />
            </div>
            <style jsx>{`
              .animate-progress-bar { animation: fillBar 10s linear forwards; }
              @keyframes fillBar { from { width: 0%; } to { width: 100%; } }
            `}</style>
          </div>

          <div className="flex items-center gap-4 p-4">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-3 h-3 bg-blue-600 rounded-full" />
              <div className="w-0.5 h-12 bg-gray-300" />
              <div className="w-3 h-3 bg-gray-800 rounded-full" />
            </div>
            <div className="flex-1 space-y-6">
              <p className="text-sm font-semibold text-gray-800">{txt(ORIGEM.endereco)}</p>
              <div>
                <p className="text-sm font-semibold text-gray-800">{destino ? txt(destino.nome) : ''}</p>
                <p className="text-xs text-gray-400">{destino ? txt(destino.endereco) : ''}</p>
              </div>
            </div>
          </div>

          <div className="flex-1" />

          <div className="p-4 space-y-2 bg-white border-t">
            <div className="flex gap-2">
              <button className="flex items-center justify-center gap-2 flex-1 py-3 bg-gray-100 rounded-2xl hover:bg-gray-200">
                <MessageCircle size={20} className="text-gray-700" />
                <span className="text-sm font-semibold text-gray-700">{txt('Chat')}</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-5 bg-gray-100 rounded-2xl hover:bg-gray-200">
                <Phone size={20} className="text-gray-700" />
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-5 bg-gray-100 rounded-2xl hover:bg-gray-200">
                <Shield size={20} className="text-gray-700" />
              </button>
            </div>
            <button onClick={() => { setProgresso(0); setTela('viagem'); }}
              className="w-full py-4 text-lg font-bold text-white bg-gray-900 rounded-2xl hover:bg-gray-800 active:scale-95 transition-all">
              {txt('Motorista chegou — Iniciar viagem')}
            </button>
          </div>
        </div>
        <BtnAcessibilidade onToggle={toggleUppercase} isActive={isUppercase} />
      </div>
    );
  }

  // ─── EM VIAGEM ─────────────────────────────────────────
  if (tela === 'viagem') {
    const minutosRestantes = Math.ceil((100 - progresso) * 0.22);

    return (
      <div className="relative h-screen w-full max-w-md mx-auto overflow-hidden shadow-2xl md:rounded-3xl"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div className="flex flex-col h-full">
          <MapaFundo origem={ORIGEM} destino={destino || undefined} className="flex-1" />

          <div className="p-4 bg-white border-t">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500">{txt('Tempo restante')}</p>
                <p className="text-sm font-bold text-gray-800">{minutosRestantes} min</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{txt('Previsao de chegada')}</p>
                <p className="text-sm font-bold text-gray-800">
                  {new Date(Date.now() + minutosRestantes * 60000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Barra de progresso */}
            <div className="h-2 mb-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progresso}%` }} />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={16} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{txt(MOTORISTA_BASE.nome)}</p>
                <p className="text-xs text-gray-400">{MOTORISTA_BASE.placa} • {MOTORISTA_BASE.carro}</p>
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100"><Phone size={20} className="text-gray-600" /></button>
              <button className="p-2 rounded-full hover:bg-gray-100"><Shield size={20} className="text-gray-600" /></button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── CHEGOU ────────────────────────────────────────────
  if (tela === 'chegou') {
    const preco = Math.round(precoBase * opcaoAtual.multiplicador * 100) / 100;

    return (
      <div className="relative h-screen w-full max-w-md mx-auto overflow-hidden bg-white shadow-2xl md:rounded-3xl"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="flex items-center justify-center w-20 h-20 mb-4 bg-green-100 rounded-full">
            <MapPin size={36} className="text-green-600" />
          </div>
          <h2 className="mb-1 text-2xl font-bold text-gray-800">{txt('Voce chegou!')}</h2>
          <p className="mb-6 text-gray-500">{destino ? txt(destino.nome) : ''}</p>

          <div className="w-full p-4 mb-4 text-left bg-gray-50 rounded-2xl">
            <p className="mb-2 text-sm text-gray-500">{txt('Resumo da viagem')}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{txt('Motorista')}</span>
                <span className="font-semibold">{txt(MOTORISTA_BASE.nome)}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between">
                <span className="text-gray-500">{txt('Origem')}</span>
                <span className="text-right text-xs">{txt(ORIGEM.endereco)}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between">
                <span className="text-gray-500">{txt('Destino')}</span>
                <span className="text-right text-xs">{destino ? txt(destino.nome) : ''}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between">
                <span className="text-gray-500">{txt('Valor')}</span>
                <span className="font-bold text-gray-800">R$ {preco.toFixed(2).replace('.', ',')}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between">
                <span className="text-gray-500">{txt('Pagamento')}</span>
                <span className="font-semibold text-gray-800">
                  {pagamento === 'pix' ? '💠 PIX' : pagamento === 'debito' ? '💳 ' + txt('Debito') : pagamento === 'credito' ? '🏦 ' + txt('Credito') : '💵 ' + txt('Dinheiro')}
                </span>
              </div>
            </div>
          </div>

          <p className="mb-3 text-sm text-gray-400">{txt('Como foi sua viagem?')}</p>
          <div className="flex gap-1 mb-6">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => setAvaliacao(n)}>
                <Star size={32} className={n <= avaliacao ? 'text-yellow-500' : 'text-gray-300'}
                  fill={n <= avaliacao ? '#eab308' : 'none'} />
              </button>
            ))}
          </div>

          <div className="w-full space-y-2">
            <button onClick={voltarHome}
              className="w-full py-4 text-lg font-bold text-white bg-gray-900 rounded-2xl hover:bg-gray-800 active:scale-95 transition-all">
              {txt('Pedir nova viagem')}
            </button>
            <button onClick={voltarHome}
              className="w-full py-3 font-semibold text-gray-500 rounded-2xl hover:bg-gray-100 transition-colors">
              {txt('Voltar ao inicio')}
            </button>
          </div>
        </div>
        <BtnAcessibilidade onToggle={toggleUppercase} isActive={isUppercase} />
      </div>
    );
  }

  return null;
}
