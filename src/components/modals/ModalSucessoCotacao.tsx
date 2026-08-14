import { motion } from "framer-motion";

interface ModalSucessoCotacaoProps {
  sequenceCode: number | null;
  fechar: () => void;
}

export default function ModalSucessoCotacao({ sequenceCode, fechar }: ModalSucessoCotacaoProps) {
  if (!sequenceCode) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 lg:p-0">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col gap-4 w-full max-w-md lg:max-w-xl bg-white rounded-2xl py-8 pb-6 px-6 shadow-xl text-center">
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-2xl font-bold text-green-600">Cotação Gerada com Sucesso!</h3>
          <p className="text-gray-600">Sua cotação foi registrada em nosso sistema sob o código de acompanhamento:</p>
          <span className="text-3xl font-extrabold text-[#0c3d7c] bg-blue-50 px-6 py-2 rounded-xl border border-blue-200 mt-2">#{sequenceCode}</span>
        </div>

        <div className="flex justify-center mt-4">
          <button type="button" className="cursor-pointer border border-blue-600 bg-blue-800 hover:bg-blue-900 text-white font-medium px-6 py-2 rounded-xl transition-all" onClick={fechar}>
            Concluir
          </button>
        </div>
      </motion.div>
    </div>
  );
}
