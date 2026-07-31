import { CIDADES_FATOR_300 } from "@/data/cidadesFator300"
import validarCep from "@/utils/validarCep"

export async function calcularFator(cep: string): Promise<number> {

    //Pega a cidade desse cep
    const { cidade, estado } = await validarCep(cep)

    //Formata cidade e estado para a pesquisa na lista
    const cidadeEstado = `${estado.toUpperCase()} ${cidade}`

    //Se tem a cidade na lista retorna 300, caso ao contrário retorna 167
    return CIDADES_FATOR_300.has(cidadeEstado) ? 300 : 167

}