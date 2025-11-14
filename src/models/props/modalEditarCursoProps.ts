import { Aluno } from "../aluno";
import { Curso } from "../curso";

export interface ModalEditarCursoProps {
    isOpen: boolean;
    onClose: () => void;
    onDadosAtualizados: () => void;
    dadosCurso: Curso;
    alunosMatriculados: Aluno[];
    todosAlunos: Aluno[];
}