"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react"
import { Input } from "@/components/ui/inputs/Input"
import { Label } from "@/components/ui/Label"
import { Button } from "@/components/ui/Button"
import { InputNumber } from "@/components/ui/inputs/InputNumber"
import { CotacaoSchema, CotacaoDados } from "@/schemas/cotacaoSchema"
import validarCep from "@/utils/validarCep";
import CotacaoCard, { CotacaoCardType } from "./CotacaoCard";
import { AnimatePresence } from "framer-motion";
import { simularCotacao } from "@/services/cotacao";

export default function FormularioCotacao() {

    //Dados da cotação
    const [cotacaoDados, setCotacaoDados] = useState<CotacaoCardType | null>(null)

    // Botão carregando
    const [carregando, setCarregando] = useState(false)

    // Nome Rua Origem
    const [ruaOrigem, setRuaOrigem] = useState<string>("")

    // Nome Rua Destino
    const [ruaDestino, setRuaDestino] = useState<string>("")

    // React-hook-form
    const { control, register, handleSubmit, clearErrors, setError, formState: { errors } } = useForm<CotacaoDados>({
        resolver: zodResolver(CotacaoSchema),
        mode: "onSubmit",
        reValidateMode: "onSubmit",
        defaultValues: {
            cepOrigem: "",
            cepDestino: "",
            pesoReal: "",
            valorNfe: "",
            totalVolumes: ""
        }
    })

    async function handlerSubmeterCotacao(dadosFormulario: CotacaoDados) {

        setCarregando(true)
        setCotacaoDados(null)

        try {
            const dados = await simularCotacao(dadosFormulario)
            setCotacaoDados(dados)
        } catch {
            setCarregando(false)
        }


        setCarregando(false)
    }

    return (<>
        <div className="bg-white w-full max-w-md p-5 pr-10 pl-10 rounded-xl shadow-lg lg:max-w-2xl">

            <form onSubmit={handleSubmit(handlerSubmeterCotacao)}>

                <div className="flex flex-col gap-5">

                    <div className="flex flex-col gap-2">

                        <div>
                            <h2 className="font-bold text-xl text-[#0c3d7c]">Dados dos endereços</h2>
                            <p className="text-gray-500 text-md font-light">Lugar de onde a carga irá sair e ser entregue</p>
                        </div>

                        <div>

                            <div className="flex flex-col gap-2 lg:flex-row lg:justify-between w-full">

                                <div className="lg:w-[43%] flex flex-col">

                                    <Label obrigatorio={true} htmlFor="cepOrigem">CEP de origem</Label>
                                    <Controller
                                        name="cepOrigem"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                rua={ruaOrigem}
                                                placeholder="00000-000"
                                                erro={errors.cepOrigem?.message}
                                                id="cepOrigem"
                                                type="text"
                                                mask="00000-000"
                                                onBlur={async () => {

                                                    if (field.value.trim() === "") return

                                                    const { cepValido, rua } = await validarCep(field.value)

                                                    if (cepValido === false) {
                                                        setError("cepOrigem", { type: "manual", message: "Cep Inválido" })

                                                        setRuaOrigem("")

                                                        field.onBlur()
                                                        return cepValido
                                                    }

                                                    setRuaOrigem(rua)

                                                    field.onBlur()
                                                    return cepValido
                                                }}
                                                value={field.value}
                                                onAccept={(valor) => {
                                                    clearErrors("cepOrigem")
                                                    field.onChange(valor)
                                                }} />
                                        )}
                                    />

                                </div>

                                <div className="lg:w-[43%] flex flex-col">

                                    <Label obrigatorio={true} htmlFor="cepDestino">CEP de destino</Label>
                                    <Controller
                                        name="cepDestino"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                placeholder="00000-000"
                                                rua={ruaDestino}
                                                erro={errors.cepDestino?.message}
                                                id="cepDestino"
                                                type="text"
                                                mask="00000-000"
                                                value={field.value}
                                                onBlur={async () => {

                                                    if (field.value.trim() === "") return

                                                    const { cepValido, rua } = await validarCep(field.value)

                                                    if (cepValido === false) {
                                                        setError("cepDestino", { type: "manual", message: "Cep Inválido" })

                                                        setRuaDestino("")

                                                        field.onBlur()
                                                        return cepValido
                                                    }

                                                    setRuaDestino(rua)

                                                    field.onBlur()
                                                    return cepValido
                                                }}
                                                onAccept={(valor) => {
                                                    clearErrors("cepDestino")
                                                    field.onChange(valor)
                                                }} />
                                        )}
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="flex flex-col gap-2">

                        <div>
                            <h2 className="font-bold text-xl text-[#0c3d7c]">Dados da mercadoria</h2>
                            <p className="text-gray-500 text-md font-light">Informações das cargas que serão despachadas</p>
                        </div>

                        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-6 w-full">

                            <div className="flex flex-col">
                                <Label obrigatorio={true} htmlFor="pesoReal">Peso Real</Label>

                                <Controller
                                    name="pesoReal"
                                    control={control}
                                    render={({ field }) => (
                                        <InputNumber
                                            className="w-full pl-11"
                                            prefixo="KG"
                                            erro={errors.pesoReal?.message}
                                            id="pesoReal"
                                            type="text"
                                            value={field.value}
                                            onAccept={(valor) => {
                                                clearErrors("pesoReal")
                                                field.onChange(valor)
                                            }} />
                                    )}
                                />

                            </div>

                            <div className="flex flex-col">
                                <Label obrigatorio={true} htmlFor="valorNfe">Valor total NF-e</Label>

                                <Controller
                                    name="valorNfe"
                                    control={control}
                                    render={({ field }) => (
                                        <InputNumber
                                            erro={errors.valorNfe?.message}
                                            className="w-full pl-11"
                                            prefixo="R$"
                                            id="valorNfe"
                                            type="text"
                                            value={field.value}
                                            onAccept={(valor) => {
                                                clearErrors("valorNfe")
                                                field.onChange(valor)
                                            }} />
                                    )}
                                />

                            </div>

                            <div className="flex flex-col">
                                <Label obrigatorio={true} htmlFor="totalVolumes">Total de Volumes</Label>


                                <Input
                                    className="w-full pl-11"
                                    prefixo="UN"
                                    erro={errors.totalVolumes?.message}
                                    id="totalVolumes"
                                    type="text"
                                    {...register("totalVolumes", {
                                        onChange: () => clearErrors("totalVolumes")
                                    })}
                                />

                            </div>

                        </div>

                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" carregando={carregando}>
                            Simular Cotação
                        </Button>
                    </div>

                </div>

            </form >

        </div >

        <AnimatePresence>
            {cotacaoDados && (
                <CotacaoCard dados={cotacaoDados} />
            )
            }
        </AnimatePresence>

    </>
    )
}