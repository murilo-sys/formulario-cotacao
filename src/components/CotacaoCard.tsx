"use client"

import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { CotacaoResponse } from "@/schemas/cotacaoSchema"
import ButtonCriar from "./ui/buttons/ButtonCriar"

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


                        {/* Card Rodoviario */}
                        <div className="bg-radial-[at_30%_0%] from-blue-600 to-blue-950 flex flex-col px-5 py-3 w-full lg:w-fit border border-blue-600 rounded-xl shadow-lg/40">

                            <div className="flex flex-col gap-3 text-white">

                                <div className="flex flex-row items-center gap-2">

                                    <Image
                                        src={"/icons/truck.svg"}
                                        alt="Caminhão"
                                        width={18}
                                        height={18}
                                        className="w-[40px] h-auto bg-radial-[at_75%_75%] from-blue-600 to-blue-800 to-75% rounded-md shadow-md/30 p-[5px] "
                                    />

                                    <div className="flex flex-col">
                                        <span className="font-bold">Rodoviário</span>

                                        <div className="mt-1 px-1 flex flex-row gap-1 justify-center items-center rounded-md shadow-md/30 bg-gray-200 ">
                                            <Image
                                                src={"/icons/box.svg"}
                                                alt="Caixa"
                                                width={18}
                                                height={18}
                                                className="w-[18px] h-auto"
                                            />
                                            <span className="text-black text-[11px] font-semibold">Incluso Coleta e Entrega</span>
                                        </div>

                                    </div>

                                </div>

                                <div className="flex flex-col gap-2">

                                    <div className="pb-1 border-b border-dotted border-blue-500">
                                        <p className="text-2xl font-bold border-blue-500">R$ {Number(resultado.dados.rodo.total).toLocaleString('pt-BR')}</p>
                                        <p className="text-sm">Peso taxado: <strong>{resultado.dados.rodo.peso} KG</strong></p>
                                    </div>

                                    <div className="flex flex-col gap-3">


                                        <div className="flex flex-row gap-2 bg-blue-300 text-blue-900 text-sm/4 rounded-md px-2 py-1">

                                            <Image
                                                src={"/icons/attention-black.svg"}
                                                alt="Icone de correto"
                                                width={18}
                                                height={18}
                                                className="w-[24px] h-auto"
                                            />

                                            <span className="text-xs/3 font-medium"><span className="font-bold">Difal</span> aplicável quando - Tomador destinatário não contribuinte de ICMS</span>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* Card Aéreo */}
                        <div className="bg-radial-[at_70%_100%] from-red-600 to-red-950 flex flex-col h-fit px-5 py-3 w-full lg:w-fit border border-red-600 rounded-xl shadow-lg/40">

                            <div className="flex flex-col gap-3 text-white">

                                <div className="flex flex-row items-center gap-2">

                                    <Image
                                        src={"/icons/aviao.svg"}
                                        alt="Caminhão"
                                        width={18}
                                        height={18}
                                        className="w-[40px] h-auto bg-radial-[at_75%_75%] from-red-600 to-red-800 to-75% rounded-md shadow-md/30 p-[5px] "
                                    />

                                    <div className="flex flex-col ">
                                        <span className="font-bold">Aéreo</span>

                                        <div className="mt-1 px-1 flex flex-row gap-1 justify-center items-center rounded-md shadow-md/30 bg-gray-200">
                                            <Image
                                                src={"/icons/box.svg"}
                                                alt="Caixa"
                                                width={18}
                                                height={18}
                                                className="w-[18px] h-auto"
                                            />
                                            <span className="text-black text-[11px] font-semibold">Incluso Coleta e Entrega</span>
                                        </div>
                                    </div>

                                </div>

                                <div className="flex flex-col gap-2">


                                    <div className="pb-1 border-b border-dotted border-red-500">
                                        <p className="text-2xl font-bold">{resultado.dados.air ? `R$ ${Number(resultado.dados.air?.total).toLocaleString('pt-BR')}` : "Não disponível"}</p>
                                        {resultado.dados.air?.peso ? <p className="text-sm">Peso taxado: <strong>{resultado.dados.air.peso} KG</strong></p> : resultado.dados.air?.peso}
                                    </div>

                                    <div className="flex flex-row gap-2 bg-red-300 text-red-900 text-sm/4 rounded-md px-2 py-1">

                                        <Image
                                            src={"/icons/attention-black.svg"}
                                            alt="Icone de correto"
                                            width={18}
                                            height={18}
                                            className="w-[24px] h-auto"
                                        />

                                        <span className="text-xs/3 font-medium"><span className="font-bold">Difal</span> aplicável quando - Tomador destinatário não contribuinte de ICMS</span>
                                    </div>

                                </div>

                            </div>

                        </div>

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