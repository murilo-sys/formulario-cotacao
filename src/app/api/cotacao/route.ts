import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {

    const searchParams = await request.nextUrl.searchParams;

    const cepOrigem = searchParams.get('cepOrigem')
    const cepDestino = searchParams.get('cepDestino')
    const pesoReal = searchParams.get('pesoReal')
    const totalVolumes = searchParams.get('totalVolumes')
    const valorNfe = searchParams.get('valorNfe')

    const url = "https://globalcargo.eslcloud.com.br/api/quote/calculate_freights"

    const token = process.env.TOKEN_API

    const cotacaoRodo = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            "data": {
                "attributes": {
                    "origin_postal_code": cepOrigem,
                    "destination_postal_code": cepDestino,
                    "customer_price_table_code": "REXP 2026",
                    "real_weight": pesoReal,
                    "invoices_value": valorNfe,
                    "invoices_volumes": totalVolumes,
                    "modal": "rodo"
                }
            }
        })
    })

    console.log(await cotacaoRodo.json())


}