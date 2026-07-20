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

export default function FormularioCotacao() {

    //Dados da cotação
    const [cotacaoDados, setCotacaoDados] = useState<CotacaoCardType | null>(null)

    // Botão carregando
    const [carregando, setSimulando] = useState(false)

    // React-hook-form
    const { control, register, handleSubmit, clearErrors, getValues, setError, formState: { errors } } = useForm<CotacaoDados>({
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

    function handlerSubmeterCotacao() {
        setSimulando(true)



        setTimeout(() => {

            setCotacaoDados({
                rodo: {
                    entrega: "100",
                    coleta: "100",
                    transferencia: "100",
                    imposto: "100",
                },
                air: {
                    entrega: "100",
                    coleta: "100",
                    transferencia: "100",
                    imposto: "100",
                }
            })

            setSimulando(false)
        }, 2000);
    }

    return (<>
        <div className="bg-white w-full max-w-md p-5 pr-10 pl-10 rounded-xl shadow-lg lg:max-w-2xl">

            <form onSubmit={handleSubmit(handlerSubmeterCotacao)}>

                <div>

                    <h2 className="font-bold text-xl">Dados dos endereços</h2>
                    <p className="text-gray-500 text-md font-light">Lugar de onde a carga irá sair e ser entregue</p>

                    <div className="flex flex-col mt-3 gap-3 lg:flex-row lg:justify-between w-full">

                        <div className="lg:w-[43%] flex flex-col">

                            <Label obrigatorio={true} htmlFor="cepOrigem">CEP de origem</Label>
                            <Controller
                                name="cepOrigem"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="00000-000"
                                        erro={errors.cepOrigem?.message}
                                        id="cepOrigem"
                                        type="text"
                                        mask="00000-000"
                                        onBlur={async () => {
                                            const cepValido = await validarCep(field.value)
                                            if (cepValido === false) setError("cepOrigem", { type: "manual", message: "Cep Inválido" })
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
                                        erro={errors.cepDestino?.message}
                                        id="cepDestino"
                                        type="text"
                                        mask="00000-000"
                                        value={field.value}
                                        onBlur={async () => {
                                            const cepValido = await validarCep(field.value)
                                            if (cepValido === false) setError("cepDestino", { type: "manual", message: "Cep Inválido" })
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

                    <h2 className="font-bold text-xl mt-7">Dados da mercadoria</h2>
                    <p className="text-gray-500 text-md font-light">Informações das cargas que serão despachadas</p>

                    <div className="flex flex-col gap-4 mt-3 lg:grid lg:grid-cols-3 lg:gap-6 w-full">

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

                <div className="flex justify-end mt-8">
                    <Button type="submit" carregando={carregando}>
                        Simular Cotação
                    </Button>
                </div>

            </form>

        </div>

        {cotacaoDados && (
            <CotacaoCard dados={cotacaoDados} />
        )}

    </>
    )
}