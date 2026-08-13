import { motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

interface ModalSucessoCotacaoProps {
  sequenceCode: number | null;
  fechar: Dispatch<SetStateAction<number | null>>;
}

export default function ModalSucessoCotacao({ sequenceCode, fechar }: ModalSucessoCotacaoProps) {
  if (!sequenceCode) return;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 lg:p-0">
      <motion.div className="flex flex-col gap-4 w-full max-w-md lg:max-w-xl bg-white rounded-2xl py-8 pb-6 px-6">
        <span>Sua cotação é {sequenceCode} meus parabéns</span>
        <button className="cursor-pointer border w-fit px-2 rounded-xl bg-blue-200" onClick={() => fechar(null)}>
          Fechar
        </button>
      </motion.div>
    </div>
  );
}
