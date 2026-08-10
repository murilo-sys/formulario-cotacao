"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

export type TipoInfoDialog = "naturezaBloqueada" | "valorBaixo" | "valorElevado" | "pesoElevado" | "medidasElevadas" | "erroConsulta" | "cadastroInexistente";

export const ListaInfosDialog = ["naturezaBloqueada", "valorBaixo", "valorElevado", "pesoElevado", "medidasElevadas", "erroConsulta", "cadastroInexistente"];

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {
  info?: TipoInfoDialog;
  fechar: () => void;
}

export function ModalMercadoriaBloqueada({ info, fechar, ...props }: DivProps) {
  const botaoRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    botaoRef.current?.focus();
  }, []);

  return (
    <AnimatePresence>
      {info && (
        <div {...props} className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 lg:p-0`}>
          <motion.div className="flex flex-col gap-4 w-full max-w-md lg:max-w-xl bg-white rounded-2xl py-8 pb-6 px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
            <>
              <div className="flex flex-col items-center gap-1">
                {info === "naturezaBloqueada" && <span className="text-5xl">⚠️</span>}
                {info === "cadastroInexistente" && <span className="text-5xl">❌</span>}
                {["valorBaixo", "valorElevado"].includes(info) && <span className="text-5xl">💸</span>}
                {info === "pesoElevado" && <span className="text-5xl">⚖️</span>}
                {info === "medidasElevadas" && <span className="text-5xl">📏</span>}
                {info === "erroConsulta" && <span className="text-5xl">❗</span>}

                {info === "naturezaBloqueada" && (
                  <>
                    <span className="text-2xl font-semibold text-red-500">Natureza de Carga Restrita</span>
                    <span className="text-center text-gray-400">Esta natureza de mercadoria não pode ser solicitada via site.</span>
                  </>
                )}

                {info === "valorElevado" && (
                  <>
                    <span className="text-2xl font-semibold text-red-500">Valor da NF Excedido</span>
                    <span className="text-center text-gray-400">Notamos que o valor da sua Nota Fiscal é maior que R$ 250.000,00</span>
                  </>
                )}

                {info === "valorBaixo" && (
                  <>
                    <span className="text-2xl font-semibold text-red-500">Valor da NF Mínimo</span>
                    <span className="text-center text-gray-400">Notamos que o valor da sua Nota Fiscal é menor que R$ 200,00</span>
                  </>
                )}

                {info === "pesoElevado" && (
                  <>
                    <span className="text-2xl font-semibold text-red-500">Peso Elevado</span>
                    <span className="text-center text-gray-400">Notamos que o peso total da sua carga ultrapassa 500 KG</span>
                  </>
                )}

                {info === "medidasElevadas" && (
                  <>
                    <span className="text-2xl font-semibold text-red-500">Dimensão Elevada</span>
                    <span className="text-center text-gray-400">Nenhuma medida (comprimento, largura ou altura) pode exceder 2,00 metros.</span>
                  </>
                )}

                {info === "erroConsulta" && (
                  <>
                    <span className="text-2xl font-semibold text-red-500">Erro durante a consulta</span>
                    <span className="text-center text-gray-400">Ocorreu um erro durante a consulta. Tente novamente mais tarde.</span>
                  </>
                )}

                {info === "cadastroInexistente" && (
                  <>
                    <span className="text-2xl font-semibold text-red-500">Cadastro não encontrado</span>
                    <span className="text-center text-gray-400">O documento informado não está registrado em nosso sistema.</span>
                  </>
                )}
              </div>

              <div className="flex flex-col items-center bg-orange-50 rounded-md border border-orange-200 px-6 py-4 gap-5">
                {/* {info === "natureza" && (<>
                                <span className="text-orange-700">Natureza de Carga Restrita</span>
                            </>)}

                            {info === "valorElevado" && (<>
                                <span className="text-orange-700">Valor da NF Excedido</span>
                            </>)}

                            {info === "valorBaixo" && (<>
                                <span className="text-orange-700">Valor da NF Mínimo</span>
                            </>)}

                            {info === "pesoElevado" && (<>
                                <span className="text-orange-700">Peso Elevado</span>
                            </>)}

                            {info === "medidasElevadas" && (<>
                                <span className="text-orange-700">Dimensão Elevada</span>
                            </>)}

                            {info === "erroConsulta" && (<>
                                <span className="text-orange-700">Erro durante a consulta</span>
                            </>)}

                            {info === "cadastroInexistente" && (<>
                                <span className="text-orange-700 text-md">Ligue agora e continue a solicitação de sua Cotação</span>
                            </>)} */}

                <span className="text-orange-700 text-md">Ligue agora e continue a solicitação de sua Cotação</span>

                <div className="flex flex-col gap-3 w-full">
                  <div className="flex justify-between border-b border-dotted border-orange-700 pb-2">
                    <span className="text-orange-700 font-semibold">Telefone Principal</span>
                    <span className="text-black font-semibold">(11) 3017-8990</span>
                  </div>

                  <div className="flex justify-between border-b border-dotted border-orange-700 pb-2">
                    <span className="text-orange-700 font-semibold">Telefone Secundário</span>
                    <span className="text-black font-semibold">(11) 2222-1260</span>
                  </div>
                </div>

                <span className="text-orange-700 text-sm italic font-medium">Horário de atendimento: Segunda a Sexta, das 8h às 18h</span>
              </div>

              <button
                ref={botaoRef}
                className="w-full p-1 text-white font-semibold border
                 rounded-md bg-orange-600 border-orange-600 transition-all duration-300
                cursor-pointer hover:bg-orange-500 active:scale-95 hover:-translate-y-0.5"
                onClick={fechar}
              >
                Entendido
              </button>
            </>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
