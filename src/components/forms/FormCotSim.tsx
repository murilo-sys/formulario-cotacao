"use client"

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/buttons/ButtonSimular"
import { CotacaoSchema, CotacaoDados, CotacaoResponse } from "@/schemas/cotacaoSchema"
import validarCep from "@/utils/validarCep";
import { AnimatePresence, motion } from "framer-motion";
import { simularCotacao } from "@/services/cotacao";
import CotacaoCard from "../cards/CotacaoCard";
import dynamic from "next/dynamic"

//Carregamento dinamico, apenas quando chamado
const FormularioCotacaoCompleto = dynamic(() => import("./FormCotCompleto"))

import { ToggleSwitch } from "../ui/ToggleSwitch";
import FormSolicitante from "./sections/FormSolicitante";
import FormEndereco from "./sections/FormEndereco";
import FormMercadoria from "./sections/FormMercadoria";


export default function FormularioCotacaoSimulacao() {

    // React-hook-form
    const rhf = useForm<CotacaoDados>({
        resolver: zodResolver(CotacaoSchema),
        mode: "onSubmit",
        reValidateMode: "onSubmit",
        defaultValues: {
            solicitanteDoc: "",
            solicitanteNome: "",
            cepOrigem: "",
            cepDestino: "",
            pesoReal: "",
            valorNfe: "",
            totalVolumes: "",
            difalOpcao: false,
            cubagens: [{ quantidade: "", comprimento: "", largura: "", altura: "" }]
        }
    })

    //useState solicitante verificado
    const [solicitanteVerificado, setSolicitanteVerificado] = useState<boolean>(false)

    // Extrai os metodos do RHF
    const { control, handleSubmit, setError, getValues, formState: { errors } } = rhf

    //Dados da cotação
    const [cotacaoDados, setCotacaoDados] = useState<CotacaoResponse | null>(null)

    //useState para verificar se VIACEP está ativo ou não
    const [apiCepCheck, setApiCepCheck] = useState<"carregando" | "online" | "offline">("carregando")

    //Lê variavel de ambiente
    const COT_COMPLETO = process.env.NEXT_PUBLIC_COT_COMPLETO === "true"

    // Botão carregando animação
    const [carregando, setCarregando] = useState(false)

    // Botão de estado - Se o usuario clicou em realizar cotação completa ou não
    const [cotacaoCompleta, setCotacaoCompleta] = useState<boolean>(false)

    //use Effect para abandono de pagina
    useEffect(() => {
        function aoFecharAba() {

            // Pega os valores atuais
            const valores = [
                getValues(),
                cotacaoDados || null
            ]

            // Se o usuário preencheu o solicitante (Doc e Nome) E NÃO concluiu a cotação
            if (solicitanteVerificado && !cotacaoCompleta) {

                // Empacota o JSON como Blob para o sendBeacon enviar via POST:
                const payload = new Blob([JSON.stringify(valores)], { type: "application/json" })

                // O navegador envia para o backend mesmo com a aba FECHADA!
                navigator.sendBeacon("/api/registrar-abandono", payload)
            }
        }

        // Escuta o evento nativo do navegador para quando a pessoa fecha a aba ou troca de site:
        window.addEventListener("pagehide", aoFecharAba)

        return () => {
            window.removeEventListener("pagehide", aoFecharAba)
        }
    }, [cotacaoCompleta, cotacaoDados, getValues, solicitanteVerificado])

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

    //Submit do formulário
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
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <form onSubmit={handleSubmit(handlerSubmeterCotacao)}>

                        {/* Formulário cotação simulação */}
                        {solicitanteVerificado ?

                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="flex flex-col gap-5 ">

                                {/* Dados do trecho */}
                                <FormEndereco />

                                {/* Dados da mercadoria */}
                                <FormMercadoria />

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

                            </motion.div>
                            :

                            <AnimatePresence>
                                <FormSolicitante key={"formSolicitante"}
                                    solicitanteVerificado={(valor) => { setSolicitanteVerificado(valor) }}
                                />
                            </AnimatePresence>

                        }

                    </form>


                </motion.div>

                <AnimatePresence>

                    {cotacaoDados && <CotacaoCard key={"cotacao-card"} resultado={cotacaoDados} clicadoFuncao={() => { setCotacaoCompleta(true) }} clicado={cotacaoCompleta} />}

                    {/* Verifique a variavel de ambiente */}
                    {COT_COMPLETO && cotacaoCompleta &&
                        <FormularioCotacaoCompleto key={"formulario-completo"} />
                    }

                </AnimatePresence>




            </FormProvider >
        </>
        )
    } else if (apiCepCheck === "offline") {

        return (
            <span>Site em manutenção, tente novamente mais tarde...</span>
        )

    } else if (apiCepCheck === "carregando") {

        return (
            <div className="flex flex-col bg-white justify-center items-center w-full py-5 rounded-xl shadow-lg">
                <div className="border border-b-transparent border-6 rounded-full w-[50px] h-[50px] animate-spin"></div>
            </div>
        )

    }
}