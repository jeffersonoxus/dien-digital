'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, X, ChevronRight, Check, Shield,
  FileText, Clipboard, CreditCard, Car, Heart,
  User, Calendar, MapPin, Bell, Search, Activity,
  AlignJustify, Smartphone, Key, Eye, EyeOff
} from 'lucide-react';

type Tela =
  | 'home' | 'cpf' | 'inss' | 'carteira-trabalho' | 'rg' | 'cnh'
  | 'auxilio' | 'titulo-eleitor' | 'comprovante-cpf';

interface DadosCadastrais {
  nome: string;
  cpf: string;
  mae: string;
  dataNascimento: string;
  email: string;
}

const DADOS_USUARIO: DadosCadastrais = {
  nome: 'Carlos Alberto Souza',
  cpf: '123.456.789-00',
  mae: 'Maria de Lourdes Souza',
  dataNascimento: '15/03/1985',
  email: 'carlos.alberto@email.com',
};

function AcessibilidadeBtn({ onToggle, isActive }: { onToggle: () => void; isActive: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed z-50 bottom-24 right-4">
      <button onClick={() => setOpen(!open)}
        className="p-3 text-white bg-blue-700 rounded-full shadow-lg hover:bg-blue-800">
        <Activity size={24} />
      </button>
      {open && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 p-3 space-y-2 bg-white rounded-2xl shadow-xl bottom-16 min-w-[200px]">
          <p className="px-2 text-xs text-gray-400">Acessibilidade</p>
          <button onClick={() => { onToggle(); setOpen(false); }}
            className="flex items-center w-full gap-3 px-3 py-2 rounded-xl hover:bg-gray-100">
            <AlignJustify size={18} className="text-blue-700" />
            <span className="text-sm text-gray-700">Texto em CAIXA ALTA</span>
            {isActive && <span className="ml-auto text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Ativo</span>}
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default function SimuladorGovBr() {
  const [tela, setTela] = useState<Tela>('home');
  const [isUppercase, setIsUppercase] = useState(false);

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

  const Header = ({ titulo, onBack }: { titulo: string; onBack?: () => void }) => (
    <div className="flex items-center justify-between px-4 py-3 bg-blue-700">
      {onBack ? (
        <button onClick={onBack} className="p-1"><ArrowLeft size={24} className="text-white" /></button>
      ) : (
        <button onClick={() => window.location.href = '/'} className="p-1"><ArrowLeft size={24} className="text-white" /></button>
      )}
      <div className="text-center">
        <h1 className="text-sm font-bold text-white">{txt('Gov.br')}</h1>
        <p className="text-[10px] text-white/70">{txt(titulo)}</p>
      </div>
      <button className="p-1"><Search size={22} className="text-white" /></button>
    </div>
  );

  // ─── TELA HOME ────────────────────────────────────────
  const TelaHome = () => {
    const servicos = [
      { id: 'cpf' as Tela, label: '2ª via do CPF', desc: 'Emita seu CPF digital', icon: FileText, cor: 'bg-blue-100 text-blue-700', destaque: true },
      { id: 'inss' as Tela, label: 'Meu INSS', desc: 'Aposentadoria e benefícios', icon: Heart, cor: 'bg-green-100 text-green-700' },
      { id: 'carteira-trabalho' as Tela, label: 'Carteira de Trabalho', desc: 'Contratos e FGTS', icon: Clipboard, cor: 'bg-orange-100 text-orange-700' },
      { id: 'rg' as Tela, label: 'Agendar RG', desc: 'Poupatempo / SAC', icon: CreditCard, cor: 'bg-purple-100 text-purple-700' },
      { id: 'cnh' as Tela, label: 'CNH Digital', desc: 'Habilitação no celular', icon: Car, cor: 'bg-teal-100 text-teal-700' },
      { id: 'auxilio' as Tela, label: 'Auxílio Brasil', desc: 'Consulte seu benefício', icon: Heart, cor: 'bg-pink-100 text-pink-700', destaque: true },
      { id: 'titulo-eleitor' as Tela, label: 'Título de Eleitor', desc: 'Regularize seu título', icon: Shield, cor: 'bg-gray-100 text-gray-700' },
    ];

    return (
      <div className="flex flex-col h-full bg-gray-50">
        {/* Barra topo Gov.br */}
        <div className="px-5 pt-12 pb-6 text-white bg-gradient-to-br from-blue-700 to-blue-900">
          <p className="text-xs text-blue-200">{txt('Bem-vindo ao')}</p>
          <h1 className="mb-1 text-3xl font-bold">Gov.br</h1>
          <p className="text-sm text-blue-200">{txt('Serviços públicos digitais')}</p>
          <p className="mt-3 text-xs text-blue-300">
            {txt('Conta')}: {txt('Prata')} 🥈 • {txt('Nível de segurança verificado')}
          </p>
        </div>

        {/* Ícone de perfil */}
        <div className="flex items-center gap-3 px-5 py-4 bg-white border-b -mt-4 rounded-t-3xl">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
            <User size={24} className="text-blue-700" />
          </div>
          <div>
            <p className="font-bold text-gray-800">{txt(DADOS_USUARIO.nome)}</p>
            <p className="text-sm text-gray-500">{DADOS_USUARIO.cpf}</p>
          </div>
        </div>

        {/* Serviços mais acessados */}
        <div className="flex-1 p-5 overflow-auto">
          <h2 className="mb-4 text-lg font-bold text-gray-800">{txt('Serviços mais acessados')}</h2>
          <div className="grid grid-cols-2 gap-3">
            {servicos.map(s => (
              <button key={s.id} onClick={() => setTela(s.id)}
                className={`p-4 rounded-2xl text-left transition-all active:scale-95 ${
                  s.destaque ? 'bg-white shadow-md border-2 border-blue-100' : 'bg-white shadow-sm'
                } hover:shadow-md`}>
                <div className={`p-2 rounded-xl inline-block mb-2 ${s.cor}`}>
                  <s.icon size={20} />
                </div>
                <p className="text-sm font-bold text-gray-800">{txt(s.label)}</p>
                <p className="text-xs text-gray-400">{txt(s.desc)}</p>
                {s.destaque && <span className="inline-block mt-2 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{txt('MAIS USADO')}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Rodapé informativo */}
        <div className="p-5 text-center bg-white border-t">
          <p className="text-xs text-gray-400">{txt('Este é um simulador educacional do Gov.br para fins de aprendizado.')}</p>
        </div>
      </div>
    );
  };

  // ─── TELA CPF ─────────────────────────────────────────
  const TelaCPF = () => {
    const [etapa, setEtapa] = useState(0);
    const [nome, setNome] = useState('');
    const [mae, setMae] = useState('');
    const [nascimento, setNascimento] = useState('');

    return (
      <div className="flex flex-col h-full bg-gray-50">
        <Header titulo="2ª via do CPF" onBack={() => { setEtapa(0); setTela('home'); }} />
        <div className="flex-1 p-5 overflow-auto">
          {etapa === 0 && (
            <>
              <div className="p-4 mb-4 bg-blue-50 rounded-2xl">
                <p className="text-sm text-blue-800">{txt('O CPF é o documento mais importante para o cidadão. Com ele você abre conta em banco, recebe benefícios e declara imposto de renda. A 2ª via é GRÁTIS!')}</p>
              </div>
              <p className="mb-2 text-sm text-gray-500">{txt('Para emitir a 2ª via, preencha seus dados:')}</p>
              <div className="space-y-3">
                <div>
                  <label className="block mb-1 text-xs font-semibold text-gray-600">{txt('Nome completo')}</label>
                  <input type="text" value={nome} onChange={e => setNome(e.target.value)}
                    placeholder={txt('Digite seu nome completo')}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-semibold text-gray-600">{txt('Nome da mãe')}</label>
                  <input type="text" value={mae} onChange={e => setMae(e.target.value)}
                    placeholder={txt('Nome completo da sua mãe')}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-semibold text-gray-600">{txt('Data de nascimento')}</label>
                  <input type="text" value={nascimento} onChange={e => setNascimento(e.target.value)}
                    placeholder="DD/MM/AAAA"
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
              </div>
            </>
          )}
          {etapa === 1 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full">
                <Check size={40} className="text-green-600" />
              </motion.div>
              <h2 className="mb-2 text-2xl font-bold text-green-700">{txt('CPF Emitido!')}</h2>
              <p className="mb-6 text-gray-500">{txt('A 2ª via foi gerada com sucesso.')}</p>

              <div className="p-4 mb-4 text-left bg-white shadow-sm rounded-2xl">
                <p className="mb-3 text-xs text-gray-400">{txt('COMPROVANTE DE EMISSÃO')}</p>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">{txt('CPF:')}</span> <span className="font-bold">{DADOS_USUARIO.cpf}</span></p>
                  <p><span className="text-gray-500">{txt('Nome:')}</span> <span>{nome || DADOS_USUARIO.nome}</span></p>
                  <p><span className="text-gray-500">{txt('Validade:')}</span> <span>{txt('Não expira')}</span></p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-4 mb-4 text-left bg-blue-50 rounded-2xl">
                <Bell size={18} className="flex-shrink-0 mt-0.5 text-blue-500" />
                <p className="text-sm text-blue-800">{txt('O comprovante foi enviado para seu e-mail. Você também pode baixar o app Gov.br para ter o CPF no celular.')}</p>
              </div>
            </motion.div>
          )}
        </div>
        <div className="p-4 space-y-2 bg-white border-t">
          {etapa === 0 ? (
            <button onClick={() => setEtapa(1)}
              disabled={!nome || !mae || !nascimento}
              className={`w-full py-4 text-lg font-bold rounded-2xl transition-all ${
                nome && mae && nascimento ? 'bg-blue-700 text-white hover:bg-blue-800 active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}>
              {txt('Emitir 2ª via')}
            </button>
          ) : (
            <button onClick={() => { setEtapa(0); setTela('home'); }}
              className="w-full py-4 text-lg font-bold text-white bg-blue-700 rounded-2xl hover:bg-blue-800 transition-all active:scale-95">
              {txt('Voltar ao início')}
            </button>
          )}
        </div>
      </div>
    );
  };

  // ─── TELA INSS ────────────────────────────────────────
  const TelaINSS = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <Header titulo="Meu INSS" onBack={() => setTela('home')} />
      <div className="flex-1 p-5 overflow-auto">
        <div className="p-4 mb-4 bg-green-50 rounded-2xl">
          <p className="text-sm text-green-800">{txt('Aqui você consulta seu tempo de contribuição e simula sua aposentadoria. Use o app Meu INSS para serviços completos.')}</p>
        </div>

        <div className="p-4 mb-3 bg-white shadow-sm rounded-2xl">
          <p className="mb-3 text-sm text-gray-500">{txt('Dados do segurado')}</p>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">{txt('Nome')}</span>
              <span className="font-semibold">{txt(DADOS_USUARIO.nome)}</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between">
              <span className="text-gray-500">{txt('Nascimento')}</span>
              <span>{DADOS_USUARIO.dataNascimento}</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between">
              <span className="text-gray-500">{txt('Tempo de contribuição')}</span>
              <span className="font-bold text-green-700">15 {txt('anos e')} 8 {txt('meses')}</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between">
              <span className="text-gray-500">{txt('Saldo FGTS')}</span>
              <span className="font-bold text-blue-700">R$ 12.450,32</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white shadow-sm rounded-2xl">
          <p className="mb-3 text-sm font-bold text-gray-800">{txt('Regras de aposentadoria')}</p>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• {txt('Por tempo: Homens 35 anos / Mulheres 30 anos')}</p>
            <p>• {txt('Por idade: Homens 65 anos / Mulheres 62 anos')}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── TELA CARTEIRA DE TRABALHO ────────────────────────
  const TelaCarteiraTrabalho = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <Header titulo="Carteira de Trabalho" onBack={() => setTela('home')} />
      <div className="flex-1 p-5 overflow-auto">
        <div className="p-4 mb-4 bg-orange-50 rounded-2xl">
          <p className="text-sm text-orange-800">{txt('A Carteira de Trabalho Digital substitui o documento de papel. Todos os seus contratos de trabalho ficam registrados aqui.')}</p>
        </div>

        <div className="space-y-3">
          {[
            { empresa: 'Supermercado Bom Preço', cargo: 'Auxiliar de Estoque', admissao: '10/01/2023', salario: 'R$ 1.550,00', ativo: true },
            { empresa: 'Construtora Nova Casa', cargo: 'Servente de Obras', admissao: '05/03/2020', saida: '20/12/2022', salario: 'R$ 1.420,00', ativo: false },
            { empresa: 'Limpeza Total Ltda', cargo: 'Auxiliar de Limpeza', admissao: '15/06/2018', saida: '01/02/2020', salario: 'R$ 1.200,00', ativo: false },
          ].map((ct, i) => (
            <div key={i} className={`p-4 bg-white shadow-sm rounded-2xl border-l-4 ${ct.ativo ? 'border-green-500' : 'border-gray-300'}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-gray-800">{txt(ct.empresa)}</p>
                {ct.ativo ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{txt('ATIVO')}</span>
                ) : (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{txt('ENCERRADO')}</span>
                )}
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">{txt('Cargo:')}</span> {txt(ct.cargo)}</p>
                <p><span className="text-gray-500">{txt('Admissão:')}</span> {ct.admissao}</p>
                {ct.saida && <p><span className="text-gray-500">{txt('Saída:')}</span> {ct.saida}</p>}
                <p><span className="text-gray-500">{txt('Salário:')}</span> <span className="font-semibold">{ct.salario}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── TELA AGENDAR RG ──────────────────────────────────
  const TelaRG = () => {
    const [etapa, setEtapa] = useState<'inicio' | 'posto' | 'data' | 'confirmado'>('inicio');
    const [posto, setPosto] = useState('');

    const postos = [
      'Poupatempo Centro - Av. Paulista, 1000',
      'Poupatempo Norte - Rua Voluntários, 500',
      'Poupatempo Sul - Av. Jabaquara, 1500',
      'Posto SAC Shopping - Piso Térreo',
    ];

    const datas = [
      '20/03/2024 (Segunda) - 08:30',
      '21/03/2024 (Terça) - 10:00',
      '22/03/2024 (Quarta) - 14:00',
      '25/03/2024 (Sexta) - 09:00',
    ];

    return (
      <div className="flex flex-col h-full bg-gray-50">
        <Header titulo="Agendar RG" onBack={() => { setEtapa('inicio'); setTela('home'); }} />
        <div className="flex-1 p-5 overflow-auto">
          {etapa === 'inicio' && (
            <>
              <div className="p-4 mb-4 bg-purple-50 rounded-2xl">
                <p className="text-sm text-purple-800">{txt('Agende a emissão da 1ª ou 2ª via do RG. Documentos necessários: Certidão de Nascimento/Casamento original, 2 fotos 3x4 recentes e comprovante de residência.')}</p>
              </div>
              <p className="mb-2 text-sm text-gray-500">{txt('Escolha o posto de atendimento:')}</p>
              <div className="space-y-2">
                {postos.map((p, i) => (
                  <button key={i} onClick={() => { setPosto(p); setEtapa('posto'); }}
                    className="flex items-center justify-between w-full p-4 text-left bg-white shadow-sm rounded-2xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <MapPin size={20} className="text-purple-600" />
                      <span className="text-sm font-medium text-gray-800">{txt(p)}</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-300" />
                  </button>
                ))}
              </div>
            </>
          )}
          {etapa === 'posto' && (
            <>
              <div className="flex items-center gap-2 p-3 mb-4 bg-white shadow-sm rounded-xl">
                <MapPin size={18} className="text-purple-600" />
                <p className="text-sm font-medium text-gray-800">{txt(posto)}</p>
              </div>
              <p className="mb-2 text-sm text-gray-500">{txt('Escolha a data e horário:')}</p>
              <div className="space-y-2">
                {datas.map((d, i) => (
                  <button key={i} onClick={() => setEtapa('confirmado')}
                    className="flex items-center justify-between w-full p-4 text-left bg-white shadow-sm rounded-2xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Calendar size={20} className="text-purple-600" />
                      <span className="text-sm font-medium text-gray-800">{txt(d)}</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-300" />
                  </button>
                ))}
              </div>
            </>
          )}
          {etapa === 'confirmado' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full">
                <Check size={40} className="text-green-600" />
              </motion.div>
              <h2 className="mb-2 text-2xl font-bold text-green-700">{txt('Agendamento Confirmado!')}</h2>
              <div className="p-4 mt-4 text-left bg-white shadow-sm rounded-2xl">
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">{txt('Serviço:')}</span> <span className="font-semibold">{txt('Emissão de RG')}</span></p>
                  <p><span className="text-gray-500">{txt('Nome:')}</span> <span>{txt(DADOS_USUARIO.nome)}</span></p>
                  <p><span className="text-gray-500">{txt('Posto:')}</span> <span>{txt(posto)}</span></p>
                  <p><span className="text-gray-500">{txt('Data:')}</span> <span className="font-bold">{datas[0]}</span></p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-4 mt-4 text-left bg-yellow-50 rounded-2xl">
                <Bell size={18} className="flex-shrink-0 mt-0.5 text-yellow-600" />
                <p className="text-sm text-yellow-800">{txt('Leve os documentos originais e chegue 15 minutos antes do horário agendado.')}</p>
              </div>
            </motion.div>
          )}
        </div>
        <div className="p-4 bg-white border-t">
          {etapa === 'confirmado' && (
            <button onClick={() => { setEtapa('inicio'); setTela('home'); }}
              className="w-full py-4 text-lg font-bold text-white bg-blue-700 rounded-2xl hover:bg-blue-800 transition-all active:scale-95">
              {txt('Voltar ao início')}
            </button>
          )}
        </div>
      </div>
    );
  };

  // ─── TELA CNH DIGITAL ─────────────────────────────────
  const TelaCNH = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <Header titulo="CNH Digital" onBack={() => setTela('home')} />
      <div className="flex-1 p-5 overflow-auto">
        <div className="p-4 mb-4 bg-teal-50 rounded-2xl">
          <p className="text-sm text-teal-800">{txt('A CNH Digital tem o mesmo valor jurídico do documento físico. Baixe o app Carteira Digital de Trânsito para usar no celular.')}</p>
        </div>

        {/* Cartão CNH simulado */}
        <div className="p-6 mb-4 text-white bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={28} />
            <p className="text-lg font-bold">CNH {txt('Digital')}</p>
          </div>
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-20 bg-gray-300 rounded-lg" />
            <div className="text-sm space-y-1">
              <p className="font-bold">{txt(DADOS_USUARIO.nome)}</p>
              <p className="text-teal-200">CPF: {DADOS_USUARIO.cpf}</p>
              <p className="text-teal-200">{txt('Nascimento')}: {DADOS_USUARIO.dataNascimento}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <p className="text-teal-200">{txt('Registro')}</p>
              <p className="font-bold">12345678901</p>
            </div>
            <div>
              <p className="text-teal-200">{txt('Categoria')}</p>
              <p className="font-bold">B</p>
            </div>
            <div>
              <p className="text-teal-200">{txt('Validade')}</p>
              <p className="font-bold">15/06/2026</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white shadow-sm rounded-2xl">
          <p className="mb-3 text-sm font-bold text-gray-800">{txt('Informações adicionais')}</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">{txt('Pontos na carteira')}</span>
              <span className="font-semibold text-yellow-600">4/40</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between">
              <span className="text-gray-500">{txt('Status')}</span>
              <span className="font-semibold text-green-600">{txt('REGULAR')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── TELA AUXÍLIO BRASIL ──────────────────────────────
  const TelaAuxilio = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <Header titulo="Auxílio Brasil" onBack={() => setTela('home')} />
      <div className="flex-1 p-5 overflow-auto">
        <div className="p-5 mb-4 text-center text-white bg-gradient-to-br from-pink-600 to-pink-700 rounded-2xl">
          <Heart size={40} className="mx-auto mb-2" />
          <p className="text-pink-200">{txt('Benefício disponível')}</p>
          <p className="text-3xl font-bold">R$ 600,00</p>
        </div>

        <div className="p-4 mb-3 bg-white shadow-sm rounded-2xl">
          <p className="mb-3 text-sm text-gray-500">{txt('Informações do benefício')}</p>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">{txt('Titular')}</span>
              <span className="font-semibold">{txt(DADOS_USUARIO.nome)}</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between">
              <span className="text-gray-500">{txt('NIS')}</span>
              <span className="font-mono">***.45678.**-*</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between">
              <span className="text-gray-500">{txt('Próximo pagamento')}</span>
              <span className="font-bold text-green-700">22/03/2024</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white shadow-sm rounded-2xl">
          <p className="mb-2 text-sm font-bold text-gray-800">{txt('Calendário de pagamento')}</p>
          <p className="text-sm text-gray-600">{txt('O pagamento segue o final do NIS. Use o app Caixa Tem para movimentar o benefício.')}</p>
        </div>
      </div>
    </div>
  );

  // ─── TELA TÍTULO DE ELEITOR ───────────────────────────
  const TelaTituloEleitor = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <Header titulo="Título de Eleitor" onBack={() => setTela('home')} />
      <div className="flex-1 p-5 overflow-auto">
        <div className="p-4 mb-4 bg-gray-100 rounded-2xl">
          <p className="text-sm text-gray-700">{txt('Consulte sua situação eleitoral, local de votação e emita certidões. Use o app e-Título no celular.')}</p>
        </div>
        <div className="p-4 bg-white shadow-sm rounded-2xl">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">{txt('Situação')}</span>
              <span className="font-semibold text-green-600">{txt('REGULAR')}</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between">
              <span className="text-gray-500">{txt('Zona eleitoral')}</span>
              <span className="font-semibold">0254</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between">
              <span className="text-gray-500">{txt('Seção')}</span>
              <span className="font-semibold">0312</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between">
              <span className="text-gray-500">{txt('Local de votação')}</span>
              <span className="text-right">{txt('Escola Municipal Paulo Freire')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════
  // RENDER PRINCIPAL
  // ═══════════════════════════════════════════════════════
  return (
    <div className="relative h-screen w-full max-w-md mx-auto overflow-hidden bg-gray-50 shadow-2xl md:rounded-3xl"
         style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <AnimatePresence mode="wait">
        {tela === 'home' && (<motion.div key="home" initial={{ opacity: 1 }} exit={{ opacity: 1 }} className="h-full"><TelaHome /></motion.div>)}
        {tela === 'cpf' && (<motion.div key="cpf" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="h-full"><TelaCPF /></motion.div>)}
        {tela === 'inss' && (<motion.div key="inss" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="h-full"><TelaINSS /></motion.div>)}
        {tela === 'carteira-trabalho' && (<motion.div key="ct" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="h-full"><TelaCarteiraTrabalho /></motion.div>)}
        {tela === 'rg' && (<motion.div key="rg" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="h-full"><TelaRG /></motion.div>)}
        {tela === 'cnh' && (<motion.div key="cnh" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="h-full"><TelaCNH /></motion.div>)}
        {tela === 'auxilio' && (<motion.div key="auxilio" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="h-full"><TelaAuxilio /></motion.div>)}
        {tela === 'titulo-eleitor' && (<motion.div key="titulo" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="h-full"><TelaTituloEleitor /></motion.div>)}
      </AnimatePresence>
      <AcessibilidadeBtn onToggle={toggleUppercase} isActive={isUppercase} />
    </div>
  );
}
