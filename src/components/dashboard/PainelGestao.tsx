import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Aluno } from "../../models/aluno";
import { Curso } from "../../models/curso";
import { deletarAluno, listarAlunos } from "../../services/alunoService";
import { deletarCurso, listarCursos } from "../../services/cursoService";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { ModalCriarAluno } from "../aluno/ModalCriarAluno";
import { ModalEditarAluno } from "../aluno/ModalEditarAluno";
import { ModalCriarCurso } from "../curso/ModalCriarCurso";
import { ModalExcluir } from "../ModalExcluir";
import { Paginacao } from "./Paginacao";
import { ModalEditarCurso } from "../curso/ModalEditarCurso";
import { Matricula } from "../../models/matricula";
import { listarMatriculas } from "../../services/matriculaService";

export default function PainelGestao() {
  const [abaAtiva, setAbaAtiva] = useState<"cursos" | "alunos">("cursos");
  
  const [_, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;
  const indexInicio = (paginaAtual - 1) * itensPorPagina;
  const indexFim = indexInicio + itensPorPagina;

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);

  const [mostrarAtivos, setMostrarAtivos] = useState(false);
  const alunosFiltrados = mostrarAtivos
    ? alunos.filter(aluno =>
        matriculas.some(m => m.alunoId === aluno.alunoId)
      )
    : alunos;

  const alunosPaginados = alunosFiltrados.slice(indexInicio, indexFim);
  const totalPaginasAlunos = Math.ceil(alunosFiltrados.length / itensPorPagina);
  const totalPaginasCursos = Math.ceil(cursos.length / itensPorPagina);
  
  const [modalCriarAlunoOpen, setModalCriarAlunoOpen] = useState(false);
  const [modalEditarAlunoOpen, setModalEditarAlunoOpen] = useState(false);

  const [modalCriarCursoOpen, setModalCriarCursoOpen] = useState(false);
  const [modalEditarCursoOpen, setModalEditarCursoOpen] = useState(false);
  
  const [acaoExcluir, setAcaoExcluir] = useState<{isOpen: boolean; mensagem: string; onConfirm: () => void;} | null>(null);
  
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);
  const [cursoSelecionado, setCursoSelecionado] = useState<Curso | null>(null);
  
  const cursosPorAluno = (alunoId?: number) => {
    const matriculasDoAluno = matriculas.filter(m => m.alunoId === alunoId);

    const cursosDoAluno = cursos.filter(c =>
      matriculasDoAluno.some(m => m.cursoId === c.cursoId)
    );

    return cursosDoAluno;
  };

  const alunosPorCurso = (cursoId: number) => {
    const matriculasDoCurso = matriculas.filter(m => m.cursoId === cursoId);

    const alunosDoCurso = alunos.filter(a =>
      matriculasDoCurso.some(m => m.alunoId === a.alunoId)
    );

    return alunosDoCurso;
  };

  const handleGetMatriculas = async () => {
    try {
      setLoading(true);
      const data = await listarMatriculas();
      setMatriculas(data);
    }catch(error){
      console.error(error)
    }finally{
      setLoading(false)
    }
  }

  const handleGetCursos = async () => {
    try {
      setLoading(true);
      const data = await listarCursos();
      setCursos(data);
    }catch(error){
      console.error(error)
    }finally{
      setLoading(false)
    }
  }

  const handleGetAlunos = async () => {
    try {
      setLoading(true);
      const data = await listarAlunos();
      setAlunos(data);
    }catch(error){
      console.error(error)
    }finally {
      setLoading(false);
    }
  }

  const handleRecarregarDados = () => {
    handleGetMatriculas();
    handleGetCursos();
    handleGetAlunos();
  };

  useEffect(() => {
    handleRecarregarDados();
  }, [])

  const handleAbrirModalExcluirCurso = (curso: Curso) => {
    setAcaoExcluir({
      isOpen: true,
      mensagem: `Tem certeza que deseja excluir o curso "${curso.nome}" e todas as suas matrículas?`,
      onConfirm: async () => {
        await deletarCurso(curso.cursoId);
        handleGetCursos();
        handleGetMatriculas();
        setAcaoExcluir(null);
      },
    });
  };

  const handleAbrirModalExcluirAluno = (aluno: Aluno) => {
    setAcaoExcluir({
      isOpen: true,
      mensagem: `Tem certeza que deseja excluir o aluno "${aluno.nome}" e todas as suas matrículas?`,
      onConfirm: async () => {
        await deletarAluno(aluno.alunoId); 
        handleGetAlunos();
        handleGetMatriculas();
        setAcaoExcluir(null);
      },
    });
  };

  return (
    <main className="flex-1 p-8">
      <ul className="nav nav-tabs mb-0 border-gray-300">
        <li className="nav-item">
          <button
            onClick={() => setAbaAtiva("cursos")}
            className={`nav-link text-sm font-medium transition-colors duration-150 ${
              abaAtiva === "cursos"
                ? "active bg-white border-gray-300 border-x border-t border-b-0 text-gray-800 rounded-t-md rounded-b-none"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent rounded-md"
            }`}
            style={{ marginBottom: "-1px" }}
          >
            Cursos
          </button>
        </li>
        <li className="nav-item">
          <button
            onClick={() => setAbaAtiva("alunos")}
            className={`nav-link text-sm font-medium transition-colors duration-150 ${
              abaAtiva === "alunos"
                ? "active bg-white border-gray-300 border-x border-t border-b-0 text-gray-800 rounded-t-md rounded-b-none"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent rounded-md"
            }`}
            style={{ marginBottom: "-1px" }}
          >
            Alunos
          </button>
        </li>
      </ul>

      <div className="border-gray-300 rounded-b-md p-4 bg-white">
        {abaAtiva === "cursos" ? (
          <div>
            <div className="d-flex justify-between">
              <h2 className="text-xl font-semibold mb-3 text-gray-700">
                Lista de Cursos
              </h2>
              <button
                className="flex items-center gap-2 px-4 py-2 border-2 border-goldcustom bg-white text-goldcustom font-semibold rounded-md hover:bg-yellow-50 transition"
                onClick={() => setModalCriarCursoOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Criar Curso
              </button>
              <ModalCriarCurso onCursoCriado={handleGetCursos} isOpen={modalCriarCursoOpen} onClose={() => setModalCriarCursoOpen(false)} />
              <ModalEditarCurso isOpen={modalEditarCursoOpen} onClose={() => setModalEditarCursoOpen(false)} dadosCurso={cursoSelecionado!} 
              onDadosAtualizados={handleRecarregarDados} alunosMatriculados={alunosPorCurso(cursoSelecionado?.cursoId!)} todosAlunos={alunos}/>
            </div>
            <table className="table table-sm table-hover align-middle mb-0 mt-3">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nome</th>
                  <th>Descricao</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {cursos.map((curso) => (
                  <tr key={curso.cursoId} className="border-b hover:bg-accent/50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-medium text-sm">#{curso.cursoId}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-sm">{curso.nome}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-sm">{curso.descricao}</p>
                    </td>
                    <td className="py-4 px-4 text-center flex justify-center gap-3 border-none">
                      <Edit3
                        className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer transition"
                        onClick={() => {
                          setCursoSelecionado(curso);
                          setModalEditarCursoOpen(true);
                          alunosPorCurso(curso.cursoId)
                        }}
                      />
                      <Trash2
                        className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer transition"
                        onClick={() => {handleAbrirModalExcluirCurso(curso)}}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <div>
                <Paginacao
                  totalPaginas={totalPaginasCursos}
                  paginaAtual={paginaAtual}
                  setPaginaAtual={setPaginaAtual}
                />
              </div>
            </table>
          </div>
        ) : (
          <div>
            <div className="d-flex justify-between">
              <div className="flex items-center gap-5">
                <h2 className="text-xl font-semibold text-gray-700">
                  Lista de Alunos
                </h2>
                <div
                  className="flex items-center gap-2 cursor-pointer select-none"
                  onClick={() => setMostrarAtivos(!mostrarAtivos)}
                >
                  <div
                    className={`w-10 h-5 flex items-center rounded-full p-1 transition-all ${
                      mostrarAtivos ? "bg-green-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${
                        mostrarAtivos ? "translate-x-5" : ""
                      }`}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-700">
                    Mostrar apenas alunos matriculados
                  </span>
                </div>
              </div>
              <button
                className="flex items-center gap-2 px-4 py-2 border-2 border-goldcustom bg-white text-goldcustom font-semibold rounded-md hover:bg-yellow-50 transition"
                onClick={() => setModalCriarAlunoOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Criar Aluno
              </button>
              <ModalCriarAluno onAlunoCriado={handleGetAlunos} isOpen={modalCriarAlunoOpen} onClose={() => setModalCriarAlunoOpen(false)} />
              <ModalEditarAluno isOpen={modalEditarAlunoOpen} onClose={() => {setModalEditarAlunoOpen(false)}} dadosAluno={alunoSelecionado!} 
              onDadosAtualizados={handleRecarregarDados} cursosMatriculados={cursosPorAluno(alunoSelecionado?.alunoId)} />
            </div>
            <table className="table table-sm table-hover align-middle mb-0 mt-3">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Data de Nascimento</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {alunosPaginados.map((aluno) => (
                  <tr key={aluno.alunoId} className="border-b hover:bg-accent/50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-medium text-sm">#{aluno.alunoId}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-sm">{aluno.nome}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-sm">{aluno.email}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-medium text-muted-foreground line-clamp-2">
                        {aluno.dataNascimento ? new Date(aluno.dataNascimento).toLocaleDateString("pt-BR") : "-"}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-medium text-muted-foreground line-clamp-2">
                        {matriculas.some(m => m.alunoId === aluno.alunoId)
                          ? "Matriculado"
                          : "Não matriculado"}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-center flex justify-center gap-3 border-none">
                      <Edit3
                        className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer transition" 
                        onClick={() => {
                          setAlunoSelecionado(aluno);
                          setModalEditarAlunoOpen(true);
                          cursosPorAluno(aluno.alunoId);
                        }}
                      />
                      <Trash2
                        className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer transition"
                        onClick={() => {handleAbrirModalExcluirAluno(aluno)}}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <div>
                <Paginacao
                  totalPaginas={totalPaginasAlunos}
                  paginaAtual={paginaAtual}
                  setPaginaAtual={setPaginaAtual}
                />
              </div>
            </table>
          </div>
        )}
        {acaoExcluir && (
          <ModalExcluir
            isOpen={acaoExcluir.isOpen}
            onClose={() => setAcaoExcluir(null)}
            mensagem={acaoExcluir.mensagem}
            onConfirm={acaoExcluir.onConfirm}
          />
        )}
      </div>
    </main>
  );
}
