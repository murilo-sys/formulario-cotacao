import { CotacaoCompletaDados } from "@/schemas/cotacaoSchema";
import parseNumberBR from "@/utils/parseNumberBR";
import axios from "axios";

interface CriarCotacaoResponseType {
  sequenceCode: number;
  success: boolean;
  valor?: string;
}

interface CotacaoCompletaDadosCidade extends CotacaoCompletaDados {
  cidadeOrigem: string;
  estadoOrigem: string;
  cidadeDestino: string;
  estadoDestino: string;
}

//Lê a variavel de ambiente
const token = process.env.TOKEN_GRAPHQL_API;

//Query
const query = `mutation quoteCreate($params: QuoteCreateInput!){
  quoteCreate(params: $params){
    errors
    resource{
      createdAt
      sequenceCode
    }
    success
  }
}`;

export default async function criarCotacaoAdapter(dados: CotacaoCompletaDadosCidade): Promise<CriarCotacaoResponseType> {
  //Caso não tenha o token
  if (!token) {
    console.error("Token API graphql não cadastrada.");
    throw new Error("Token API GraphQL não configurada");
  }

  const data = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });
  const hora = new Date().toLocaleTimeString("sv-SE", { timeZone: "America/Sao_Paulo" });
  const dataISO = `${data}T${hora}`;

  const variables = {
    params: {
      comments: "Cotação Teste",
      corporationId: 107892,
      customer: {
        document: dados.solicitanteDoc
      },
      requestedAt: dataISO,
      requesterName: dados.solicitanteNome,
      quoteStretchBidsAttributes: [
        {
          customerPriceTableId: 78513,
          payer: {
            document: dados.pagadorFrete === "rem" ? dados.remetenteDoc : dados.destinatarioDoc
          },
          originCity: {
            name: dados.cidadeOrigem,
            stateCode: dados.estadoOrigem
          },
          destinationCity: {
            name: dados.cidadeDestino,
            stateCode: dados.estadoDestino
          },
          invoicesValue: Number(parseNumberBR(dados.valorNfe)),
          realWeight: Number(parseNumberBR(dados.pesoReal)),
          sender: {
            document: dados.remetenteDoc
          },
          recipient: {
            document: dados.destinatarioDoc
          },
          modal: "rodo",
          emissionType: "cte_rodo",
          quoteStretchBidCubagesAttributes: dados.cubagens.map((item, index) => ({
            realWeight: index === 0 ? Number(parseNumberBR(dados.pesoReal)) : 0,
            height: Number(parseNumberBR(item.height)),
            width: Number(parseNumberBR(item.width)),
            length: Number(parseNumberBR(item.length)),
            volume: Number(item.volume),
            package: { name: "DIVERSOS" }
          }))
        }
      ]
    }
  };

  // console.log(JSON.stringify(variables));

  const response = await axios.post(
    "https://globalcargo.eslcloud.com.br/graphql",
    {
      query: query,
      variables: variables
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`
      }
    }
  );

  const quoteCreate = response.data?.data?.quoteCreate;
  const errors = quoteCreate?.errors;

  if (!quoteCreate || errors.length > 0) throw new Error("Não foi possivel criar a cotação.");

  return {
    sequenceCode: quoteCreate?.resource?.sequenceCode,
    success: quoteCreate?.success
  };
}
