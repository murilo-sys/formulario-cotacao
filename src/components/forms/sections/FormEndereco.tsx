"use client"

import { Input } from "@/components/ui/inputs/Input"
import { Label } from "@/components/ui/Label"
import { CotacaoDados } from "@/schemas/cotacaoSchema"
import validarCep from "@/utils/validarCep"
import { useRef, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"

export default function FormEndereco() {

    // Nome Rua Origem - Nome Rua Destino
    const [enderecoOrigem, setEnderecoOrigem] = useState<string>("")
    const [enderecoDestino, setEnderecoDestino] = useState<string>("")

    // Cep origem - Cep destino /-/-/ 
    // Usado para quando o usuario clicar no campo, guardar o valor, 
    // e se quando ele sair, verificar se ambos são iguais, se for igual, não verifica novamente na API
    const cepOrigem = useRef<string>("")
    const cepDestino = useRef<string>("")

    //useFormContext para importar o useForm do formulário principal "integrando" eles
    const { control, clearErrors, setError, formState: { errors } } = useFormContext<CotacaoDados>()

    return (
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
    )
}