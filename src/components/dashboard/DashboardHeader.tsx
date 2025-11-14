import { User } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <header className="bg-goldcustom text-white shadow-md py-4 px-8 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-left">EduControl</h1>
        <p className="text-indigo-200 text-sm text-white">Sistema de Gestão de Cursos e Alunos</p>
      </div>
      <div className="relative flex items-center space-x-4">
          <div className="text-right">
            <p className="font-semibold text-gray-900">ADMINISTRADOR</p>
            <p className="text-sm text-gray-900">Fortes Tecnologia</p>
          </div>
          <button className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 hover:bg-gray-300 transition">
            <User className="w-10 h-10 text-gray-800" />
          </button>
        </div>
    </header>
  );
}