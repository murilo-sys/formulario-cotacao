import FormularioCotacao from "@/components/FormularioCotacao"
import Image from "next/image"


export default function Home() {

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

        <div className="flex flex-col gap-3">
          <FormularioCotacao />
        </div>
      </div>

    </div>
  )
}