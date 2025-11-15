import { useState } from "react";
import { ModalCriarCursoProps } from "../../models/props/modalCriarCursoProps";
import { criarCurso } from "../../services/cursoService";
import { toast } from "../ui/use-toast";

export function ModalCriarCurso({ isOpen, onClose, onCursoCriado }: ModalCriarCursoProps) {
  if (!isOpen) return null;

  const [novoCurso, setNovoCurso] = useState({
    nome: "",
    descricao: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNovoCurso({ ...novoCurso, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      nome: novoCurso.nome,
      descricao: novoCurso.descricao,
    }

    try {
      await criarCurso(payload);
      toast({
        title: "Curso criado com sucesso!",
        variant: "default"
      })
      onClose();
      onCursoCriado();
    } catch (error) {
      console.error("Erro ao criar curso:", error);
      toast({
        title: "Erro ao criar aluno",
        variant: "destructive"
      })
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-160 p-6 relative">
        <h2 className="text-xl font-bold mb-4">Incluir Curso</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            className="border rounded px-3 py-2"
            value={novoCurso?.nome}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="descricao"
            placeholder="Descrição"
            className="border rounded px-3 py-2"
            value={novoCurso?.descricao}
            onChange={handleChange}
            required
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
