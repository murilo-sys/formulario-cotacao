import { CubagemType } from '@/schemas/cotacaoSchema';

type CubagemArrayType = CubagemType[]

export function calcularPesoCubado(cubagens: CubagemArrayType, fator: number): number {

    const totalPesoCubado = cubagens.reduce((pesoCubado, item) => {

        if (!item?.altura || !item?.comprimento || !item?.largura) {
            return pesoCubado
        }

        //Return limpando com regex para transformar em Number
        return pesoCubado + (Number(item.comprimento.replace(",", ".").replace(/\.(?=\d+\.)/g, '')) * Number(item.largura.replace(",", ".").replace(/\.(?=\d+\.)/g, '')) * Number(item.altura.replace(",", ".").replace(/\.(?=\d+\.)/g, '')) * fator) * Number(item.quantidade)
    }, 0)

    return totalPesoCubado
}