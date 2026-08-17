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
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col gap-4 w-full max-w-md lg:max-w-xl bg-white rounded-2xl py-8 pb-6 px-6 shadow-xl">
        <h3 className="text-xl font-bold text-[#0c3d7c]">CONFIRME SUA COTAÇÃO</h3>

        {/* Sub total e prazo de entrega */}
        <div className="border-b border-dotted border-blue-900">
          <h2 className="text-2xl font-semibold">R$ {valoresConfirmacao.total}</h2>
          <p>
            Prazo de entrega:{" "}
            <strong>
              {valoresConfirmacao.prazo} {Number(valoresConfirmacao.prazo) > 1 ? "Dias úteis" : "Dia útil"}
            </strong>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {/* campo subtotal */}
          <div className="w-full flex flex-row justify-between border-b border-dotted border-blue-200 leading-none">
            <span>
              <strong>Sub total</strong>
            </span>
            <span>R$ {valoresConfirmacao.subtotal}</span>
          </div>

          {/* Campo de impostos */}
          <div className="w-full flex flex-row justify-between border-b border-dotted border-blue-200 leading-none">
            <span>
              <strong>Impostos</strong>
            </span>
            <span>R$ {valoresConfirmacao.impostos}</span>
          </div>

          {/* Campo de difal */}
          {valoresConfirmacao.difal && valoresConfirmacao.difal !== "0" && (
            <div className="w-full flex flex-row justify-between border-b border-dotted border-blue-200 leading-none">
              <span>
                <strong>Difal</strong>
              </span>
              <span>R$ {valoresConfirmacao.difal}</span>
            </div>
          )}
        </div>

        <div className="flex flex-row justify-end gap-3 mt-4">
          <button type="button" className="cursor-pointer border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 font-medium px-4 py-2 rounded-xl transition-all" onClick={onRecusar}>
            Recusar
          </button>
          <button type="button" className="cursor-pointer border border-blue-600 bg-blue-800 hover:bg-blue-900 text-white font-medium px-4 py-2 rounded-xl transition-all" onClick={onAprovar}>
            Aprovar Cotação
          </button>
        </div>
      </motion.div>
    </div>
  );
}
