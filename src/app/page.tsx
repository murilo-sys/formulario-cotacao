"use client"

import { useState } from "react"
import { Input } from "@/components/inputs/Input"
import { Label } from "@/components/Label"
import { Button } from "@/components/Button"
import Image from "next/image"
import { InputNumber } from "@/components/inputs/InputNumber"
import { CotacaoSchema } from "@/utils/validacoes"

export default function Home() {

  const [cepOrigem, setCepOrigem] = useState("")
  const [cepDestino, setCepDestino] = useState("")
  const [pesoReal, setPesoReal] = useState("")
  const [valorNfe, setValorNfe] = useState("")
  const [totalVolumes, setTotalVolumes] = useState("")
  const [carregando, setSimulando] = useState(false)
  const [erros, setErros] = useState<Record<string, string>>({})


  function handlerSubmeterCotacao(e: React.SubmitEvent) {
    e.preventDefault()

    const dadosDoFormulario = {
      cepOrigem,
      cepDestino,
      pesoReal,
      valorNfe,
      totalVolumes
    }

    const resultado = CotacaoSchema.safeParse(dadosDoFormulario)

    if (!resultado.success) {
      const mensagensDeErro = resultado.error.flatten().fieldErrors
      const errosFormatados: Record<string, string> = {}

      for (const campo in mensagensDeErro) {

        const chave = campo as keyof typeof mensagensDeErro

        errosFormatados[chave] = mensagensDeErro[chave]?.[0] || "Campo inválido"


      }

      setErros(errosFormatados)
      console.log(erros)
      return
    }

    setSimulando(true)

    setTimeout(() => {
      setSimulando(false)
    }, 2000);


  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">

      {/* Imagem de fundo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bg-watermark.webp"
          alt="Caminão de fundo"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="flex flex-col items-center lg:flex-row lg:justify-center gap-8 w-full px-4">

        <div className="bg-white w-full max-w-md lg:max-w-[345px] rounded-3xl shadow-lg pb-1 pt-4 pl-7 pr-7">

          <h1 className="font-bold text-center text-2xl mb-3">Realize sua cotação</h1>

          <div className="flex flex-col gap-1 border-b border-gray-200 pb-3">
            <h3 className="font-bold">Bem-vindo(a)!</h3>
            <p className="text-gray-400">Para facilitar o atendimento, disponibilizamos este
              formulário para que você realize simulação da sua cotação de forma rápida e prática</p>
          </div>

          <div className="flex flex-col gap-1 mt-3 border-b border-gray-200 pb-3">
            <h3 className="font-bold">Fale Conosco - Segunda a Sexta: Das 08h às 18h</h3>
            <ul className="list-disc list-inside text-sm marker:text-xs text-gray-400">
              <li>(11) 3017-8990</li>
              <li>(11) 2222-1260</li>
              <li>(11) 97712-0119</li>
            </ul>
          </div>

          <div className="flex flex-col gap-1 mt-3 border-b border-gray-200 pb-5">
            <h3 className="font-bold">Chat Pelo Whatsapp</h3>
            <a href="https://wa.me/5511977120119" className="underline underline-offset-4 text-sm font-medium">CLIQUE E FALE COM NOSSOS ATENDENTES</a>
          </div>

          <div className="flex flex-col gap-1 mt-3 border-b border-gray-200 pb-3">
            <h3 className="font-bold">Onde estamos?</h3>
            <ul className="list-disc list-inside text-sm marker:text-xs text-gray-400">
              <li>Sede: Av. Forte do leme, 873 São Mateus</li>
              <li>São Paulo - CEP 08340-010</li>
            </ul>
          </div>

          <div className="flex justify-center m-3">
            <Image
              src="/logo-novo.webp"
              alt="Logo Global Cargo"
              height={90}
              width={350}
              className="h-10 w-auto"
            />
          </div>

        </div>

        <div className="bg-white w-full max-w-md p-5 pr-10 pl-10 rounded-xl shadow-lg lg:max-w-2xl">

          <form onSubmit={handlerSubmeterCotacao}>

            <div>

              <h2 className="font-bold text-xl">Dados dos endereços</h2>
              <p className="text-gray-500 text-md font-light">Lugar de onde a carga irá sair e ser entregue</p>

              <div className="flex flex-col mt-3 gap-3 lg:flex-row lg:justify-between w-full">

                <div className="lg:w-[43%] flex flex-col">

                  <Label obrigatorio={true} htmlFor="cepOrigem">CEP de origem</Label>
                  <Input
                    placeholder="00000-000"
                    erro={erros["cepOrigem"]}
                    id="cepOrigem"
                    type="text"
                    mask="00000-000"
                    value={cepOrigem}
                    onAccept={(valor) => { setCepOrigem(valor) }} />

                </div>

                <div className="lg:w-[43%] flex flex-col">

                  <Label obrigatorio={true} htmlFor="cepDestino">CEP de destino</Label>
                  <Input
                    placeholder="00000-000"
                    erro={erros["cepDestino"]}
                    id="cepDestino"
                    type="text"
                    mask="00000-000"
                    value={cepDestino}
                    onAccept={(valor) => { setCepDestino(valor) }} />

                </div>

              </div>

              <h2 className="font-bold text-xl mt-7">Dados da mercadoria</h2>
              <p className="text-gray-500 text-md font-light">Informações das cargas que serão despachadas</p>

              <div className="flex flex-col gap-4 mt-3 lg:grid lg:grid-cols-3 lg:gap-6 w-full">

                <div className="flex flex-col">
                  <Label obrigatorio={true} htmlFor="pesoReal">Peso Real</Label>

                  <InputNumber
                    erro={erros["pesoReal"]}
                    prefixo="KG"
                    id="pesoReal"
                    type="text"
                    className="w-full pl-11"
                    value={pesoReal}
                    onAccept={(valor) => { setPesoReal(valor) }} />

                </div>

                <div className="flex flex-col">
                  <Label obrigatorio={true} htmlFor="valorNfe">Valor total NF-e</Label>

                  <InputNumber
                    erro={erros["valorNfe"]}
                    prefixo="R$"
                    id="valorNfe"
                    type="text"
                    className="w-full"
                    value={valorNfe}
                    onAccept={(valor) => { setValorNfe(valor) }} />

                </div>

                <div className="flex flex-col">
                  <Label obrigatorio={true} htmlFor="totalVolumes">Total de Volumes</Label>

                  <Input
                    erro={erros["totalVolumes"]}
                    prefixo="UN"
                    id="totalVolumes"
                    type="text"
                    className="w-full pl-12"
                    value={totalVolumes}
                    onChange={(e) => { setTotalVolumes(e.target.value) }} />

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

      </div>

    </div>
  )
}