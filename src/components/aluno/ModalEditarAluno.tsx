import { useEffect, useState } from "react";
import { ModalEditarAlunoProps } from "../../models/props/modalEditarAlunoProps";
import { atualizarAluno } from "../../services/alunoService";
import { Trash2 } from "lucide-react";
import { Curso } from "../../models/curso";
import { ModalExcluir } from "../ModalExcluir";
import { listarCursos } from "../../services/cursoService";
import { deletarMatricula } from "../../services/matriculaService";
import { ModalMatricularAluno } from "../matricula/ModalMatricularAluno";

export function ModalEditarAluno({ isOpen, onClose, dadosAluno, cursosMatriculados, onDadosAtualizados }: ModalEditarAlunoProps) {
  if (!isOpen) return null;

  const [cursoSelecionado, setCursoSelecionado] = useState<Curso | null>(null);
  const [cursosDisponiveis, setCursosDisponiveis] = useState<Curso[]>([]);

  const [modalExcluirOpen, setModalExcluirOpen] = useState(false);
  const [modalMatricularOpen, setModalMatricularOpen] = useState(false);
  
  const [alunoAtualizado, setAlunoAtualizado] = useState({
    nome: dadosAluno.nome,
    email: dadosAluno.email,
    dataNascimento: dadosAluno.dataNascimento.toString().split("T")[0],
  });

  useEffect(() => {
    if (isOpen) {
      handleCursosDisponiveis().then(setCursosDisponiveis);
    }
  }, [isOpen]);

  const handleCursosDisponiveis = async () => {
    try {
      const todosCursos: Curso[] = await listarCursos();
      const cursosMatriculadosIds = cursosMatriculados.map(c => c.cursoId);

      const cursosDisponiveis = todosCursos.filter(
        curso => !cursosMatriculadosIds.includes(curso.cursoId)
      );
      setCursosDisponiveis(cursosDisponiveis)
      return cursosDisponiveis;

    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const isAdulto = (data: Date): boolean => {
    const hoje = new Date();
    
    const dataAdulto = new Date(
      hoje.getFullYear() - 18,
      hoje.getMonth(),
      hoje.getDate()
    );

    return data <= dataAdulto;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlunoAtualizado({ ...alunoAtualizado, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      nome: alunoAtualizado.nome,
      email: alunoAtualizado.email,
      dataNascimento: new Date(alunoAtualizado.dataNascimento)
    }

    if(!isAdulto(payload.dataNascimento)){
      alert("Não é possível cadastrar aluno com menos de 18 anos.")
      return
    }

    try {
      await atualizarAluno(dadosAluno.alunoId, payload);
      alert("Aluno editado com sucesso!");
      onDadosAtualizados();
      onClose();
    } catch (error) {
      console.error("Erro ao editar aluno:", error);
      alert("Erro ao editar aluno");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-160 p-6 relative">
        <h2 className="text-xl font-bold mb-4">Editar Aluno</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            className="border rounded px-3 py-2"
            value={alunoAtualizado?.nome}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="border rounded px-3 py-2"
            value={alunoAtualizado?.email}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="dataNascimento"
            placeholder="Data de Nascimento"
            className="border rounded px-3 py-2"
            value={alunoAtualizado.dataNascimento}
            onChange={(e) =>
              setAlunoAtualizado({ ...alunoAtualizado, dataNascimento: e.target.value })
            }
          />
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Cursos Matriculados</h3>

            <div className="border rounded-lg overflow-hidden">
              <table className="table-fixed w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-2 w-3/4 text-left">Curso</th>
                    <th className="p-2 w-3/4 text-left">Descrição</th>
                    <th className="p-2 w-1/4 text-center">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {cursosMatriculados.length > 0 ? (
                    cursosMatriculados.map((curso: any, index: number) => (
                      <tr key={index} className="border-b text-left">
                        <td className="p-2">{curso.nome}</td>
                        <td className="p-2 text-left">{curso.descricao}</td>

                        <td className="p-2 text-center flex justify-center items-center">
                          <Trash2
                            className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer transition"
                            onClick={() => {
                              setCursoSelecionado(curso);
                              setModalExcluirOpen(true);
                            }}
                          />
                        </td>
                        <ModalExcluir
                          isOpen={modalExcluirOpen}
                          onClose={() => setModalExcluirOpen(false)}
                          mensagem="Tem certeza que deseja cancelar a matrícula?"
                          onConfirm={async () => {
                            if (curso) {
                              await deletarMatricula(dadosAluno.alunoId, curso.cursoId);
                              onDadosAtualizados();
                              onClose(); 
                            }
                          }}
                        />
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="p-3 text-center text-gray-500">
                        Nenhum curso matriculado.
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
            <ModalMatricularAluno
              isOpen={modalMatricularOpen}
              onClose={() => setModalMatricularOpen(false)}
              alunoId={dadosAluno.alunoId}
              cursos={cursosDisponiveis}
              onMatriculaConcluida={() => {
                onDadosAtualizados();
                handleCursosDisponiveis();
              }}
            />
          </div>

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
