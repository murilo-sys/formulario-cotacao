"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react"
import { Input } from "@/components/ui/inputs/Input"
import { Label } from "@/components/ui/Label"
import { Button } from "@/components/ui/Button"
import { InputNumber } from "@/components/ui/inputs/InputNumber"
import { CotacaoSchema, CotacaoDados, CotacaoResponse } from "@/schemas/cotacaoSchema"
import validarCep from "@/utils/validarCep";
import { AnimatePresence } from "framer-motion";
import { simularCotacao } from "@/services/cotacao";
import CotacaoCard from "./CotacaoCard";

export default function FormularioCotacao() {

    //Dados da cotação
    const [cotacaoDados, setCotacaoDados] = useState<CotacaoResponse | null>(null)

    // Botão carregando
    const [carregando, setCarregando] = useState(false)

    // Nome Rua Origem - Nome Rua Destino
    const [enderecoOrigem, setEnderecoOrigem] = useState<string>("")
    const [enderecoDestino, setEnderecoDestino] = useState<string>("")

    // Cep origem - Cep destino /-/-/ 
    // Usado para quando o usuario clicar no campo, guardar o valor, 
    // e se quando ele sair, verificar se ambos são iguais, se for igual, não verifica novamente na API
    const cepOrigem = useRef<string>("")
    const cepDestino = useRef<string>("")

    // React-hook-form
    const { control, handleSubmit, clearErrors, setError, formState: { errors } } = useForm<CotacaoDados>({
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

        // Seta animação de carregando como true
        setCarregando(true)

        //Seta os dados da cotação como null
        setCotacaoDados(null)

        try {
            const { cepValido: cepValidoDestino } = await validarCep(dadosFormulario.cepDestino)

            //Valida se o CEP destino é valido
            if (cepValidoDestino === false) {
                setError("cepDestino", { type: "manual", message: "Cep Inválido" })
                setCarregando(false)
                return
            }

            const { cepValido: cepValidoOrigem } = await validarCep(dadosFormulario.cepOrigem)

            //Valida se o CEP origem é valido
            if (cepValidoOrigem === false) {
                setError("cepOrigem", { type: "manual", message: "Cep Inválido" })
                setCarregando(false)
                return
            }

        } catch {
            console.error("Não foi possivel validar o CEP. Continuando...")
        }

        try {
            const resultado = await simularCotacao(dadosFormulario)

            console.log(resultado)

            setCotacaoDados(resultado)
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
                            <h2 className="font-bold text-xl ">Dados dos endereços</h2>
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
                                                ref={field.ref}
                                                onFocus={() => {
                                                    cepOrigem.current = field.value
                                                }}
                                                rua={enderecoOrigem}
                                                placeholder="00000-000"
                                                erro={errors.cepOrigem?.message}
                                                id="cepOrigem"
                                                type="text"
                                                mask="00000-000"
                                                onBlur={async () => {

                                                    if (field.value.trim() === "" || cepOrigem.current === field.value) return

                                                    const { cepValido, cidade, estado } = await validarCep(field.value)

                                                    setEnderecoOrigem("")

                                                    if (cepValido === false) {
                                                        setError("cepOrigem", { type: "manual", message: "Cep Inválido" })


                                                        field.onBlur()
                                                        return cepValido
                                                    }

                                                    setEnderecoOrigem(`${cidade} - ${estado}`)

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
                                                onFocus={() => {
                                                    cepDestino.current = field.value
                                                }}
                                                ref={field.ref}
                                                placeholder="00000-000"
                                                rua={enderecoDestino}
                                                erro={errors.cepDestino?.message}
                                                id="cepDestino"
                                                type="text"
                                                mask="00000-000"
                                                value={field.value}
                                                onBlur={async () => {

                                                    if (field.value.trim() === "" || cepDestino.current === field.value) return

                                                    setEnderecoDestino("")

                                                    const { cepValido, cidade, estado } = await validarCep(field.value)

                                                    if (cepValido === false) {
                                                        setError("cepDestino", { type: "manual", message: "Cep Inválido" })


                                                        field.onBlur()
                                                        return cepValido
                                                    }

                                                    setEnderecoDestino(`${cidade} - ${estado}`)

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
                            <h2 className="font-bold text-xl ">Dados da mercadoria</h2>
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
                                            ref={field.ref}
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
                                            ref={field.ref}
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


                                <Controller
                                    name="totalVolumes"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            className="w-full pl-11"
                                            prefixo="UN"
                                            erro={errors.totalVolumes?.message}
                                            id="totalVolumes"
                                            type="text"
                                            ref={field.ref}
                                            value={field.value}
                                            onChange={(e) => {
                                                clearErrors("totalVolumes")
                                                field.onChange(e.target.value)
                                            }}
                                        />
                                    )}
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

            {cotacaoDados && <CotacaoCard resultado={cotacaoDados} />}

        </AnimatePresence>

    </>
    )
}