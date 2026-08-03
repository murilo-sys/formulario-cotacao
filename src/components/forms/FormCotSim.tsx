"use client"

import { useForm, Controller, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/inputs/Input"
import { Label } from "@/components/ui/Label"
import { Button } from "@/components/ui/buttons/ButtonSimular"
import { InputNumber } from "@/components/ui/inputs/InputNumber"
import { CotacaoSchema, CotacaoDados, CotacaoResponse } from "@/schemas/cotacaoSchema"
import validarCep from "@/utils/validarCep";
import { AnimatePresence, motion } from "framer-motion";
import { simularCotacao } from "@/services/cotacao";
import CotacaoCard from "../CotacaoCard";
import FormularioCotacaoCompleto from "./FormCotCompleto";
import LinhasCubagens from "../LinhasCubagens";
import { ToggleSwitch } from "../ui/ToggleSwitch";

export default function FormularioCotacaoSimulacao() {

    // React-hook-form
    const rhf = useForm<CotacaoDados>({
        resolver: zodResolver(CotacaoSchema),
        mode: "onSubmit",
        shouldUnregister: true,
        reValidateMode: "onSubmit",
        defaultValues: {
            cepOrigem: "",
            cepDestino: "",
            pesoReal: "",
            valorNfe: "",
            totalVolumes: "",
            difalOpcao: false,
            cubagens: [{ quantidade: "", comprimento: "", largura: "", altura: "" }]
        }
    })

    // Extrai os metodos do RHF
    const { control, handleSubmit, clearErrors, setError, getValues, formState: { errors } } = rhf

    //Dados da cotação
    const [cotacaoDados, setCotacaoDados] = useState<CotacaoResponse | null>(null)

    //useState para verificar se VIACEP está ativo ou não
    const [apiCepCheck, setApiCepCheck] = useState<"carregando" | "online" | "offline">("carregando")

    // Botão carregando animação
    const [carregando, setCarregando] = useState(false)

    // Nome Rua Origem - Nome Rua Destino
    const [enderecoOrigem, setEnderecoOrigem] = useState<string>("")
    const [enderecoDestino, setEnderecoDestino] = useState<string>("")

    // Cep origem - Cep destino /-/-/ 
    // Usado para quando o usuario clicar no campo, guardar o valor, 
    // e se quando ele sair, verificar se ambos são iguais, se for igual, não verifica novamente na API
    const cepOrigem = useRef<string>("")
    const cepDestino = useRef<string>("")

    // Botão de estado - Se o usuario clicou em realizar cotação completa ou não
    const [cotacaoCompleta, setCotacaoCompleta] = useState<boolean>(false)

    //Health check da API VIACEP
    useEffect(() => {
        async function checarApi() {
            try {
                const resposta = await validarCep("01001-000")

                if (resposta.cepValido === true || resposta.cepValido === false) {
                    setApiCepCheck("online")
                    return
                }

                setApiCepCheck("offline")

            } catch {

                setApiCepCheck("offline")

            }
        }

        checarApi()
    }, [])

    async function handlerSubmeterCotacao(dadosFormulario: CotacaoDados) {

        // Seta animação de carregando como true
        setCarregando(true)

        //Seta os dados da cotação como null
        setCotacaoDados(null)

        // Seta opção de cotação completa como false
        setCotacaoCompleta(false)

        try {

            //Chama função para verificar CEP
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

            setCotacaoDados(resultado)

        } catch (erro) {

            // Verificamos se a variável erro foi criada por um throw new Error
            if (erro instanceof Error) {
                setError("root", { type: "server", message: erro.message })
            } else {
                setError("root", { type: "server", message: "Ocorreu um erro inesperado." })
            }

            setCarregando(false)
        }

        setCarregando(false)

    }

    if (apiCepCheck === "online") {
        return (<>
            <FormProvider {...rhf}>
                <motion.div className="bg-white w-full  py-5 px-7 rounded-xl shadow-lg overflow-hidden"
                    initial={{ height: 50 }}
                    animate={{ height: "auto" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >

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

                                                            if (cepOrigem.current === field.value) return

                                                            if (field.value.trim() === "") {
                                                                setEnderecoOrigem("")
                                                                return
                                                            }

                                                            const { cepValido, cidade, estado } = await validarCep(field.value)

                                                            setEnderecoOrigem("")

                                                            if (cepValido === false) {
                                                                setError("cepOrigem", { type: "manual", message: "Cep Inválido" })


                                                                field.onBlur()
                                                                return cepValido
                                                            }

                                                            if (cidade) setEnderecoOrigem(`${cidade} - ${estado}`)

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

                                                            if (cepDestino.current === field.value) return

                                                            if (field.value.trim() === "") {
                                                                setEnderecoDestino("")
                                                                return
                                                            }

                                                            const { cepValido, cidade, estado } = await validarCep(field.value)

                                                            if (cepValido === false) {
                                                                setError("cepDestino", { type: "manual", message: "Cep Inválido" })


                                                                field.onBlur()
                                                                return cepValido
                                                            }

                                                            if (cidade) setEnderecoDestino(`${cidade} - ${estado}`)

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

                            {/* Dados da mercadoria */}
                            <div className="flex flex-col gap-2">

                                {/* Cabeçalho dados da mercadoria */}
                                <div>
                                    <h2 className="font-bold text-xl ">Dados da mercadoria</h2>
                                    <p className="text-gray-500 text-md font-light">Informações das cargas que serão despachadas</p>
                                </div>

                                <div className="flex flex-col gap-5">

                                    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-3 w-full">

                                        {/* Input Peso Real */}
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

                                        {/* Input valor Nfe */}
                                        <div className="flex flex-col">
                                            <Label obrigatorio={true} htmlFor="valorNfe">Valor total NF-e</Label>

                                            <Controller
                                                name="valorNfe"
                                                control={control}
                                                render={({ field }) => (
                                                    <InputNumber
                                                        ref={field.ref}
                                                        erro={errors.valorNfe?.message}
                                                        className="w-full"
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

                                        {/* Input total de volumes */}
                                        <div className="flex flex-col">
                                            <Label obrigatorio={true} htmlFor="totalVolumes">Total de Volumes</Label>


                                            <Controller
                                                name="totalVolumes"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        className="w-full pl-12"
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

                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <p className="font-medium" >Dimensões das embalagens</p>
                                            <p className="text-gray-500 text-sm">Medidas em metros (m)</p>
                                        </div>

                                        <div>
                                            <LinhasCubagens
                                                totalVolumes={getValues("totalVolumes")}
                                            />
                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="flex flex-col items-end gap-1">

                                <div className="flex flex-row justify-end items-center gap-3">
                                    {/* Botão de Difal */}
                                    <ToggleSwitch
                                        name="difalOpcao"
                                        control={control}
                                        label="Incluir difal?"
                                    />

                                    {/* Botao de submit */}
                                    <div className="flex flex-col gap-1">
                                        <Button type="submit" carregando={carregando}>
                                            Simular Cotação
                                        </Button>
                                    </div>
                                </div>

                                {errors.root && (
                                    <div className="text-red-500 text-md"><p>{errors.root.message}</p></div>
                                )}

                            </div>

                        </div>

                    </form >

                </motion.div>

                <AnimatePresence>

                    {cotacaoDados && <CotacaoCard key={"cotacao-card"} resultado={cotacaoDados} clicadoFuncao={() => { setCotacaoCompleta(true) }} clicado={cotacaoCompleta} />}

                    {cotacaoCompleta && <FormularioCotacaoCompleto key={"formulario-completo"} />}

                </AnimatePresence>


            </FormProvider>
        </>
        )
    } else if (apiCepCheck === "offline") {
        return (
            <span>Site em manutenção, tente novamente mais tarde...</span>
        )
    } else if (apiCepCheck === "carregando") {
        return (
            <div className="flex flex-col bg-white justify-center items-center w-full py-5 px-10 rounded-xl shadow-lg">
                <div className="border border-b-transparent border-6 rounded-full w-[50px] h-[50px] animate-spin"></div>
            </div>
        )
    }
}