import { ModalExcluirProps } from "../models/props/modalExcluirProps";

export function ModalExcluir({isOpen, onClose, onConfirm, mensagem = "Tem certeza que deseja continuar?",}: ModalExcluirProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <p className="text-gray-800 mb-6">{mensagem}</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}