import api from "../api/api";
import { Curso } from "../models/curso";
import { AtualizarCursoDTO } from "../models/dto/atualizarCurso.dto";
import { CriarCursoDTO } from "../models/dto/criarCurso.dto";

const BASE_URL = 'api/Curso'

export async function criarCurso(dto: CriarCursoDTO): Promise<Curso> {
  const { data } = await api.post(BASE_URL, dto);
  return data;
}

export async function listarCursos(): Promise<Curso[]> {
  const { data } = await api.get(BASE_URL);
  return data;
}

export async function atualizarCurso(id: number, dto: AtualizarCursoDTO): Promise<Curso> {
  const { data } = await api.put(`${BASE_URL}/${id}`, dto);
  return data;
}

export async function deletarCurso(id: number): Promise<void> {
  await api.delete(`${BASE_URL}/${id}`);
}