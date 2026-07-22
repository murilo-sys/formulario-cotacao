import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { CotacaoDados, CotacaoSchema } from "@/schemas/cotacaoSchema";

async function simularValores(modal: "rodo" | "air", dados: CotacaoDados, token: string) {

    //URL do endpoint
    const url = "https://globalcargo.eslcloud.com.br/api/quote/calculate_freights"

    //Retorna a requisição do axios (basicamente um fetch)
    return await axios.get(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Accept": "*/*"
        },

        //Data substituiu o body
        data:
        {
            "data": {
                "attributes": {
                    "origin_postal_code": dados.cepOrigem,
                    "destination_postal_code": dados.cepDestino,
                    "customer_price_table_code": `${modal === "rodo" ? "REXP 2026" : "ACON"}`,
                    "real_weight": dados.pesoReal,
                    "invoices_value": dados.valorNfe,
                    "invoices_volumes": dados.totalVolumes,
                    "modal": modal
                }
            }
        }
    })
}

export async function GET(request: NextRequest) {

    //Search params para pegar os parametros recebidos
    const searchParams = await request.nextUrl.searchParams;

    //Pega as variaveis da URL e guarda em dados
    const dados = {
        cepOrigem: searchParams.get('cepOrigem')?.replace(/\D/g, ""),
        cepDestino: searchParams.get('cepDestino')?.replace(/\D/g, ""),
        pesoReal: searchParams.get('pesoReal')?.replace(/\D/g, ""),
        totalVolumes: searchParams.get('totalVolumes')?.replace(/\D/g, ""),
        valorNfe: searchParams.get('valorNfe')?.replace(/\D/g, "")
    }

    //Faz a validação usando o zod (princio de verdade unica)
    const validacao = await CotacaoSchema.safeParseAsync(dados)

    //Caso a validacao não tenha sido um sucesso
    if (!validacao.success) {

        // Map para filtrar os valores e formatar
        const errors = validacao.error.issues.map(erro => ({
            campo: erro.path[0],
            mensagem: erro.message
        }))

        //Faz o return do nextResponse com as informações
        return NextResponse.json({ message: "Dados inválidos", errors }, { status: 400 })
    }

    // Começa requisição das simulações
    const token = process.env.TOKEN_API

    // Verifica se o token existe
    if (!token) {
        console.error("Chave de API não cadastrada")
        return NextResponse.json({ message: "Erro interno. Tente novamente mais tarde." }, { status: 500 })
    }

    // Cria a variavel resultado
    const resultado: { rodo?: unknown; air?: unknown } = {}

    // REQUISIÇÃO MODAL RODOVIÁRIO
    try {

        //Faz a requisição
        const cotacaoRodo = await simularValores("rodo", validacao.data, token)

        //Caso tenha sido um sucesso, faz um "push" para dentro do resultado
        resultado.rodo = cotacaoRodo.data

    } catch (error) {

        //Verifica se o error é do "tipo" Axios
        if (axios.isAxiosError(error)) {

            // Caso seja erro 404, não faz nada
            if (error.response && error.response.status === 404) {

            } else {

                //Printa o erro caso não seja 404
                console.error(error.message);
            }

        }

    }

    // REQUISIÇÃO MODAL AÉREO
    try {

        //Faz a requisição
        const cotacaoAereo = await simularValores("air", validacao.data, token)

        //Caso tenha sido um sucesso, faz um "push" para dentro do resultado
        resultado.air = cotacaoAereo.data

    } catch (error) {

        //Verifica se o error é do "tipo" Axios
        if (axios.isAxiosError(error)) {

            // Caso seja erro 404, não faz nada
            if (error.response && error.response.status === 404) {

            } else {

                //Printa o erro caso não seja 404
                console.error(error.message);
            }
        }

    }

    //Verifica o tamanho do objeto/array
    if (Object.keys(resultado).length === 0) {
        return NextResponse.json({ message: "Não foi possível simular a cotação" }, { status: 404 })
    }

    //Caso dê sucesso, retorna o resultado
    return NextResponse.json({ ...resultado }, { status: 200 })

}



