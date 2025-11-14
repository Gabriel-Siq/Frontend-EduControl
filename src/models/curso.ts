import { Aluno } from "./aluno";
import { Matricula } from "./matricula";

export interface Curso {
    cursoId: number;
    nome: string;
    descricao: string
    alunos?: Aluno[];
    matriculas?: Matricula[]
}