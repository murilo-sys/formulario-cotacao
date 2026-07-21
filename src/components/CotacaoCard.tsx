"use client"

import { motion } from "framer-motion"

export interface CotacaoCardType {
    rodo: {
        total: string
        subtotal: string
        imposto: string
    }
    air?: {
        total: string
        subtotal: string
        imposto: string
    }
}

interface CotacaoCardProps {
    dados: CotacaoCardType
}

export default function CotacaoCard({ dados }: CotacaoCardProps) {

    return (
        <motion.div className="bg-white w-full max-w-md p-5 pr-10 pl-10 rounded-xl shadow-lg lg:max-w-2xl">

            <div className="grid grid-cols-2 grid-rows-1 gap-3 lg:gap-10">

                <div className="bg-blue-900 flex flex-col pl-5 p-3 w-full border border-red-300 rounded-xl">
                    <div>

                        <div className="border-b border-dotted border-white">
                            <h2 className="text-white">Rodoviário</h2>
                            <p className="text-white lg:text-2xl">R$ {dados.rodo.total}</p>
                        </div>

                        <div>
                            <p className="text-white">Sub-total R$100</p>
                            <p className="text-white">Impostos R$400</p>
                        </div>

                    </div>

                </div>

                <div className="flex flex-col pl-5 p-3 w-full border border-red-300 rounded-xl">


                    <div className="flex flex-col gap-2">
                        <div>
                            <h2>Aéreo</h2>
                            <p>R$ {dados.air?.total}</p>
                        </div>
                        <div>
                            <p>Sub-total R${dados.air?.total}</p>
                            <p>Impostos R${dados.air?.total}</p>
                        </div>
                    </div>

                </div>

            </div>

        </motion.div>
    )

}