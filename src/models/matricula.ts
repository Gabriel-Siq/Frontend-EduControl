import { Aluno } from "./aluno";
import { Curso } from "./curso";

export interface Matricula {
    id: number;
    alunoId: number
    aluno: Aluno
    cursoId: number;
    curso: Curso
}