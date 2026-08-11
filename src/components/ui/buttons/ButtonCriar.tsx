"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type ButtonProps = {
  clicarFuncao: () => void;
};

export default function ButtonCriar({ clicarFuncao }: ButtonProps) {
  return (
    <motion.div exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <button
        className="flex flex-row gap-2 rounded-2xl bg-blue-500 py-2 px-3 text-white cursor-pointer hover:-translate-y-0.5
                        transition-all active:scale-95"
        onClick={() => {
          clicarFuncao();
        }}
      >
        <Image src={"/icons/correct.svg"} alt="Simbolo de correto" width={20} height={20} className="w-4.5 h-auto" />
        Criar Cotação
      </button>
    </motion.div>
  );
}
