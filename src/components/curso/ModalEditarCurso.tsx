import { useState } from "react";
import { ModalEditarCursoProps } from "../../models/props/modalEditarCursoProps";
import { atualizarCurso } from "../../services/cursoService";
import { Aluno } from "../../models/aluno";
import { Trash2 } from "lucide-react";
import { deletarMatricula } from "../../services/matriculaService";
import { ModalExcluir } from "../ModalExcluir";
import { ModalMatricularCurso } from "../matricula/ModalMatricularCurso";
import { toast } from "../ui/use-toast";

export function ModalEditarCurso({ isOpen, onClose, onDadosAtualizados, dadosCurso, alunosMatriculados, todosAlunos }: ModalEditarCursoProps) {
  if (!isOpen) return null;

  const [modalExcluirOpen, setModalExcluirOpen] = useState(false);
  const [modalMatricularOpen, setModalMatricularOpen] = useState(false);

  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);
  const alunosDisponiveis = todosAlunos.filter(aluno => 
    !alunosMatriculados.some(matriculado => matriculado.alunoId === aluno.alunoId)
  );

  const [cursoAtualizado, setCursoAtualizado] = useState({
    nome: dadosCurso.nome,
    descricao: dadosCurso.descricao,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCursoAtualizado({ ...cursoAtualizado, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      nome: cursoAtualizado.nome,
      descricao: cursoAtualizado.descricao,
    };

    try {
      await atualizarCurso(dadosCurso.cursoId, payload);
      toast({
        title: "Curso editado com sucesso!",
        variant: "default"
      })
      onDadosAtualizados();
      onClose();
    } catch (error) {
      console.error("Erro ao editar curso:", error);
      toast({
        title: "Erro ao editar curso",
        variant: "destructive"
      })
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-160 p-6 relative">
        <h2 className="text-xl font-bold mb-4">Editar Curso</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            className="border rounded px-3 py-2"
            value={cursoAtualizado?.nome}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="descricao"
            placeholder="Descrição"
            className="border rounded px-3 py-2"
            value={cursoAtualizado?.descricao}
            onChange={handleChange}
            required
          />
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Alunos Matriculados</h3>
            <div className="border rounded-lg overflow-hidden max-h-60 overflow-y-auto">
              <table className="table-fixed w-full text-sm">
                <thead className="bg-gray-100 border-b sticky top-0">
                  <tr>
                    <th className="p-2 w-1/2 text-left">Nome</th>
                    <th className="p-2 w-1/2 text-left">Email</th>
                    <th className="p-2 w-1/4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {alunosMatriculados.length > 0 ? (
                    alunosMatriculados.map((aluno) => (
                      <tr key={aluno.alunoId} className="border-b text-left">
                        <td className="p-2">{aluno.nome}</td>
                        <td className="p-2">{aluno.email}</td>
                        <td className="p-2 text-center flex justify-center items-center">
                          <Trash2
                            className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer transition"
                            onClick={() => {
                              setAlunoSelecionado(aluno);
                              setModalExcluirOpen(true);
                            }}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-3 text-center text-gray-500">
                        Nenhum aluno matriculado neste curso.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              className="mt-3 px-3 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
              onClick={() => setModalMatricularOpen(true)}
            >
              Matricular Aluno
            </button>
            
            <ModalMatricularCurso
              isOpen={modalMatricularOpen}
              onClose={() => setModalMatricularOpen(false)}
              cursoId={dadosCurso.cursoId}
              alunosDisponiveis={alunosDisponiveis}
              onMatriculaConcluida={() => {
                onDadosAtualizados();
                setModalMatricularOpen(false);
              }}
            />
          </div>
          
          {alunoSelecionado && (
            <ModalExcluir
              isOpen={modalExcluirOpen}
              onClose={() => setModalExcluirOpen(false)}
              mensagem={`Tem certeza que deseja cancelar a matrícula de ${alunoSelecionado.nome}?`}
              onConfirm={async () => {
                if (alunoSelecionado) {
                  await deletarMatricula(alunoSelecionado.alunoId, dadosCurso.cursoId);
                  onDadosAtualizados();
                  setModalExcluirOpen(false);
                }
              }}
            />
          )}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
              >
              Salvar
            </button>
          </div>
        </form>

        <span
          className="absolute top-3 right-5 text-gray-500 hover:text-gray-800 text-3xl cursor-pointer select-none"
          onClick={onClose}
        >
          ×
        </span>
      </div>
    </div>
  );
}
