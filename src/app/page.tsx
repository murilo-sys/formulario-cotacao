"use client"

import { useState } from "react"
import { Input } from "@/components/Input"
import Image from "next/image"

export default function Home() {

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [redeSocial, setRedeSocial] = useState("")

  function handlerSubmeterCotacao(e: React.SubmitEvent) {

    e.preventDefault()

    if (nome.trim() == "" || !isNaN(Number(nome))) {

      alert("Nome inválido")

      return
    }

    if (email.trim() == "" || !isNaN(Number(email))) {

      alert("Email inválido")

      return
    }

    console.log("Formulário enviado")
    console.log("Nome:", nome);
    console.log("Email:", email)

    alert(`Cotação solicitada por ${nome}`)
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

        <div className="bg-white w-full max-w-md lg:max-w-sm rounded-3xl shadow-lg pb-1 pt-4 pl-7 pr-5">

          <h1 className="font-bold text-center text-2xl mb-3">Realize sua cotação</h1>

          <div className="flex flex-col gap-1 border-b border-gray-200 pb-3">
            <h3 className="font-bold">Bem-vindo(a)!</h3>
            <p className="text-gray-400">Para facilitar o atendimento, disponibilizamos este formulário para que você realize simulação da sua cotação de forma rápida e prática</p>
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

          <div className="flex justify-center">
            <Image
              src="/logo.webp"
              alt="Logo Global Cargo"
              height={420}
              width={594}
              className="h-32 w-auto"
            />
          </div>

        </div>

        <div className="bg-white w-full max-w-md lg:max-w-3xl p-8 rounded-xl shadow-lg">

          <form onSubmit={handlerSubmeterCotacao}>

            <div>

              <h2 className="font-bold text-xl">Dados dos participantes</h2>
              <p className="text-gray-500 text-md font-light">Lugar de onde a carga irá sair e ser entregue</p>

              <div className="grid grid-rows-1 grid-cols-1">

                <div>
                  <h3 className="text-md text-black">Documento do Remetente</h3>
                </div>

                <div>
                  <h3 className="text-md text-black">Documento do Destinatário</h3>
                </div>

              </div>

            </div>

          </form>

        </div>

      </div>

    </div>
  )
}