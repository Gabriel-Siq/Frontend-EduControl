import { useState } from "react";
import { criarMatricula } from "../../services/matriculaService";
import { ModalMatricularAlunoProps } from "../../models/props/modalMatricularAlunoProps";
import { toast } from "../ui/use-toast";

export function ModalMatricularAluno({ isOpen, onClose, alunoId, cursos, onMatriculaConcluida }: ModalMatricularAlunoProps) {
  if (!isOpen) return null;

  const [cursoSelecionado, setCursoSelecionado] = useState("");

  const handleSubmit = async () => {
    if (!cursoSelecionado) {
      toast({
        title: "Selecione um curso",
        variant: "destructive"
      })
      return;
    }

    const payload = {
        alunoId: alunoId,
        cursoId: Number(cursoSelecionado)
    }

    try {
      await criarMatricula(payload);
      toast({
        title: "Matrícula realizada com sucesso!",
        variant: "default"
      })
      onMatriculaConcluida();
      onClose();
    } catch (err: any) {
      console.error(err?.response?.data);
      toast({
        title: "Erro ao realizar a matrícula",
        variant: "destructive"
      })
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white w-96 p-6 rounded shadow relative">
        <h2 className="text-xl font-semibold mb-4">Matricular Aluno</h2>

        <select
          className="w-full border rounded px-3 py-2 mb-4"
          value={cursoSelecionado}
          onChange={(e) => setCursoSelecionado(e.target.value)}
        >
          <option value="">Selecione um curso</option>

          {cursos.map((curso) => (
            <option key={curso.cursoId} value={curso.cursoId}>
              {curso.nome}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
            onClick={handleSubmit}
          >
            Matricular
          </button>
        </div>
      </div>
    </div>
  );
}