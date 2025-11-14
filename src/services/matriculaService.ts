import api from "../api/api";
import { Matricula } from "../models/matricula";
import { CriarMatriculaDTO } from "../models/dto/criarMatricula.dto";

const BASE_URL = 'api/Matricula'

export async function criarMatricula(dto: CriarMatriculaDTO): Promise<Matricula> {
  const { data } = await api.post(BASE_URL, dto);
  return data;
}

export async function listarMatriculas(): Promise<Matricula[]> {
  const { data } = await api.get(BASE_URL);
  return data;
}

export async function deletarMatricula(alunoId: number, cursoId: number): Promise<void> {
  await api.delete(`${BASE_URL}/${alunoId}/${cursoId}`);
}