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
    <div className="relative min-h-screen flex items-center justify-center">

      <div className="absolute inset-0 -z-10">
        <Image
          src="/caminhao.webp"
          alt="Caminão de fundo"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Solicite sua cotação</h1>
        <p>A rede social é {redeSocial}</p>
        <form onSubmit={handlerSubmeterCotacao}>
          <div className="flex flex-col gap-4">

            <select className="w-full border border-zinc-300 rounded-md p-1"
              value={redeSocial}
              onChange={(e) => { setRedeSocial(e.target.value) }}>

              <option value="" disabled>Escolha uma opção</option>
              <option value="instagram">Instagram</option>
              <option value="whatsapp">Whatsapp</option>
              <option value="twitter">Twitter</option>
            </select>

            <Input
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)} />

            <Input
              type="email"
              placeholder="Seu melhor email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} />

            <button type="submit" className="w-full border border-red-700 rounded-md bg-red-500 hover:bg-red-600 ">Enviar cotação</button>
          </div>
        </form>
      </div>
    </div>
  )
}