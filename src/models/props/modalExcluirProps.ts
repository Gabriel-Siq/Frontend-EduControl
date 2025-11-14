export interface ModalExcluirProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mensagem?: string;
}