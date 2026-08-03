"use client"

import { CotacaoDadosCard } from "@/schemas/cotacaoSchema";
import Image from "next/image"

interface CardProps {
    dados: CotacaoDadosCard | undefined
    modal: "air" | "rodo"
}

export default function Card({ dados, modal }: CardProps) {
    return (<>
        <div className={`bg-radial-[at_30%_0%] flex flex-col px-5 py-3 w-full lg:h-fit border rounded-xl shadow-lg/40 ${modal === "rodo" ? "from-blue-600 to-blue-950 border-blue-600" : "from-red-600 to-red-950 border-red-600"}`}>

            <div className="flex flex-col gap-3 text-white">

                <div className="flex flex-row items-center gap-2">

                    <Image
                        src={`${modal === "rodo" ? "/icons/truck.svg" : "/icons/aviao.svg"}`}
                        alt="Caminhão"
                        width={18}
                        height={18}
                        className={`w-[40px] h-auto bg-radial-[at_75%_75%] ${modal === "rodo" ? "from-blue-600 to-blue-800" : "from-red-600 to-red-800"} to-75% rounded-md shadow-md/30 p-[5px]`}
                    />

                    <div className="flex flex-col">
                        <span className="font-bold">{modal === "rodo" ? "Rodoviário" : "Aéreo"}</span>

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

                    <div className={`pb-1 border-b border-dotted ${modal === "rodo" ? "border-blue-500" : "border-red-500"}`}>
                        <p className="text-2xl font-bold border-blue-500">{dados ? `R$ ${Number(dados.total).toLocaleString('pt-BR')}` : "Não Disponível"}</p>
                        {dados?.prazo && <span className="text-sm">Prazo de entrega: <strong>{dados.prazo} {Number(dados.prazo) > 1 ? "Dias úteis" : "Dia útil"}</strong></span>}
                        {/* <p className="text-sm">Peso taxado: <strong>{resultado.dados.rodo.peso} KG</strong></p> */}
                    </div>

                    <div className="flex flex-col gap-3 justify-center items-center">


                        <div className={`flex flex-row w-full gap-2 text-sm/4 rounded-md px-2 py-1 items-center ${modal === "rodo" ? "bg-blue-300 text-blue-900" : "bg-red-300 text-red-900"}`}>

                            <Image
                                src={"/icons/attention-black.svg"}
                                alt="Icone de correto"
                                width={18}
                                height={18}
                                className="w-[24px] h-auto"
                            />

                            {typeof dados?.difal === "string" ?
                                <div className="flex flex-row w-full justify-between">
                                    <span className="font-medium">Difal</span>
                                    <span>R$ {dados?.difal}</span>
                                </div> :
                                <span className="text-xs/3 font-medium"><span className="font-bold">Difal</span> não aplicado - Somente  quando tomador destinatário não contribuinte de ICMS</span>
                            }

                        </div>

                    </div>

                </div>

            </div>

        </div>
    </>)
}