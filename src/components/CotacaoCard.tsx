"use client"

import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { CotacaoResponse } from "@/schemas/cotacaoSchema"
import ButtonCriar from "./ui/buttons/ButtonCriar"
import Card from "./Card"

interface CotacaoCardProps {
    resultado: CotacaoResponse
    clicadoFuncao: () => void
    clicado: boolean
}

export default function CotacaoCard({ clicadoFuncao, clicado, resultado }: CotacaoCardProps) {

    const classNameBase = `flex flex-col overflow-hidden bg-white w-full max-w-md p-5 ${!resultado.notFound && "pb-2"} rounded-xl shadow-lg lg:max-w-2xl`

    return (

        // Card branco do fundo
        <motion.div className={classNameBase}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            exit={{ opacity: 0, height: 0 }}
        >

            {resultado.notFound ?
                <div>
                    <h2>Trecho não contemplado para transporte.</h2>
                    <span></span>
                </div> :

                <div className="flex flex-col gap-2">

                    <div className={`flex flex-col gap-6 lg:flex-row ${resultado.dados.air ? "lg:justify-between" : "lg:justify-center"} lg:gap-10`}>


                        <Card
                            dados={resultado.dados.rodo}
                            modal={"rodo"}
                        />


                        <Card
                            dados={resultado.dados.air}
                            modal={"air"}
                        />

                    </div>

                    <div className="flex flex-col justify-center items-center gap-3">
                        <p className="text-sm text-gray-500 font-sm text-center">Valores apresentados sujeitos a alteração mediante conferência de carga e documentação</p>

                        <AnimatePresence>
                            {!clicado && <ButtonCriar key={"botao-criar"} clicarFuncao={clicadoFuncao} />}
                        </AnimatePresence>

                    </div>

                </div>
            }

        </motion.div>
    )

}