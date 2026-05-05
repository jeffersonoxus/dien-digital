export interface Escola {
    id: number;
    nome: string;
}

export interface Turma {
    id: number;
    nome: string;
    escolaId: number;
}

export interface Aluno {
    id: number;
    nome: string;
    turmaId: number;
}

export const escolas: Escola[] = [
    { id: 1, nome: 'Escola Paulo Freire' },
    { id: 2, nome: 'Escola Santa Ana' },
    { id: 3, nome: 'Escola Dom Bosco' },
    { id: 4, nome: 'Escola Monteiro Lobato' },
    { id: 5, nome: 'Escola Maria Montessori' },
    { id: 6, nome: 'Escola Albert Einstein' },
    { id: 7, nome: 'Escola Benjamin Franklin' },
    { id: 8, nome: 'Escola Charles Darwin' },
    { id: 9, nome: 'Escola Leonardo da Vinci' },
    { id: 10, nome: 'Escola Isaac Newton' },
    { id: 11, nome: 'Escola Marie Curie' },
    { id: 12, nome: 'Escola Nikola Tesla' },
    { id: 13, nome: 'Escola Galileo Galilei' },
    { id: 14, nome: 'Escola Ada Lovelace' },
    { id: 15, nome: 'Escola Thomas Edison' },
    { id: 16, nome: 'Escola Florence Nightingale' },
    { id: 17, nome: 'Escola Sigmund Freud' },
    { id: 18, nome: 'Escola Carl Sagan' },
    { id: 19, nome: 'Escola Alan Turing' },
    { id: 20, nome: 'Escola Rosalind Franklin' },
    { id: 21, nome: 'Escola Stephen Hawking' },
    { id: 22, nome: 'Escola Marie Curie' },
    { id: 23, nome: 'Escola Nikola Tesla' },
    { id: 24, nome: 'Escola Galileo Galilei' },
    { id: 25, nome: 'Escola Ada Lovelace' },
];

export const turmas: Turma[] = [
    { id: 1, nome: 'Turma A', escolaId: 1 },
    { id: 2, nome: 'Turma B', escolaId: 1 },
    { id: 3, nome: 'Turma C', escolaId: 2 },
    { id: 4, nome: 'Turma D', escolaId: 3 },
];

export const alunos: Aluno[] = [
    { id: 1, nome: 'João Silva', turmaId: 1 },
    { id: 2, nome: 'Maria Oliveira', turmaId: 1 },
    { id: 3, nome: 'Pedro Santos', turmaId: 2 },
    { id: 4, nome: 'Ana Costa', turmaId: 3 },
    { id: 5, nome: 'Lucas Pereira', turmaId: 4 },
];