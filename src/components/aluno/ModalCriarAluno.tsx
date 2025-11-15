import { useState } from "react";
import { ModalCriarAlunoProps } from "../../models/props/modalCriarAlunoProps";
import { criarAluno } from "../../services/alunoService";
import { useToast } from "../ui/use-toast";

export function ModalCriarAluno({ isOpen, onClose, onAlunoCriado }: ModalCriarAlunoProps) {
  if (!isOpen) return null;

  const { toast } = useToast();

  const [novoAluno, setNovoAluno] = useState({
    nome: "",
    email: "",
    dataNascimento: "",
  });

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
    setNovoAluno({ ...novoAluno, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      nome: novoAluno.nome,
      email: novoAluno.email,
      dataNascimento: new Date(novoAluno.dataNascimento)
    }

    if(!isAdulto(payload.dataNascimento)){
      toast({
        title: "Data de nascimento inválida",
        description: "Não é permitido cadastrar alunos com menos de 18 anos",
        variant: "destructive"
      })
      return
    }

    try {
      await criarAluno(payload);
      toast({
        title: "Aluno criado com sucesso!",
        variant: "default"
      })
      onClose();
      onAlunoCriado();
    } catch (error) {
      console.error("Erro ao criar aluno:", error);
      toast({
        title: "Erro ao criar aluno",
        variant: "destructive"
      })
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-160 p-6 relative">
        <h2 className="text-xl font-bold mb-4">Incluir Aluno</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            className="border rounded px-3 py-2"
            value={novoAluno?.nome}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="border rounded px-3 py-2"
            value={novoAluno?.email}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="dataNascimento"
            placeholder="Data de Nascimento"
            className="border rounded px-3 py-2"
            value={novoAluno.dataNascimento}
            onChange={(e) =>
              setNovoAluno({ ...novoAluno, dataNascimento: e.target.value })
            }
          />

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
