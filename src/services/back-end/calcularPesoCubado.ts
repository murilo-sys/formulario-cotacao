import { CubagemType } from '@/schemas/cotacaoSchema';
import 'server-only'

type CubagemArrayType = [
    CubagemType
]

export function calcularPesoCubado(cubagens: CubagemArrayType, fator: number): number {

    const totalPesoCubado = cubagens.reduce((pesoCubado, item) => {
        return pesoCubado + (Number(item.comprimento.replace(",", ".")) * Number(item.largura.replace(",", ".")) * Number(item.altura.replace(",", ".")) * fator) * Number(item.quantidade)
    }, 0)

    return totalPesoCubado
}