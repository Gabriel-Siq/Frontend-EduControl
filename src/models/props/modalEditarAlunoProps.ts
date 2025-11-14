import { Aluno } from "../aluno";
import { Curso } from "../curso";

export interface ModalEditarAlunoProps {
    isOpen: boolean;
    onClose: () => void;
    dadosAluno: Aluno;
    cursosMatriculados: Curso[];
    onDadosAtualizados: () => void
}