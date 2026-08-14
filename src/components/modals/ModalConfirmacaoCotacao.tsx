import { CotacaoValoresConfirmacaoType } from "@/schemas/cotacaoSchema";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

interface ModalConfirmacaoCotacaoProps {
  valoresConfirmacao: CotacaoValoresConfirmacaoType | null;
  fechar: () => void;
}

export default function ModalConfirmacaoCotacao({ valoresConfirmacao, fechar }: ModalConfirmacaoCotacaoProps) {
  if (!valoresConfirmacao) return;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 lg:p-0">
      <motion.div className="flex flex-col gap-4 w-full max-w-md lg:max-w-xl bg-white rounded-2xl py-8 pb-6 px-6">
        <span>Sua cotação é {valoresConfirmacao.total} vai querer?</span>
        <button className="cursor-pointer border w-fit px-2 rounded-xl bg-blue-200" onClick={fechar}>
          Fechar
        </button>
      </motion.div>
    </div>
  );
}
