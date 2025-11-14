import DashboardHeader from "../components/dashboard/DashboardHeader";
import PainelGestao from "../components/dashboard/PainelGestao";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <header className="sticky top-0 z-50">
        <DashboardHeader />
      </header>

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-1 ms-4 text-left">Gerenciar Cadastros</h1>
        <p className="text-gray-600 text-left ms-4">Gerencie o cadastro de cursos e alunos</p>

        <PainelGestao/>
      </main>
    </div>
  );
}