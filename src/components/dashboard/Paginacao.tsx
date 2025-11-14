import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginacaoProps } from "../../models/paginacaoProps";

export function Paginacao({
  totalPaginas,
  paginaAtual,
  setPaginaAtual,
}: PaginacaoProps) {

  const gerarPaginas = () => {
    const paginas = [];

    if (totalPaginas <= 7) {
      for (let i = 1; i <= totalPaginas; i++) paginas.push(i);
    } else {
      if (paginaAtual > 3) paginas.push(1);

      if (paginaAtual > 4) paginas.push("...");

      const comeco = Math.max(2, paginaAtual - 1);
      const fim = Math.min(totalPaginas - 1, paginaAtual + 1);

      for (let i = comeco; i <= fim; i++) paginas.push(i);

      if (paginaAtual < totalPaginas - 3) paginas.push("...");

      if (paginaAtual < totalPaginas - 2) paginas.push(totalPaginas);
    }

    return paginas;
  };

  return (
    <div className="flex items-center gap-3 mt-4 select-none">
      <button
        onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
        className="p-1 hover:bg-gray-200 rounded-full transition"
      >
        <ChevronLeft size={20} />
      </button>
        <div className="flex items-center gap-2 border-none">
          {gerarPaginas().map((p, i) =>
              p === "..." ? (
              <span key={i} className="text-gray-500 select-none">…</span>
              ) : (
              <span
                  key={i}
                  onClick={() => setPaginaAtual(Number(p))}
                  className={`
                  w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition
                  ${
                      paginaAtual === p
                      ? "bg-gray-300"
                      : "hover:bg-gray-200"
                  }
                  `}
              >
                  {p}
              </span>
              )
          )}
        </div>
      <button
        onClick={() => setPaginaAtual(Math.min(totalPaginas, paginaAtual + 1))}
        className="p-1 hover:bg-gray-200 rounded-full transition"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
