import { CotacaoValoresConfirmacaoType } from "@/schemas/cotacaoSchema";
import { motion } from "framer-motion";

interface ModalConfirmacaoCotacaoProps {
  valoresConfirmacao: CotacaoValoresConfirmacaoType | null;
  onAprovar: () => void;
  onRecusar: () => void;
}

export default function ModalConfirmacaoCotacao({ valoresConfirmacao, onAprovar, onRecusar }: ModalConfirmacaoCotacaoProps) {
  if (!valoresConfirmacao) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 lg:p-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex flex-col gap-4 w-full max-w-md lg:max-w-xl bg-white rounded-2xl py-8 pb-6 px-6 shadow-xl"
      >
        <h3 className="text-xl font-bold text-[#0c3d7c]">Confirmação de Cotação</h3>
        <p className="text-gray-600">
          O valor calculado para o frete foi de <strong className="text-blue-700">{valoresConfirmacao.total}</strong>. Deseja aprovar esta cotação?
        </p>

        <div className="flex flex-row justify-end gap-3 mt-4">
          <button
            type="button"
            className="cursor-pointer border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 font-medium px-4 py-2 rounded-xl transition-all"
            onClick={onRecusar}
          >
            Recusar
          </button>
          <button
            type="button"
            className="cursor-pointer border border-blue-600 bg-blue-800 hover:bg-blue-900 text-white font-medium px-4 py-2 rounded-xl transition-all"
            onClick={onAprovar}
          >
            Aprovar Cotação
          </button>
        </div>
      </motion.div>
    </div>
  );
}

