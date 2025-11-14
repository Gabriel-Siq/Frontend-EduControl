export interface PaginacaoProps {
  totalPaginas: number;
  paginaAtual: number;
  setPaginaAtual: (pagina: number) => void;
}