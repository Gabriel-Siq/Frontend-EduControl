import { useState } from "react";
import { criarMatricula } from "../../services/matriculaService";
import { ModalMatricularCursoProps } from "../../models/props/modalMatricularCursoProps";


export function ModalMatricularCurso({ isOpen, onClose, cursoId, alunosDisponiveis, onMatriculaConcluida }: ModalMatricularCursoProps) {
  if (!isOpen) return null;

  const [alunoSelecionado, setAlunoSelecionado] = useState("");

  const handleSubmit = async () => {
    if (!alunoSelecionado) {
      alert("Selecione um aluno");
      return;
    }
    const payload = {
      alunoId: Number(alunoSelecionado),
      cursoId: cursoId
    };

    try {
      await criarMatricula(payload);
      alert("Matrícula realizada com sucesso!");
      onMatriculaConcluida();
    } catch (err: any) {
      console.error(err?.response?.data);
      alert("Erro ao matricular aluno.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white w-96 p-6 rounded shadow relative">
        <h2 className="text-xl font-semibold mb-4">Matricular Aluno no Curso</h2>
        
        <select 
          className="w-full border rounded px-3 py-2 mb-4" 
          value={alunoSelecionado} 
          onChange={(e) => setAlunoSelecionado(e.target.value)}
        >
          <option value="">Selecione um aluno</option>
          {alunosDisponiveis.map((aluno) => (
            <option key={aluno.alunoId} value={aluno.alunoId}>
              {aluno.nome}
            </option>
          ))}
        </select>

        {alunosDisponiveis.length === 0 && (
            <p className="text-center text-gray-500 mb-4">Todos os alunos já estão matriculados neste curso.</p>
        )}

        <div className="flex justify-end gap-2">
          <button 
            type="button"
            className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500" 
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            type="button"
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 disabled:bg-blue-300" 
            onClick={handleSubmit}
            disabled={alunosDisponiveis.length === 0}
          >
            Matricular
          </button>
        </div>
      </div>
    </div>
  );
}
