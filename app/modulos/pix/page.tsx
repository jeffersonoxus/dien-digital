'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, X, ChevronRight, Copy, Check, Eye, EyeOff,
  QrCode, Smartphone, Key, Shield, Home, Clock, DollarSign,
  User, AlertCircle, Bell, Activity, AlignJustify
} from 'lucide-react';

// ─── Tipos ────────────────────────────────────────────────
type Tela =
  | 'home'
  | 'pix-menu'
  | 'fazer-chave'
  | 'fazer-valor'
  | 'fazer-confirmar'
  | 'fazer-senha'
  | 'fazer-sucesso'
  | 'receber-qrcode'
  | 'receber-chaves'
  | 'extrato'
  | 'minhas-chaves'
  | 'golpes'
  | 'comprovante';

interface ChavePix {
  id: string;
  tipo: 'cpf' | 'email' | 'telefone' | 'aleatoria';
  valor: string;
  banco: string;
  ativa: boolean;
}

interface Transacao {
  id: string;
  data: string;
  hora: string;
  descricao: string;
  valor: number;
  tipo: 'entrada' | 'saida';
  nome: string;
}

// ─── Dados da conta simulada ──────────────────────────────
const SALDO = 1847.65;
const NOME_TITULAR = 'Maria Silva Santos';
const AGENCIA = '0001';
const CONTA = '12345-6';

const CHAVES_SALVAS: ChavePix[] = [
  { id: '1', tipo: 'cpf', valor: '***.456.789-**', banco: 'Banco Digital S/A', ativa: true },
  { id: '2', tipo: 'email', valor: 'maria@email.com', banco: 'Banco Digital S/A', ativa: true },
  { id: '3', tipo: 'telefone', valor: '(11) 9****-1234', banco: 'Banco Digital S/A', ativa: true },
  { id: '4', tipo: 'aleatoria', valor: '8a7b-3c2d-****-****', banco: 'Banco Digital S/A', ativa: false },
];

const EXTRATO: Transacao[] = [
  { id: '1', data: '15/03/2024', hora: '14:30', descricao: 'Supermercado Bom Preço', valor: 187.32, tipo: 'saida', nome: 'SUPERMERCADO BOM PRECO LTDA' },
  { id: '2', data: '14/03/2024', hora: '10:15', descricao: 'PIX recebido - Salário', valor: 1420.00, tipo: 'entrada', nome: 'EMPRESA ABC LTDA' },
  { id: '3', data: '12/03/2024', hora: '16:45', descricao: 'Farmácia Saúde', valor: 54.90, tipo: 'saida', nome: 'FARMACIA SAUDE LTDA' },
  { id: '4', data: '10/03/2024', hora: '09:00', descricao: 'PIX recebido - João', valor: 75.00, tipo: 'entrada', nome: 'JOAO CARLOS SILVA' },
  { id: '5', data: '08/03/2024', hora: '11:20', descricao: 'Mercado da Esquina', valor: 32.15, tipo: 'saida', nome: 'MERCADO DA ESQUINA ME' },
  { id: '6', data: '05/03/2024', hora: '08:00', descricao: 'PIX recebido - Auxílio', valor: 600.00, tipo: 'entrada', nome: 'MIN. DA CIDADANIA' },
];

// ─── Helpers ──────────────────────────────────────────────
const formatarMoeda = (v: number) =>
  v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatarData = (d: string) => {
  const [dia, mes, ano] = d.split('/');
  return `${dia}/${mes}`;
};

// ─── Subcomponentes ───────────────────────────────────────
function IconeChave({ tipo, size = 20 }: { tipo: ChavePix['tipo']; size?: number }) {
  switch (tipo) {
    case 'cpf': return <User size={size} className="text-blue-600" />;
    case 'email': return <span className="text-lg">✉️</span>;
    case 'telefone': return <Smartphone size={size} className="text-green-600" />;
    case 'aleatoria': return <Key size={size} className="text-purple-600" />;
  }
}

function NomeTipoChave(tipo: ChavePix['tipo']) {
  switch (tipo) {
    case 'cpf': return 'CPF';
    case 'email': return 'E-mail';
    case 'telefone': return 'Telefone';
    case 'aleatoria': return 'Aleatória';
  }
}

// ─── Teclado Numérico ────────────────────────────────────
function TecladoNumerico({
  onDigito,
  onApagar,
  valor,
}: {
  onDigito: (d: string) => void;
  onApagar: () => void;
  valor: string;
}) {
  const teclas = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];
  return (
    <div className="grid grid-cols-3 gap-2">
      {teclas.map((tecla, i) => {
        if (tecla === '') return <div key={i} />;
        return (
          <button
            key={i}
            onClick={() => (tecla === '⌫' ? onApagar() : onDigito(tecla))}
            className="py-4 text-xl font-semibold text-gray-800 transition-colors active:bg-gray-200 active:scale-95 rounded-xl"
          >
            {tecla}
          </button>
        );
      })}
    </div>
  );
}

// ─── Botão de Acessibilidade ─────────────────────────────
function AcessibilidadeBtn({
  onToggle, isActive
}: { onToggle: () => void; isActive: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed z-50 bottom-24 right-4">
      <button onClick={() => setOpen(!open)}
        className="p-3 text-white bg-purple-600 rounded-full shadow-lg hover:bg-purple-700">
        <Activity size={24} />
      </button>
      {open && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 p-3 space-y-2 bg-white rounded-2xl shadow-xl bottom-16 min-w-[200px]">
          <p className="px-2 text-xs text-gray-400">Acessibilidade</p>
          <button onClick={() => { onToggle(); setOpen(false); }}
            className="flex items-center w-full gap-3 px-3 py-2 rounded-xl hover:bg-gray-100">
            <AlignJustify size={18} className="text-purple-600" />
            <span className="text-sm text-gray-700">Texto em CAIXA ALTA</span>
            {isActive && <span className="ml-auto text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Ativo</span>}
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────
export default function SimuladorPix() {
  const [tela, setTela] = useState<Tela>('home');
  const [chaveSelecionada, setChaveSelecionada] = useState<string>('');
  const [tipoChave, setTipoChave] = useState<ChavePix['tipo']>('cpf');
  const [valorPix, setValorPix] = useState('');
  const [senha, setSenha] = useState('');
  const [destinatario] = useState('MERCADO BOM PREÇO LTDA');
  const [mostrarSaldo, setMostrarSaldo] = useState(true);
  const [senhaErrada, setSenhaErrada] = useState(false);
  const [isUppercase, setIsUppercase] = useState(false);
  const [comprovanteSelecionado, setComprovanteSelecionado] = useState<Transacao | null>(null);

  useEffect(() => {
    const s = localStorage.getItem('isUppercase');
    if (s) setIsUppercase(JSON.parse(s));
  }, []);

  const toggleUppercase = () => {
    const v = !isUppercase;
    setIsUppercase(v);
    localStorage.setItem('isUppercase', JSON.stringify(v));
  };

  const txt = (s: string) => (isUppercase ? s.toUpperCase() : s);

  // ─── Handlers ─────────────────────────────────────────
  const handleDigitoValor = (d: string) => {
    if (d === ',' && valorPix.includes(',')) return;
    if (valorPix.length >= 9) return;
    const partes = valorPix.split(',');
    if (partes[1] && partes[1].length >= 2) return;
    setValorPix(prev => prev + d);
  };

  const handleDigitoSenha = (d: string) => {
    if (senha.length >= 4) return;
    const nova = senha + d;
    setSenha(nova);
    if (nova.length === 4) {
      if (nova === '1234') {
        setSenha('');
        setTela('fazer-sucesso');
      } else {
        setSenhaErrada(true);
        setTimeout(() => {
          setSenhaErrada(false);
          setSenha('');
        }, 1500);
      }
    }
  };

  const resetarPix = () => {
    setValorPix('');
    setSenha('');
    setSenhaErrada(false);
    setChaveSelecionada('***.456.789-**');
    setTipoChave('cpf');
  };

  // ─── Barra Superior ───────────────────────────────────
  const Header = ({ titulo, onBack, onClose }: { titulo: string; onBack?: () => void; onClose?: () => void }) => (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
      {onBack ? (
        <button onClick={onBack} className="p-1"><ArrowLeft size={24} className="text-gray-700" /></button>
      ) : onClose ? (
        <button onClick={onClose} className="p-1"><X size={24} className="text-gray-700" /></button>
      ) : (
        <div className="w-8" />
      )}
      <h1 className="text-lg font-bold text-gray-800">{txt(titulo)}</h1>
      <div className="w-8" />
    </div>
  );

  // ═══════════════════════════════════════════════════════
  // TELA HOME ─ DASHBOARD DO BANCO
  // ═══════════════════════════════════════════════════════
  const TelaHome = () => (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Barra superior */}
      <div className="px-5 pt-12 pb-6 text-white bg-gradient-to-br from-orange-600 to-orange-700">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => window.location.href = '/'} className="p-1">
            <ArrowLeft size={24} className="text-white" />
          </button>
          <div className="flex gap-3">
            <button className="p-1"><Eye size={22} className="text-white/80" /></button>
            <button className="p-1"><Bell size={22} className="text-white/80" /></button>
          </div>
        </div>
        <p className="mb-1 text-sm text-white/80">{txt('Olá, Maria Silva Santos')}</p>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold">
            {mostrarSaldo ? `R$ ${formatarMoeda(SALDO)}` : 'R$ ••••••'}
          </p>
          <button onClick={() => setMostrarSaldo(!mostrarSaldo)} className="p-1">
            {mostrarSaldo ? <Eye size={18} className="text-white/70" /> : <EyeOff size={18} className="text-white/70" />}
          </button>
        </div>
        <p className="mt-1 text-xs text-white/60">{txt('Agência')} {AGENCIA} | {txt('Conta')} {CONTA}</p>
      </div>

      {/* Área PIX destacada */}
      <div className="px-5 -mt-4">
        <div className="p-4 bg-white shadow-sm rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-800">PIX</h2>
            <button onClick={() => { resetarPix(); setTela('pix-menu'); }}
              className="text-sm font-semibold text-orange-600">
              {txt('Acessar')} <ChevronRight size={16} className="inline" />
            </button>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { resetarPix(); setTela('fazer-chave'); }}
              className="flex-1 py-3 text-sm font-semibold text-white bg-orange-600 rounded-xl hover:bg-orange-700 transition-colors">
              {txt('PAGAR')}
            </button>
            <button onClick={() => setTela('receber-qrcode')}
              className="flex-1 py-3 text-sm font-semibold text-orange-600 border border-orange-600 rounded-xl hover:bg-orange-50 transition-colors">
              {txt('RECEBER')}
            </button>
          </div>
        </div>
      </div>

      {/* Menu de atalhos */}
      <div className="grid grid-cols-4 gap-4 px-5 mt-6">
        {[
          { label: 'PIX', icon: <DollarSign size={24} />, cor: 'bg-blue-100 text-blue-600', aoClicar: () => { resetarPix(); setTela('pix-menu'); } },
          { label: 'Extrato', icon: <Clock size={24} />, cor: 'bg-green-100 text-green-600', aoClicar: () => setTela('extrato') },
          { label: 'Chaves', icon: <Key size={24} />, cor: 'bg-purple-100 text-purple-600', aoClicar: () => setTela('minhas-chaves') },
          { label: 'Segurança', icon: <Shield size={24} />, cor: 'bg-red-100 text-red-600', aoClicar: () => setTela('golpes') },
        ].map((item, i) => (
          <button key={i} onClick={item.aoClicar} className="flex flex-col items-center gap-2">
            <div className={`p-3 rounded-2xl ${item.cor}`}>{item.icon}</div>
            <span className="text-xs font-medium text-gray-600">{txt(item.label)}</span>
          </button>
        ))}
      </div>

      {/* Últimas movimentações */}
      <div className="flex-1 px-5 mt-6 mb-6 overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800">{txt('Últimas movimentações')}</h3>
          <button onClick={() => setTela('extrato')} className="text-sm text-orange-600">{txt('Ver tudo')}</button>
        </div>
        <div className="space-y-2">
          {EXTRATO.slice(0, 5).map((t) => (
            <button key={t.id} onClick={() => { setComprovanteSelecionado(t); setTela('comprovante'); }}
              className="flex items-center w-full gap-3 p-3 text-left transition-colors bg-white rounded-xl hover:bg-gray-50">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                t.tipo === 'entrada' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {t.tipo === 'entrada'
                  ? <DollarSign size={18} className="text-green-600" />
                  : <DollarSign size={18} className="text-red-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{txt(t.descricao)}</p>
                <p className="text-xs text-gray-400">{formatarData(t.data)} • {t.hora}</p>
              </div>
              <p className={`text-sm font-bold ${t.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                {t.tipo === 'entrada' ? '+' : '-'}R$ {formatarMoeda(t.valor)}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════
  // TELA MENU PIX
  // ═══════════════════════════════════════════════════════
  const TelaPixMenu = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <Header titulo="Área PIX" onClose={() => setTela('home')} />
      <div className="p-5 space-y-3">
        {[
          { label: 'Pagar com PIX', desc: txt('Use uma chave ou leia QR Code'), icon: <QrCode size={22} />, cor: 'bg-orange-100 text-orange-600', tela: 'fazer-chave' },
          { label: 'Receber PIX', desc: txt('Mostre seu QR Code ou chave'), icon: <DollarSign size={22} />, cor: 'bg-green-100 text-green-600', tela: 'receber-qrcode' },
          { label: 'Minhas Chaves', desc: txt('Gerencie suas chaves PIX'), icon: <Key size={22} />, cor: 'bg-purple-100 text-purple-600', tela: 'minhas-chaves' },
          { label: 'Extrato PIX', desc: txt('Veja seu histórico de PIX'), icon: <Clock size={22} />, cor: 'bg-blue-100 text-blue-600', tela: 'extrato' },
          { label: 'Segurança e Golpes', desc: txt('Aprenda a se proteger'), icon: <Shield size={22} />, cor: 'bg-red-100 text-red-600', tela: 'golpes' },
        ].map((item, i) => (
          <button key={i} onClick={() => { resetarPix(); setTela(item.tela as Tela); }}
            className="flex items-center w-full gap-4 p-4 text-left transition-colors bg-white shadow-sm rounded-2xl hover:bg-gray-50">
            <div className={`p-3 rounded-xl ${item.cor}`}>{item.icon}</div>
            <div className="flex-1">
              <p className="text-base font-semibold text-gray-800">{txt(item.label)}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
          </button>
        ))}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════
  // TELA FAZER PIX ─ ETAPA 1: ESCOLHER CHAVE
  // ═══════════════════════════════════════════════════════
  const TelaFazerChave = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <Header titulo="Pagar com PIX" onBack={() => setTela('pix-menu')} />
      <div className="flex-1 p-5 overflow-auto">
        <p className="mb-4 text-sm text-gray-500">{txt('Escolha como quer pagar:')}</p>

        {/* Opção QR Code */}
        <button className="flex items-center w-full gap-4 p-4 mb-4 text-left transition-colors bg-white shadow-sm rounded-2xl hover:bg-gray-50">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
            <QrCode size={28} className="text-gray-700" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800">{txt('Ler QR Code')}</p>
            <p className="text-sm text-gray-500">{txt('Aponte a câmera para o código')}</p>
          </div>
          <ChevronRight size={20} className="text-gray-300" />
        </button>

        <p className="mb-3 text-sm text-gray-500">{txt('Ou digite uma chave PIX:')}</p>

        {(['cpf', 'telefone', 'email', 'aleatoria'] as ChavePix['tipo'][]).map((tipo) => {
          const ativo = tipoChave === tipo;
          return (
            <button key={tipo} onClick={() => setTipoChave(tipo)}
              className={`flex items-center w-full gap-4 p-4 mb-2 text-left transition-all bg-white shadow-sm rounded-2xl border-2 ${
                ativo ? 'border-orange-600 bg-orange-50' : 'border-transparent hover:bg-gray-50'
              }`}>
              <div className={`p-2.5 rounded-xl ${ativo ? 'bg-orange-100' : 'bg-gray-100'}`}>
                <IconeChave tipo={tipo} size={22} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{txt(`Chave ${NomeTipoChave(tipo)}`)}</p>
                <p className="text-sm text-gray-500">
                  {tipo === 'cpf' && txt('Use o CPF de quem vai receber')}
                  {tipo === 'email' && txt('Use o e-mail de quem vai receber')}
                  {tipo === 'telefone' && txt('Use o telefone de quem vai receber')}
                  {tipo === 'aleatoria' && txt('Use o código gerado pelo banco')}
                </p>
              </div>
              {ativo && <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center"><Check size={14} className="text-white" /></div>}
            </button>
          );
        })}

        {/* Input da chave */}
        <div className="p-4 mt-4 bg-white shadow-sm rounded-2xl">
          <p className="mb-2 text-sm text-gray-500">
            {tipoChave === 'cpf' && txt('Digite o CPF (só números):')}
            {tipoChave === 'email' && txt('Digite o e-mail:')}
            {tipoChave === 'telefone' && txt('Digite o telefone com DDD:')}
            {tipoChave === 'aleatoria' && txt('Digite a chave aleatória:')}
          </p>
          <input
            type="text"
            value={chaveSelecionada}
            onChange={(e) => setChaveSelecionada(e.target.value)}
            placeholder={tipoChave === 'cpf' ? '123.456.789-00' : tipoChave === 'email' ? 'exemplo@email.com' : tipoChave === 'telefone' ? '(11) 99999-9999' : '8a7b-3c2d-4e5f-6g7h'}
            className="w-full p-3 text-lg text-gray-800 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
          />
          {chaveSelecionada.length >= 3 && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 mt-3 bg-green-50 rounded-xl">
              <Check size={18} className="text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-800">{txt('Destinatário encontrado:')}</p>
                <p className="text-sm font-bold text-gray-900">{txt(destinatario)}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Botão continuar */}
      <div className="p-5 bg-white border-t">
        <button
          disabled={chaveSelecionada.length < 3}
          onClick={() => setTela('fazer-valor')}
          className={`w-full py-4 text-lg font-bold rounded-2xl transition-all ${
            chaveSelecionada.length >= 3
              ? 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}>
          {txt('Continuar')}
        </button>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════
  // TELA FAZER PIX ─ ETAPA 2: DIGITAR VALOR
  // ═══════════════════════════════════════════════════════
  const TelaFazerValor = () => (
    <div className="flex flex-col h-full bg-white">
      <Header titulo="Valor do PIX" onBack={() => { setValorPix(''); setTela('fazer-chave'); }} />

      <div className="flex-1 p-5">
        <p className="mb-2 text-sm text-gray-500">{txt('Para:')} <span className="font-semibold text-gray-800">{txt(destinatario)}</span></p>

        {/* Display do valor */}
        <div className="py-6 mb-6 text-center">
          <p className="mb-1 text-sm text-gray-400">{txt('Digite o valor')}</p>
          <p className={`text-4xl font-bold ${valorPix ? 'text-gray-800' : 'text-gray-300'}`}>
            R$ {valorPix ? valorPix.replace('.', ',') : '0,00'}
          </p>
          {valorPix && <p className="mt-2 text-sm text-gray-400">{txt('PIX instantâneo • Sem taxa')}</p>}
        </div>

        {/* Teclado numérico */}
        <div className="max-w-sm mx-auto">
          <TecladoNumerico
            valor={valorPix}
            onDigito={handleDigitoValor}
            onApagar={() => setValorPix(prev => prev.slice(0, -1))}
          />
        </div>
      </div>

      {/* Botão continuar */}
      <div className="p-5 bg-white border-t">
        <button
          disabled={!valorPix || valorPix === '0,00'}
          onClick={() => setTela('fazer-confirmar')}
          className={`w-full py-4 text-lg font-bold rounded-2xl transition-all ${
            valorPix && valorPix !== '0,00'
              ? 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}>
          {txt('Revisar pagamento')}
        </button>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════
  // TELA FAZER PIX ─ ETAPA 3: CONFIRMAR
  // ═══════════════════════════════════════════════════════
  const TelaFazerConfirmar = () => {
    const valorNumerico = parseFloat(valorPix.replace(',', '.'));
    const agora = new Date();
    const dataHora = `${agora.toLocaleDateString('pt-BR')} às ${agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    return (
      <div className="flex flex-col h-full bg-white">
        <Header titulo="Confirmar PIX" onBack={() => setTela('fazer-valor')} />

        <div className="flex-1 p-5">
          <div className="p-5 bg-gray-50 rounded-2xl">
            <p className="mb-4 text-sm text-gray-500">{txt('Confira os dados com atenção:')}</p>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">{txt('Valor')}</span>
                <span className="text-lg font-bold text-gray-800">R$ {formatarMoeda(valorNumerico)}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">{txt('Para')}</span>
                <span className="text-sm font-semibold text-right text-gray-800">{txt(destinatario)}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">{txt('Chave PIX')}</span>
                <span className="text-sm text-gray-800">{txt(chaveSelecionada)}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">{txt('Tipo')}</span>
                <span className="text-sm text-gray-800">{NomeTipoChave(tipoChave)}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">{txt('Data/Hora')}</span>
                <span className="text-sm text-gray-800">{dataHora}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 p-4 mt-4 bg-yellow-50 rounded-2xl">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-yellow-600" />
            <p className="text-sm text-yellow-800">{txt('Verifique se o nome do destinatário está correto. Depois de enviado, o PIX não pode ser cancelado.')}</p>
          </div>
        </div>

        <div className="p-5 space-y-3 bg-white border-t">
          <button onClick={() => setTela('fazer-senha')}
            className="w-full py-4 text-lg font-bold text-white transition-all bg-orange-600 rounded-2xl hover:bg-orange-700 active:scale-95">
            {txt('Pagar PIX')}
          </button>
          <button onClick={() => setTela('home')}
            className="w-full py-3 font-semibold text-gray-500 transition-colors rounded-2xl hover:bg-gray-100">
            {txt('Cancelar')}
          </button>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════
  // TELA FAZER PIX ─ ETAPA 4: SENHA
  // ═══════════════════════════════════════════════════════
  const TelaFazerSenha = () => (
    <div className="flex flex-col h-full bg-white">
      <Header titulo="Senha" onBack={() => { setSenha(''); setTela('fazer-confirmar'); }} />

      <div className="flex-1 p-5">
        <div className="py-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
            <Key size={28} className="text-gray-600" />
          </div>
          <p className="mb-1 text-lg font-semibold text-gray-800">{txt('Digite sua senha de 4 dígitos')}</p>
          <p className="text-sm text-gray-400">{txt('Simulação: senha correta é 1234')}</p>

          {/* Indicadores de senha */}
          <div className="flex justify-center gap-4 my-8">
            {[0, 1, 2, 3].map((i) => (
              <div key={i}
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  senha.length > i
                    ? senhaErrada ? 'bg-red-500 border-red-500 animate-shake' : 'bg-orange-600 border-orange-600'
                    : 'border-gray-300'
                }`} />
            ))}
          </div>

          {senhaErrada && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-red-500 font-medium">
              {txt('Senha incorreta! Tente novamente.')}
            </motion.p>
          )}
        </div>

        <div className="max-w-sm mx-auto">
          <TecladoNumerico valor={senha} onDigito={handleDigitoSenha} onApagar={() => setSenha(prev => prev.slice(0, -1))} />
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-4px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );

  // ═══════════════════════════════════════════════════════
  // TELA FAZER PIX ─ ETAPA 5: SUCESSO
  // ═══════════════════════════════════════════════════════
  const TelaFazerSucesso = () => {
    const valorNumerico = parseFloat(valorPix.replace(',', '.'));
    const idPix = `E${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="flex-1 p-5 overflow-auto">
          <div className="py-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
              className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full">
              <Check size={40} className="text-green-600" />
            </motion.div>
            <h2 className="mb-1 text-2xl font-bold text-green-700">{txt('PIX enviado!')}</h2>
            <p className="text-gray-500">{txt('Pagamento realizado com sucesso')}</p>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="p-5 bg-white shadow-sm rounded-2xl">
            <p className="mb-4 text-sm font-bold text-gray-800">{txt('COMPROVANTE')}</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{txt('Valor')}</span>
                <span className="font-bold text-gray-800">R$ {formatarMoeda(valorNumerico)}</span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between">
                <span className="text-gray-500">{txt('Para')}</span>
                <span className="font-medium text-right text-gray-800">{txt(destinatario)}</span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between">
                <span className="text-gray-500">{txt('Data')}</span>
                <span className="text-gray-800">{new Date().toLocaleDateString('pt-BR')}</span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between">
                <span className="text-gray-500">{txt('Hora')}</span>
                <span className="text-gray-800">{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between">
                <span className="text-gray-500">{txt('ID da transação')}</span>
                <span className="font-mono text-xs text-gray-600">{idPix}</span>
              </div>
            </div>
          </motion.div>

          <div className="flex items-start gap-2 p-4 mt-4 bg-blue-50 rounded-2xl">
            <Bell size={18} className="flex-shrink-0 mt-0.5 text-blue-500" />
            <div>
              <p className="mb-1 text-sm font-semibold text-blue-800">{txt('Dica de segurança:')}</p>
              <p className="text-sm text-blue-700">{txt('Guarde o comprovante. Sempre confira o nome de quem recebe antes de enviar. O banco NUNCA pede sua senha por telefone.')}</p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-3 bg-white border-t">
          <button onClick={() => { resetarPix(); setTela('pix-menu'); }}
            className="w-full py-4 text-lg font-bold text-white transition-all bg-orange-600 rounded-2xl hover:bg-orange-700 active:scale-95">
            {txt('Fazer novo PIX')}
          </button>
          <button onClick={() => { resetarPix(); setTela('home'); }}
            className="w-full py-3 font-semibold text-gray-500 transition-colors rounded-2xl hover:bg-gray-100">
            {txt('Voltar ao início')}
          </button>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════
  // TELA RECEBER PIX ─ QR CODE
  // ═══════════════════════════════════════════════════════
  const TelaReceberQrCode = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <Header titulo="Receber PIX" onBack={() => setTela('pix-menu')} />
      <div className="flex-1 p-5 overflow-auto">
        <div className="p-5 mb-6 text-center bg-white shadow-sm rounded-2xl">
          <p className="mb-4 text-sm text-gray-500">{txt('Mostre este QR Code para quem vai te pagar:')}</p>
          {/* QR Code simulado */}
          <div className="flex items-center justify-center w-48 h-48 mx-auto mb-4 bg-gray-100 rounded-2xl">
            <div className="grid grid-cols-5 gap-1 p-3 w-36 h-36">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className={`rounded-sm ${Math.random() > 0.45 ? 'bg-gray-800' : 'bg-transparent'}`} />
              ))}
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-800">{NOME_TITULAR}</p>
          <p className="mb-3 text-xs text-gray-400">{AGENCIA} / {CONTA}</p>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-orange-600 bg-orange-50 rounded-xl">
            <Copy size={16} /> {txt('Copiar chave PIX')}
          </button>
        </div>

        <button onClick={() => setTela('receber-chaves')}
          className="flex items-center justify-between w-full p-4 text-left bg-white shadow-sm rounded-2xl hover:bg-gray-50">
          <div className="flex items-center gap-3">
            <Key size={20} className="text-purple-600" />
            <div>
              <p className="font-semibold text-gray-800">{txt('Minhas chaves PIX')}</p>
              <p className="text-sm text-gray-500">{txt('Veja todas as suas chaves')}</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-300" />
        </button>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════
  // TELA RECEBER ─ LISTA DE CHAVES
  // ═══════════════════════════════════════════════════════
  const TelaReceberChaves = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <Header titulo="Minhas Chaves" onBack={() => setTela('receber-qrcode')} />
      <div className="flex-1 p-5 overflow-auto space-y-3">
        <p className="text-sm text-gray-500">{txt('Escolha uma chave para compartilhar:')}</p>
        {CHAVES_SALVAS.filter(c => c.ativa).map((chave) => (
          <div key={chave.id} className="p-4 bg-white shadow-sm rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 rounded-xl"><IconeChave tipo={chave.tipo} /></div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{NomeTipoChave(chave.tipo)}</p>
                <p className="text-sm text-gray-600">{txt(chave.valor)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 flex-1 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-xl justify-center">
                <Copy size={14} /> {txt('Copiar')}
              </button>
              <button className="flex items-center gap-1.5 py-2 px-4 text-sm font-medium text-white bg-orange-600 rounded-xl">
                {txt('Compartilhar')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════
  // TELA EXTRATO PIX
  // ═══════════════════════════════════════════════════════
  const TelaExtrato = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <Header titulo="Extrato PIX" onBack={() => setTela('pix-menu')} />
      <div className="flex-1 p-5 overflow-auto">
        <div className="flex gap-3 mb-4">
          <button className="flex-1 py-2 text-sm font-semibold text-white bg-orange-600 rounded-xl">{txt('Todos')}</button>
          <button className="flex-1 py-2 text-sm font-semibold text-gray-500 bg-gray-200 rounded-xl">{txt('Enviados')}</button>
          <button className="flex-1 py-2 text-sm font-semibold text-gray-500 bg-gray-200 rounded-xl">{txt('Recebidos')}</button>
        </div>
        <p className="mb-3 text-sm text-gray-400">{txt('Últimas transações')}</p>
        {EXTRATO.map((t) => (
          <button key={t.id} onClick={() => { setComprovanteSelecionado(t); setTela('comprovante'); }}
            className="flex items-center w-full gap-3 p-4 mb-2 text-left transition-colors bg-white shadow-sm rounded-2xl hover:bg-gray-50">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              t.tipo === 'entrada' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {t.tipo === 'entrada'
                ? <DollarSign size={18} className="text-green-600" />
                : <DollarSign size={18} className="text-red-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{txt(t.descricao)}</p>
              <p className="text-xs text-gray-400">{t.data} • {t.hora}</p>
            </div>
            <p className={`text-sm font-bold ${t.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
              {t.tipo === 'entrada' ? '+' : '-'}R$ {formatarMoeda(t.valor)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════
  // TELA MINHAS CHAVES (gerenciamento)
  // ═══════════════════════════════════════════════════════
  const TelaMinhasChaves = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <Header titulo="Minhas Chaves PIX" onBack={() => setTela('pix-menu')} />
      <div className="flex-1 p-5 overflow-auto space-y-3">
        <div className="p-4 bg-blue-50 rounded-2xl">
          <p className="text-sm text-blue-800">{txt('Você pode ter até 5 chaves PIX por conta. Suas chaves são os endereços para receber dinheiro.')}</p>
        </div>
        {CHAVES_SALVAS.map((chave) => (
          <div key={chave.id} className="p-4 bg-white shadow-sm rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-xl"><IconeChave tipo={chave.tipo} /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{NomeTipoChave(chave.tipo)}</p>
                  <p className="text-xs text-gray-500">{chave.banco}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                chave.ativa ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {chave.ativa ? txt('Ativa') : txt('Inativa')}
              </span>
            </div>
            <p className="mb-3 font-mono text-sm text-gray-800">{txt(chave.valor)}</p>
            {chave.ativa && (
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 flex-1 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-xl justify-center">
                  <Copy size={14} /> {txt('Copiar chave')}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════
  // TELA GOLPES E SEGURANÇA
  // ═══════════════════════════════════════════════════════
  const TelaGolpes = () => {
    const golpes = [
      { titulo: 'Comprovante Falso', desc: 'O golpista envia um comprovante falso de PIX. Só entregue o produto quando o dinheiro CAIR na sua conta.', icon: '📄' },
      { titulo: 'Falso Atendente', desc: 'Alguém liga dizendo ser do banco e pede sua senha. BANCOS NUNCA pedem senha por telefone. Desligue na hora!', icon: '📞' },
      { titulo: 'Link Suspeito', desc: 'Recebeu SMS ou WhatsApp com link para "liberar PIX bloqueado"? NÃO clique! Entre no app oficial do banco.', icon: '🔗' },
      { titulo: 'QR Code Falso', desc: 'Sempre confira o nome e valor que aparece ANTES de confirmar o PIX. Golpistas trocam QR Codes em lojas.', icon: '📱' },
      { titulo: 'PIX Agendado', desc: 'O PIX agendado NÃO cai na hora! Só aparece no extrato, mas o dinheiro só entra na data marcada.', icon: '📅' },
    ];

    return (
      <div className="flex flex-col h-full bg-gray-50">
        <Header titulo="Segurança e Golpes" onBack={() => setTela('pix-menu')} />
        <div className="flex-1 p-5 overflow-auto">
          <div className="flex items-start gap-2 p-4 mb-4 bg-red-50 rounded-2xl">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5 text-red-600" />
            <p className="text-sm text-red-800">{txt('Conhecer os golpes é a melhor forma de se proteger. Leia com atenção cada um deles.')}</p>
          </div>
          <div className="space-y-3">
            {golpes.map((g, i) => (
              <div key={i} className="p-4 bg-white shadow-sm rounded-2xl">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{g.icon}</span>
                  <div>
                    <p className="mb-1 font-bold text-gray-800">{txt(g.titulo)}</p>
                    <p className="text-sm text-gray-600">{txt(g.desc)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════
  // TELA COMPROVANTE DE TRANSAÇÃO
  // ═══════════════════════════════════════════════════════
  const TelaComprovante = () => {
    if (!comprovanteSelecionado) return null;
    const t = comprovanteSelecionado;
    const idTransacao = `PIX${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    return (
      <div className="flex flex-col h-full bg-gray-50">
        <Header titulo="Comprovante" onBack={() => { setComprovanteSelecionado(null); setTela('extrato'); }} />
        <div className="flex-1 p-5 overflow-auto">
          <div className="p-5 bg-white shadow-sm rounded-2xl">
            <div className="py-4 mb-4 text-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${
                t.tipo === 'entrada' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {t.tipo === 'entrada'
                  ? <DollarSign size={28} className="text-green-600" />
                  : <DollarSign size={28} className="text-red-600" />}
              </div>
              <p className="text-lg font-bold text-gray-800">
                {t.tipo === 'entrada' ? txt('PIX Recebido') : txt('PIX Enviado')}
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{txt('Valor')}</span>
                <span className={`font-bold ${t.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {formatarMoeda(t.valor)}
                </span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between">
                <span className="text-gray-500">{t.tipo === 'entrada' ? txt('De') : txt('Para')}</span>
                <span className="font-medium text-right text-gray-800">{txt(t.nome)}</span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between">
                <span className="text-gray-500">{txt('Data')}</span>
                <span className="text-gray-800">{t.data}</span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between">
                <span className="text-gray-500">{txt('Hora')}</span>
                <span className="text-gray-800">{t.hora}</span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between">
                <span className="text-gray-500">{txt('Transação')}</span>
                <span className="font-mono text-xs text-gray-600">{idTransacao}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-5 bg-white border-t">
          <button onClick={() => { setComprovanteSelecionado(null); setTela('home'); }}
            className="w-full py-4 text-lg font-bold text-white transition-all bg-orange-600 rounded-2xl hover:bg-orange-700 active:scale-95">
            {txt('Voltar ao início')}
          </button>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════
  // RENDER PRINCIPAL
  // ═══════════════════════════════════════════════════════
  return (
    <div className="relative h-screen w-full max-w-md mx-auto overflow-hidden bg-gray-50 shadow-2xl md:rounded-3xl"
         style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <AnimatePresence mode="wait">
        {tela === 'home' && (<motion.div key="home" initial={{ x: 0 }} animate={{ x: 0 }} exit={{ x: -100, opacity: 0 }} className="h-full"><TelaHome /></motion.div>)}
        {tela === 'pix-menu' && (<motion.div key="pix-menu" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="h-full"><TelaPixMenu /></motion.div>)}
        {tela === 'fazer-chave' && (<motion.div key="fazer-chave" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="h-full"><TelaFazerChave /></motion.div>)}
        {tela === 'fazer-valor' && (<motion.div key="fazer-valor" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="h-full"><TelaFazerValor /></motion.div>)}
        {tela === 'fazer-confirmar' && (<motion.div key="fazer-confirmar" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="h-full"><TelaFazerConfirmar /></motion.div>)}
        {tela === 'fazer-senha' && (<motion.div key="fazer-senha" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="h-full"><TelaFazerSenha /></motion.div>)}
        {tela === 'fazer-sucesso' && (<motion.div key="fazer-sucesso" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="h-full"><TelaFazerSucesso /></motion.div>)}
        {tela === 'receber-qrcode' && (<motion.div key="receber-qrcode" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="h-full"><TelaReceberQrCode /></motion.div>)}
        {tela === 'receber-chaves' && (<motion.div key="receber-chaves" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="h-full"><TelaReceberChaves /></motion.div>)}
        {tela === 'extrato' && (<motion.div key="extrato" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="h-full"><TelaExtrato /></motion.div>)}
        {tela === 'minhas-chaves' && (<motion.div key="minhas-chaves" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="h-full"><TelaMinhasChaves /></motion.div>)}
        {tela === 'golpes' && (<motion.div key="golpes" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="h-full"><TelaGolpes /></motion.div>)}
        {tela === 'comprovante' && (<motion.div key="comprovante" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="h-full"><TelaComprovante /></motion.div>)}
      </AnimatePresence>

      <AcessibilidadeBtn onToggle={toggleUppercase} isActive={isUppercase} />
    </div>
  );
}
