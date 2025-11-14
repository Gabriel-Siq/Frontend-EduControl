import { Curso } from "./curso";
import { Matricula } from "./matricula";

export interface Aluno {
    alunoId: number;
    nome: string;
    email: string;
    dataNascimento: Date;
    matriculas?: Matricula[];
}