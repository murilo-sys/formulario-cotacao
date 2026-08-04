import { ComponentProps } from "react"
import { IMaskInput } from "react-imask"

// Tipo exato da máscara do IMask
type TipoMascara = ComponentProps<typeof IMaskInput>["mask"]

// Máscara Dinâmica de CPF / CNPJ
export const mascaraCpfCnpj: TipoMascara = [
    { mask: "000.000.000-00" },   // CPF (até 11 números)
    { mask: "00.000.000/0000-00" }  // CNPJ (14 números)
]