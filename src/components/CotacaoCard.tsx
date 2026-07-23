"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { CotacaoResponse } from "@/schemas/cotacaoSchema"

interface CotacaoCardProps {
    resultado: CotacaoResponse
}

export default function CotacaoCard({ resultado }: CotacaoCardProps) {

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

                <div className="flex flex-col gap-5">

                    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:grid-rows-1 lg:gap-10">


                        {/* Card Rodoviario */}
                        <div className="bg-radial-[at_30%_0%] from-blue-600 to-blue-950 flex flex-col px-5 py-3 w-full border border-blue-600 rounded-xl shadow-lg/40">

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
                                        <span className="font-md text-xs/3 text-gray-300">Transporte terrestre</span>

                                        <div className="mt-1 px-1 flex flex-row gap-1 justify-center items-center rounded-md shadow-md/30 bg-gray-200 ">
                                            <Image
                                                src={"/icons/box.svg"}
                                                alt="Caixa"
                                                width={18}
                                                height={18}
                                                className="w-[18px] h-auto"
                                            />
                                            <span className="text-black text-[11px] font-semibold">Coleta e Entrega</span>
                                        </div>

                                    </div>

                                </div>

                                <div className="flex flex-col gap-2">

                                    <p className="text-2xl font-bold pb-1 border-b border-blue-500">R$ {resultado.dados.rodo.total}</p>

                                    <div className="flex flex-col gap-3">

                                        <div className="flex flex-row items-center gap-2">

                                            <Image
                                                src={"/icons/notes.svg"}
                                                alt="Nota fiscal"
                                                width={18}
                                                height={18}
                                                className="h-[32px] w-auto rounded-full bg-gradient-to-b from-blue-700 to-blue-900 shadow-md/30 p-[2px]"
                                            />

                                            <div className="w-full flex flex-row gap-2 items-center justify-between border-b border-dotted border-blue-700">

                                                <span>Sub-total</span>

                                                <span>R$ {resultado.dados.rodo.subtotal}</span>

                                            </div>

                                        </div>

                                        <div className="flex flex-row items-center gap-2">

                                            <Image
                                                src={"/icons/tax.svg"}
                                                alt="Simbolo de imposto"
                                                width={18}
                                                height={18}
                                                className="h-[32px] w-auto rounded-full bg-gradient-to-b from-blue-700 to-blue-900 shadow-md/30 p-[2px]"
                                            />

                                            <div className="w-full flex flex-row gap-2 items-center justify-between border-b border-dotted border-blue-700">

                                                <span>Impostos</span>

                                                <span>R$ {resultado.dados.rodo.imposto}</span>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* Card Aéreo */}
                        <div className="bg-radial-[at_70%_100%] from-red-600 to-red-950 flex flex-col px-5 py-3 w-full border border-red-600 rounded-xl shadow-lg/40">

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
                                        <span className="font-md text-xs/3 text-gray-300">Transporte aéreo</span>

                                        <div className="mt-1 px-1 flex flex-row gap-1 justify-center items-center rounded-md shadow-md/30 bg-gray-200">
                                            <Image
                                                src={"/icons/box.svg"}
                                                alt="Caixa"
                                                width={18}
                                                height={18}
                                                className="w-[18px] h-auto"
                                            />
                                            <span className="text-black text-[11px] font-semibold">Coleta e Entrega</span>
                                        </div>
                                    </div>

                                </div>

                                <div className="flex flex-col gap-2">

                                    <p className="text-2xl font-bold pb-1 border-b border-red-500">{resultado.dados.air ? `R$ ${resultado.dados.air?.total}` : "Não disponível"}</p>

                                    <div className="flex flex-col gap-3">

                                        <div className="flex flex-row items-center gap-2">

                                            <Image
                                                src={"/icons/notes.svg"}
                                                alt="Nota fiscal"
                                                width={18}
                                                height={18}
                                                className="h-[32px] w-auto rounded-full bg-gradient-to-b from-red-700 to-red-900 shadow-md/30 p-[2px]"
                                            />

                                            <div className="w-full flex flex-row gap-2 items-center justify-between border-b border-dotted border-red-300">

                                                <span>Sub-total</span>

                                                <span>{resultado.dados.air ? `R$ ${resultado.dados.air?.subtotal}` : "R$0"}</span>

                                            </div>

                                        </div>

                                        <div className="flex flex-row items-center gap-2">

                                            <Image
                                                src={"/icons/tax.svg"}
                                                alt="Simbolo de imposto"
                                                width={18}
                                                height={18}
                                                className="h-[32px] w-auto rounded-full bg-gradient-to-b from-red-700 to-red-900 shadow-md/30 p-[2px]"
                                            />

                                            <div className="w-full flex flex-row gap-2 items-center justify-between border-b border-dotted border-red-300">

                                                <span>Impostos</span>

                                                <span>{resultado.dados.air ? `R$ ${resultado.dados.air?.imposto}` : "R$0"}</span>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    <p className="text-sm text-gray-400 font-sm text-center">Valores apresentados sujeitos a alteração mediante conferência de carga e documentação</p>

                </div>
            }

        </motion.div>
    )

}