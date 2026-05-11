'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, Search, Star, Archive, Trash2, Mail,
  Paperclip, Image, X, ChevronRight, Send, MoreVertical,
  AlertTriangle, Check, Shield, Edit3,
  User, Users, ShoppingBag, Activity, AlignJustify, Bell
} from 'lucide-react';

// ─── Tipos ────────────────────────────────────────────────
type Tela = 'home' | 'ler' | 'escrever' | 'enviado' | 'anexo' | 'suspeito' | 'suspeito-teste';
type Categoria = 'principal' | 'social' | 'promocoes';

interface Email {
  id: string;
  remetente: string;
  emailRemetente: string;
  assunto: string;
  preview: string;
  conteudo: string;
  hora: string;
  data: string;
  naoLida: boolean;
  temAnexo: boolean;
  favorito: boolean;
  suspeito?: boolean;
  motivoSuspeito?: string;
  categoria?: Categoria;
}

// ─── Dados ────────────────────────────────────────────────
const CAIXA_ENTRADA: Email[] = [
  {
    id: '1', remetente: 'Maria Silva', emailRemetente: 'maria.silva@email.com',
    assunto: 'Re: Reunião de pais amanhã',
    preview: 'Olá, confirmando nossa reunião de pais...',
    conteudo: 'Olá!\n\nConfirmo nossa reunião de pais para amanhã, dia 20/03, às 19h na escola.\n\nPor favor, traga o boletim do semestre passado.\n\nAtenciosamente,\nMaria Silva\nCoordenadora Pedagógica',
    hora: '10:45', data: '19/03/2024', naoLida: true, temAnexo: false, favorito: false, categoria: 'principal'
  },
  {
    id: '2', remetente: 'UBS Jardim América', emailRemetente: 'ubs.jardim@saude.gov.br',
    assunto: 'Confirmação de consulta médica',
    preview: 'Sua consulta foi agendada para o dia...',
    conteudo: 'Prezado(a) Paciente,\n\nSua consulta com Dr. Carlos Oliveira (Clínico Geral) foi agendada para:\n\n📅 Data: 25/03/2024\n🕐 Horário: 14:30\n📍 Local: UBS Jardim América - Sala 3\n\nDocumentos necessários: RG, CPF e Cartão do SUS.\n\nEm caso de dúvidas, ligue: (11) 3456-7890',
    hora: '09:30', data: '18/03/2024', naoLida: false, temAnexo: false, favorito: true, categoria: 'principal'
  },
  {
    id: '3', remetente: '🏦 Banco Central', emailRemetente: 'atendimento@bancocentral-oficial.com',
    assunto: 'URGENTE: Atualize seu cadastro PIX',
    preview: 'Prezado cliente, seu PIX será bloqueado...',
    conteudo: '⚠️ AVISO URGENTE ⚠️\n\nPrezado cliente,\n\nSeu cadastro PIX está DESATUALIZADO e será BLOQUEADO em 24 horas.\n\nPara evitar o bloqueio, clique no link abaixo e atualize seus dados:\n\n👉 http://bit.ly/atualizar-pix-urgente\n\nEquipe Banco Central',
    hora: '08:15', data: '17/03/2024', naoLida: true, temAnexo: false, favorito: false, suspeito: true,
    motivoSuspeito: 'E-mail FALSO se passando pelo Banco Central. Sinais: remetente estranho, linguagem de urgência, link suspeito (bit.ly), pedido de dados pessoais. O Banco Central NÃO envia e-mails pedindo atualização de PIX!',
    categoria: 'principal'
  },
  {
    id: '4', remetente: 'Ana Costa', emailRemetente: 'ana.costa@email.com',
    assunto: 'Fotos do aniversário 🎂',
    preview: 'Oi! Seguem as fotos que tirei no...',
    conteudo: 'Oi, irmã! ❤️\n\nSeguem as fotos que tirei no aniversário da mamãe.\n\nFicaram lindas! Já imprimi algumas para o álbum.\n\nBeijos,\nAna 📸',
    hora: '15:20', data: '16/03/2024', naoLida: false, temAnexo: true, favorito: true, categoria: 'social'
  },
  {
    id: '5', remetente: 'Farmácia Saúde', emailRemetente: 'farmacia@saude.com',
    assunto: 'Sua receita está pronta para retirada',
    preview: 'Prezado(a), sua receita médica já está disponível...',
    conteudo: 'Prezado(a) Cliente,\n\nSua receita médica foi processada e está pronta para retirada.\n\n📋 Receita: Amoxicilina 500mg - 14 comprimidos\n💰 Valor: R$ 24,90\n\nRetire na unidade mais próxima ou use nosso delivery.\n\nFarmácia Saúde - Cuidando de você! 💊',
    hora: '11:00', data: '15/03/2024', naoLida: false, temAnexo: false, favorito: false, categoria: 'promocoes'
  },
  {
    id: '6', remetente: 'Golpistas Online', emailRemetente: 'premio@sorteio-falso.xyz',
    assunto: 'PARABÉNS! Você ganhou R$ 5.000! 🎉',
    preview: 'Você foi sorteado! Clique aqui para receber...',
    conteudo: '🎉 PARABÉNS!!! 🎉\n\nVocê foi o(a) GANHADOR(A) do nosso sorteio de R$ 5.000,00!\n\nPara receber seu prêmio, basta:\n1. Clicar no link abaixo\n2. Informar seus dados bancários\n3. Pronto! O dinheiro cai na hora!\n\n👉 https://sorteio-premio-gratis.com\n\nNão perca tempo! Promoção válida ATÉ HOJE!\n\nEquipe Sorteios Brasil',
    hora: '22:30', data: '14/03/2024', naoLida: true, temAnexo: false, favorito: false, suspeito: true,
    motivoSuspeito: 'GOLPE CLÁSSICO! Sinais: site falso (.xyz), promessa de dinheiro GRÁTIS, pede dados bancários, linguagem de urgência. NUNCA clique nesse tipo de link. Você não ganhou nada. Ninguém dá dinheiro de graça.',
    categoria: 'principal'
  },
];

// ─── Acessibilidade ──────────────────────────────────────
function BtnAcessibilidade({ onToggle, isActive }: { onToggle: () => void; isActive: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed z-50 bottom-24 right-4">
      <button onClick={() => setOpen(!open)}
        className="p-3 text-white bg-red-600 rounded-full shadow-lg hover:bg-red-700">
        <Activity size={24} />
      </button>
      {open && (
        <div className="absolute right-0 p-3 space-y-2 bg-white rounded-2xl shadow-xl bottom-16 min-w-[200px] animate-slide-up">
          <p className="px-2 text-xs text-gray-400">Acessibilidade</p>
          <button onClick={() => { onToggle(); setOpen(false); }}
            className="flex items-center w-full gap-3 px-3 py-2 rounded-xl hover:bg-gray-100">
            <AlignJustify size={18} className="text-red-600" />
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

// ─── COMPONENTES DE TELA ─────────────────────────────────

function TelaHome({ onAbrirEmail, onEscrever, txt, categoriaAtiva, setCategoriaAtiva }: {
  onAbrirEmail: (email: Email) => void;
  onEscrever: () => void;
  txt: (s: string) => string;
  categoriaAtiva: Categoria;
  setCategoriaAtiva: (c: Categoria) => void;
}) {
  const emails = CAIXA_ENTRADA.filter(e => {
    if (categoriaAtiva === 'principal') return true;
    return e.categoria === categoriaAtiva;
  }).sort((a, b) => {
    if (a.naoLida && !b.naoLida) return -1;
    if (!a.naoLida && b.naoLida) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 py-3 bg-red-600">
        <button onClick={() => window.location.href = '/'} className="p-1">
          <ArrowLeft size={24} className="text-white" />
        </button>
        <h1 className="text-lg font-bold text-white">Gmail</h1>
        <button className="p-1"><Search size={22} className="text-white" /></button>
      </div>
      <div className="flex px-4 py-2 space-x-2 overflow-x-auto bg-white border-b">
        {([
          { id: 'principal' as Categoria, label: 'Principal', icon: Mail },
          { id: 'social' as Categoria, label: 'Social', icon: Users },
          { id: 'promocoes' as Categoria, label: 'Promocoes', icon: ShoppingBag },
        ]).map(cat => (
          <button key={cat.id} onClick={() => setCategoriaAtiva(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              categoriaAtiva === cat.id ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            <cat.icon size={16} /> {txt(cat.label)}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto">
        {emails.map(email => (
          <button key={email.id} onClick={() => onAbrirEmail(email)}
            className={`flex items-start gap-3 w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 ${
              email.naoLida ? 'bg-blue-50/50' : ''
            }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              email.suspeito ? 'bg-red-100' : 'bg-gray-200'
            }`}>
              {email.suspeito ? <AlertTriangle size={18} className="text-red-600" /> : <User size={18} className="text-gray-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className={`text-sm truncate ${email.naoLida ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                  {txt(email.remetente)}
                  {email.suspeito && <span className="ml-1 text-xs text-red-500">⚠️</span>}
                </p>
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  {email.favorito && <Star size={14} className="text-yellow-500" fill="#eab308" />}
                  {email.temAnexo && <Paperclip size={14} className="text-gray-400" />}
                  <span className="text-xs text-gray-400">{email.hora}</span>
                </div>
              </div>
              <p className={`text-sm truncate ${email.naoLida ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                {txt(email.assunto)}
              </p>
              <p className="text-xs text-gray-400 truncate">{txt(email.preview)}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="p-4 bg-white border-t">
        <button onClick={onEscrever}
          className="flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-red-600 rounded-2xl shadow-lg hover:bg-red-700 active:scale-95 transition-all">
          <Edit3 size={20} /> {txt('Escrever')}
        </button>
      </div>
    </div>
  );
}

function TelaLer({ email, onVoltar, onEscrever, onAnexo, onSuspeito, txt }: {
  email: Email;
  onVoltar: () => void;
  onEscrever: (para: string, assunto: string) => void;
  onAnexo: () => void;
  onSuspeito: () => void;
  txt: (s: string) => string;
}) {
  const e = email;
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
        <button onClick={onVoltar} className="p-1"><ArrowLeft size={24} className="text-gray-700" /></button>
        <div className="flex gap-1">
          <button className="p-2 rounded-full hover:bg-gray-100"><Archive size={20} className="text-gray-600" /></button>
          <button className="p-2 rounded-full hover:bg-gray-100"><Trash2 size={20} className="text-gray-600" /></button>
          <button className="p-2 rounded-full hover:bg-gray-100"><Mail size={20} className="text-gray-600" /></button>
          <button className="p-2 rounded-full hover:bg-gray-100"><MoreVertical size={20} className="text-gray-600" /></button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <h2 className="mb-4 text-xl font-bold text-gray-900">{txt(e.assunto)}</h2>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${e.suspeito ? 'bg-red-100' : 'bg-gray-200'}`}>
            {e.suspeito ? <AlertTriangle size={20} className="text-red-600" /> : <User size={20} className="text-gray-500" />}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800">{txt(e.remetente)}</p>
            <p className="text-xs text-gray-500">{txt('Para: eu')}</p>
          </div>
          <div>
            <p className="text-xs text-right text-gray-400">{e.data}</p>
            <p className="text-xs text-right text-gray-400">{e.hora}</p>
          </div>
        </div>
        {e.suspeito && (
          <div className="flex items-start gap-3 p-4 mb-4 bg-red-50 border border-red-200 rounded-2xl">
            <AlertTriangle size={24} className="flex-shrink-0 text-red-600" />
            <div>
              <p className="mb-1 font-bold text-red-800">⚠️ {txt('E-MAIL SUSPEITO!')}</p>
              <p className="text-sm text-red-700">{txt(e.motivoSuspeito || '')}</p>
              <button onClick={onSuspeito}
                className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-red-600">
                <Shield size={16} /> {txt('Aprender sobre golpes')} <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
        {e.temAnexo && (
          <button onClick={onAnexo}
            className="flex items-center gap-3 w-full p-3 mb-4 bg-gray-50 rounded-xl hover:bg-gray-100">
            <div className="p-2 bg-white rounded-lg shadow-sm"><Image size={20} className="text-blue-500" /></div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-800">📎 {txt('Ver anexo')} - fotos_aniversario.zip</p>
              <p className="text-xs text-gray-400">2.4 MB</p>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        )}
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-gray-800 whitespace-pre-wrap">{txt(e.conteudo)}</p>
        </div>
      </div>
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t">
        <button onClick={() => onEscrever(e.emailRemetente, `Re: ${e.assunto}`)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200">
          <Mail size={16} /> {txt('Responder')}
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200">
          <Users size={16} /> {txt('Encaminhar')}
        </button>
      </div>
    </div>
  );
}

function TelaEscrever({ para, assunto, corpo, anexo, setPara, setAssunto, setCorpo, setAnexo, onVoltar, onEnviar, txt }: {
  para: string; assunto: string; corpo: string; anexo: string | null;
  setPara: (v: string) => void; setAssunto: (v: string) => void; setCorpo: (v: string) => void; setAnexo: (v: string | null) => void;
  onVoltar: () => void; onEnviar: () => void; txt: (s: string) => string;
}) {
  const podeEnviar = para.trim() !== '' && assunto.trim() !== '';

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex items-center px-4 py-3 bg-red-600">
        <button onClick={onVoltar} className="p-1 mr-2"><ArrowLeft size={24} className="text-white" /></button>
        <h1 className="flex-1 text-lg font-bold text-white">{txt('Escrever')}</h1>
      </div>
      <div className="flex-1 p-3 overflow-auto">
        <div className="space-y-3">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="px-3 pt-3">
              <label className="block mb-1 text-xs font-bold text-gray-400 uppercase tracking-wide">{txt('Para')}</label>
            </div>
            <input
              type="text"
              value={para}
              onChange={e => setPara(e.target.value)}
              placeholder={txt('Digite o e-mail do destinatario')}
              autoComplete="off"
              spellCheck={false}
              className="w-full px-3 pb-3 text-lg text-gray-800 bg-white outline-none placeholder:text-gray-300"
            />
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="px-3 pt-3">
              <label className="block mb-1 text-xs font-bold text-gray-400 uppercase tracking-wide">{txt('Assunto')}</label>
            </div>
            <input
              type="text"
              value={assunto}
              onChange={e => setAssunto(e.target.value)}
              placeholder={txt('Digite o assunto do e-mail')}
              autoComplete="off"
              spellCheck={false}
              className="w-full px-3 pb-3 text-lg text-gray-800 bg-white outline-none placeholder:text-gray-300"
            />
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="px-3 pt-3">
              <label className="block mb-1 text-xs font-bold text-gray-400 uppercase tracking-wide">{txt('Mensagem')}</label>
            </div>
            <textarea
              value={corpo}
              onChange={e => setCorpo(e.target.value)}
              placeholder={txt('Escreva sua mensagem aqui...')}
              rows={8}
              spellCheck={false}
              className="w-full px-3 pb-3 text-lg text-gray-800 bg-white outline-none resize-none placeholder:text-gray-300"
            />
          </div>
          {anexo && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-200">
              <Paperclip size={18} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">{anexo}</span>
              <button onClick={() => setAnexo(null)} className="ml-auto"><X size={16} className="text-blue-600" /></button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-3 bg-white border-t">
        <button onClick={() => setAnexo('foto_familia.jpg')}
          className="flex items-center gap-1.5 p-2.5 rounded-xl hover:bg-gray-100">
          <Image size={20} className="text-gray-500" />
          <span className="text-xs font-medium text-gray-600">{txt('Foto')}</span>
        </button>
        <button onClick={() => setAnexo('documento.pdf')}
          className="flex items-center gap-1.5 p-2.5 rounded-xl hover:bg-gray-100">
          <Paperclip size={20} className="text-gray-500" />
          <span className="text-xs font-medium text-gray-600">{txt('Arquivo')}</span>
        </button>
        <div className="flex-1" />
        <button onClick={onEnviar} disabled={!podeEnviar}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm active:scale-95 transition-all ${
            podeEnviar ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}>
          <Send size={18} /> {txt('Enviar')}
        </button>
      </div>
    </div>
  );
}

function TelaEnviado({ para, assunto, anexo, onEscrever, onVoltar, txt }: {
  para: string; assunto: string; anexo: string | null;
  onEscrever: () => void; onVoltar: () => void; txt: (s: string) => string;
}) {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex items-center justify-between px-4 py-3 bg-red-600">
        <button onClick={onVoltar} className="p-1"><ArrowLeft size={24} className="text-white" /></button>
        <h1 className="text-lg font-bold text-white">{txt('Enviado')}</h1>
        <div className="w-8" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="flex items-center justify-center w-20 h-20 mb-6 bg-green-100 rounded-full">
          <Send size={36} className="text-green-600" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-800">{txt('E-mail enviado!')}</h2>
        <p className="mb-8 text-gray-500">{txt('Sua mensagem foi enviada com sucesso.')}</p>
        <div className="w-full p-4 mb-6 text-left bg-white rounded-2xl shadow-sm">
          <p className="mb-3 text-xs text-gray-400">{txt('RESUMO DO ENVIO')}</p>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">{txt('Para:')}</span> <span className="font-medium">{para}</span></p>
            <p><span className="text-gray-500">{txt('Assunto:')}</span> <span className="font-medium">{assunto}</span></p>
            {anexo && <p><span className="text-gray-500">{txt('Anexo:')}</span> <span className="font-medium">{anexo}</span></p>}
          </div>
        </div>
        <div className="flex items-start gap-2 p-4 mb-6 bg-blue-50 rounded-2xl">
          <Bell size={18} className="flex-shrink-0 mt-0.5 text-blue-500" />
          <div className="text-left">
            <p className="mb-1 text-sm font-semibold text-blue-800">{txt('Dica:')}</p>
            <p className="text-sm text-blue-700">{txt('Sempre revise o e-mail do destinatario antes de enviar. Assuntos claros ajudam quem recebe a entender rapidamente.')}</p>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-2 bg-white border-t">
        <button onClick={onEscrever}
          className="w-full py-4 text-lg font-bold text-white bg-red-600 rounded-2xl hover:bg-red-700 active:scale-95 transition-all">
          {txt('Escrever novo e-mail')}
        </button>
        <button onClick={onVoltar}
          className="w-full py-3 font-semibold text-gray-500 rounded-2xl hover:bg-gray-100 transition-colors">
          {txt('Voltar a caixa de entrada')}
        </button>
      </div>
    </div>
  );
}

function TelaAnexo({ onVoltar, txt }: { onVoltar: () => void; txt: (s: string) => string }) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
        <button onClick={onVoltar} className="p-1"><ArrowLeft size={24} className="text-gray-700" /></button>
        <h1 className="text-lg font-bold text-gray-800">{txt('Anexos')}</h1>
        <div className="w-8" />
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <div className="p-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
          <div className="flex items-start gap-2">
            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5 text-yellow-600" />
            <p className="text-sm text-yellow-800">{txt('So abra anexos de remetentes CONHECIDOS e CONFIAVEIS. Anexos de fontes duvidosas podem conter VIRUS!')}</p>
          </div>
        </div>
        <button className="flex items-center gap-3 w-full p-4 mb-2 bg-gray-50 rounded-xl hover:bg-gray-100">
          <div className="p-2 bg-white rounded-lg shadow-sm"><Image size={22} className="text-blue-500" /></div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-800">📸 foto_familia_1.jpg</p>
            <p className="text-xs text-gray-400">1.2 MB • Imagem</p>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
        <button className="flex items-center gap-3 w-full p-4 mb-2 bg-gray-50 rounded-xl hover:bg-gray-100">
          <div className="p-2 bg-white rounded-lg shadow-sm"><Image size={22} className="text-blue-500" /></div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-800">📸 foto_familia_2.jpg</p>
            <p className="text-xs text-gray-400">1.0 MB • Imagem</p>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}

function TelaSuspeito({ onVoltar, onPraticar, txt }: { onVoltar: () => void; onPraticar: () => void; txt: (s: string) => string }) {
  const itens = [
    { titulo: 'Remetente estranho', desc: 'Verifique o endereco de e-mail completo. Bancos usam @banco.com.br, nao @gmail.com.', icon: '👤' },
    { titulo: 'Erros de portugues', desc: 'E-mails oficiais sao bem escritos. Muitos erros = suspeito.', icon: '📝' },
    { titulo: 'Urgencia falsa', desc: '"URGENTE", "Ultima chance", "Sua conta sera bloqueada" — isso e tatica de golpista.', icon: '⏰' },
    { titulo: 'Links estranhos', desc: 'Passe o dedo sobre o link (sem clicar!) e veja se o endereco e confiavel. Links encurtados (bit.ly) escondem o destino.', icon: '🔗' },
    { titulo: 'Pedem dados pessoais', desc: 'Bancos e governo NUNCA pedem senha, CPF ou dados bancarios por e-mail.', icon: '🔐' },
    { titulo: 'Promessas de dinheiro', desc: 'Ninguem da dinheiro de graca. Premios que voce nao concorreu sao GOLPE.', icon: '💰' },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
        <button onClick={onVoltar} className="p-1"><ArrowLeft size={24} className="text-gray-700" /></button>
        <h1 className="text-lg font-bold text-gray-800">{txt('E-mails Suspeitos')}</h1>
        <div className="w-8" />
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <div className="flex items-start gap-2 p-4 mb-4 bg-red-50 rounded-2xl">
          <Shield size={20} className="flex-shrink-0 mt-0.5 text-red-600" />
          <div>
            <p className="mb-1 font-bold text-red-800">{txt('Como identificar um e-mail falso')}</p>
            <p className="text-sm text-red-700">{txt('Golpistas enviam e-mails que parecem reais para roubar seus dados e dinheiro.')}</p>
          </div>
        </div>
        <div className="space-y-3">
          {itens.map((item, i) => (
            <div key={i} className="p-4 bg-white border border-gray-100 shadow-sm rounded-2xl">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="mb-1 font-bold text-gray-800">{txt(item.titulo)}</p>
                  <p className="text-sm text-gray-600">{txt(item.desc)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onPraticar}
          className="w-full py-4 mt-4 text-lg font-bold text-white bg-red-600 rounded-2xl hover:bg-red-700 active:scale-95 transition-all">
          {txt('Praticar: identificar golpes')}
        </button>
      </div>
    </div>
  );
}

function TelaSuspeitoTeste({ onVoltar, txt }: { onVoltar: () => void; txt: (s: string) => string }) {
  const [resposta, setResposta] = useState<number | null>(null);
  const teste = {
    pergunta: 'Qual destes e-mails e MAIS suspeito?',
    opcoes: [
      'Banco do Brasil: "Confirme sua transacao de R$ 50,00" - @bb.com.br',
      'Correios: "Sua encomenda chegou! Retire aqui" - @correios-entrega.xyz',
      'Escola do filho: "Reuniao de pais dia 20/03" - @escola.edu.br',
    ],
    correta: 1,
    explicacao: 'O dominio "@correios-entrega.xyz" e FALSO! Os Correios usam @correios.com.br. O golpista criou um site parecido para enganar voce.'
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 py-3 bg-red-600">
        <button onClick={onVoltar} className="p-1"><ArrowLeft size={24} className="text-white" /></button>
        <h1 className="text-lg font-bold text-white">{txt('Identificar Golpes')}</h1>
        <div className="w-8" />
      </div>
      <div className="flex-1 p-5 overflow-auto">
        <p className="mb-1 text-sm text-gray-500">{txt('Teste 1 de 1')}</p>
        <p className="mb-6 text-lg font-bold text-gray-800">{txt(teste.pergunta)}</p>
        <div className="space-y-3">
          {teste.opcoes.map((op, i) => {
            const selecionada = resposta === i;
            const correta = i === teste.correta;
            let bg = 'bg-gray-50 hover:bg-gray-100 border border-gray-100';
            if (resposta !== null) {
              if (correta) bg = 'bg-green-50 border-green-400 border-2';
              else if (selecionada) bg = 'bg-red-50 border-red-400 border-2';
              else bg = 'bg-gray-50 border border-gray-100';
            }
            return (
              <button key={i} onClick={() => resposta === null && setResposta(i)}
                disabled={resposta !== null}
                className={`flex items-center gap-3 w-full p-4 rounded-2xl text-left transition-all ${bg}`}>
                <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1 text-sm text-gray-800">{txt(op)}</span>
                {resposta !== null && correta && <Check size={20} className="text-green-600" />}
                {resposta !== null && selecionada && !correta && <X size={20} className="text-red-600" />}
              </button>
            );
          })}
        </div>
        {resposta !== null && (
          <div className={`p-4 mt-4 rounded-2xl ${resposta === teste.correta ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className={`mb-1 font-bold ${resposta === teste.correta ? 'text-green-800' : 'text-red-800'}`}>
              {resposta === teste.correta ? '✅ ' + txt('Correto!') : '❌ ' + txt('Errado!')}
            </p>
            <p className="text-sm text-gray-700">{txt(teste.explicacao)}</p>
          </div>
        )}
      </div>
      <div className="p-4 bg-white border-t">
        <button onClick={onVoltar}
          className="w-full py-4 text-lg font-bold text-white bg-red-600 rounded-2xl hover:bg-red-700 active:scale-95 transition-all">
          {txt('Voltar ao inicio')}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════
export default function SimuladorEmail() {
  const [tela, setTela] = useState<Tela>('home');
  const [telaAnterior, setTelaAnterior] = useState<Tela>('home');
  const [emailLido, setEmailLido] = useState<Email | null>(null);
  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria>('principal');
  const [composePara, setComposePara] = useState('');
  const [composeAssunto, setComposeAssunto] = useState('');
  const [composeCorpo, setComposeCorpo] = useState('');
  const [composeAnexo, setComposeAnexo] = useState<string | null>(null);
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

  const irPara = useCallback((destino: Tela) => {
    setTelaAnterior(tela);
    setTela(destino);
  }, [tela]);

  const voltar = useCallback(() => {
    setTela(telaAnterior);
  }, [telaAnterior]);

  const voltarHome = useCallback(() => setTela('home'), []);

  const resetarCompose = useCallback(() => {
    setComposePara('');
    setComposeAssunto('');
    setComposeCorpo('');
    setComposeAnexo(null);
  }, []);

  const handleEscrever = useCallback((para?: string, assunto?: string) => {
    setComposePara(para || '');
    setComposeAssunto(assunto || '');
    setComposeCorpo('');
    setComposeAnexo(null);
    irPara('escrever');
  }, [irPara]);

  const handleEnviar = useCallback(() => {
    irPara('enviado');
  }, [irPara]);

  const renderTela = () => {
    switch (tela) {
      case 'home':
        return (
          <TelaHome
            txt={txt}
            categoriaAtiva={categoriaAtiva}
            setCategoriaAtiva={setCategoriaAtiva}
            onAbrirEmail={(email) => { setEmailLido(email); irPara('ler'); }}
            onEscrever={() => { resetarCompose(); handleEscrever(); }}
          />
        );
      case 'ler':
        if (!emailLido) return null;
        return (
          <TelaLer
            email={emailLido}
            txt={txt}
            onVoltar={voltarHome}
            onEscrever={(para, assunto) => handleEscrever(para, assunto)}
            onAnexo={() => irPara('anexo')}
            onSuspeito={() => irPara('suspeito')}
          />
        );
      case 'escrever':
        return (
          <TelaEscrever
            para={composePara} assunto={composeAssunto} corpo={composeCorpo} anexo={composeAnexo}
            setPara={setComposePara} setAssunto={setComposeAssunto} setCorpo={setComposeCorpo} setAnexo={setComposeAnexo}
            txt={txt} onVoltar={voltar} onEnviar={handleEnviar}
          />
        );
      case 'enviado':
        return (
          <TelaEnviado
            para={composePara} assunto={composeAssunto} anexo={composeAnexo}
            txt={txt}
            onEscrever={() => { resetarCompose(); handleEscrever(); }}
            onVoltar={voltarHome}
          />
        );
      case 'anexo':
        return <TelaAnexo txt={txt} onVoltar={voltar} />;
      case 'suspeito':
        return <TelaSuspeito txt={txt} onVoltar={voltar} onPraticar={() => irPara('suspeito-teste')} />;
      case 'suspeito-teste':
        return <TelaSuspeitoTeste txt={txt} onVoltar={voltar} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative h-screen w-full max-w-md mx-auto overflow-hidden bg-white shadow-2xl md:rounded-3xl"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {renderTela()}
      <BtnAcessibilidade onToggle={toggleUppercase} isActive={isUppercase} />
    </div>
  );
}
