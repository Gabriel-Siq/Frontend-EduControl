import api from "../api/api";
import { Aluno } from "../models/aluno";
import { AtualizarAlunoDTO } from "../models/dto/atualizarAluno.dto";
import { CriarAlunoDTO } from "../models/dto/criarAluno.dto";

const BASE_URL = 'api/Aluno'

export async function criarAluno(dto: CriarAlunoDTO): Promise<Aluno> {
  const { data } = await api.post(BASE_URL, dto);
  return data;
}

export async function listarAlunos(): Promise<Aluno[]> {
  const { data } = await api.get(BASE_URL);
  return data;
}

export async function atualizarAluno(id: number, dto: AtualizarAlunoDTO): Promise<Aluno> {
  const { data } = await api.put(`${BASE_URL}/${id}`, dto);
  return data;
}

export async function deletarAluno(id: number): Promise<void> {
  await api.delete(`${BASE_URL}/${id}`);
}