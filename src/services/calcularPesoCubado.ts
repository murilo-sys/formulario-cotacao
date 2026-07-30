import { CubagemType } from '@/schemas/cotacaoSchema';

type CubagemArrayType = CubagemType[]

export function calcularPesoCubado(cubagens: CubagemArrayType, fator: number): number {

    const totalPesoCubado = cubagens.reduce((pesoCubado, item) => {

        if (!item?.altura || !item?.comprimento || !item?.largura) {
            return pesoCubado
        }

        return pesoCubado + (Number(item.comprimento.replace(",", ".")) * Number(item.largura.replace(",", ".")) * Number(item.altura.replace(",", ".")) * fator) * Number(item.quantidade)
    }, 0)

    return totalPesoCubado
}