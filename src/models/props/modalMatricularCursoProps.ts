import { Aluno } from "../aluno";

export interface ModalMatricularCursoProps {
  isOpen: boolean;
  onClose: () => void;
  cursoId: number;
  alunosDisponiveis: Aluno[];
  onMatriculaConcluida: () => void;
}