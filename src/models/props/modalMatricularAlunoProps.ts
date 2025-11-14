import { Curso } from "../curso";

export interface ModalMatricularAlunoProps {
  isOpen: boolean;
  onClose: () => void;
  alunoId: number;
  cursos: Curso[];
  onMatriculaConcluida: () => void
}