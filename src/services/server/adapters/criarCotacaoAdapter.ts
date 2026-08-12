import { CotacaoCompletaDados } from "@/schemas/cotacaoSchema";
import axios from "axios";

interface CriarCotacaoResponseType {
  data: {
    quoteCreate: {
      resource: {
        sequenceCode: number;
      };
      sucess: boolean;
    };
  };
}

export default async function criarCotacao(dados: CotacaoCompletaDados): Promise<CriarCotacaoResponseType> {
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

  const data = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });
  const hora = new Date().toLocaleTimeString("sv-SE", { timeZone: "America/Sao_Paulo" });
  const dataISO = `${data}T${hora}`;

  const variables = {
    params: {
      comments: "Cotação",
      corporationId: 107892,
      customer: {
        document: dados.pagadorFrete === "rem" ? dados.solicitanteDoc : dados.destinatarioDoc
      },
      requestedAt: dataISO,
      requesterName: dados.solicitanteNome,
      quoteStretchBidsAttributes: [
        {
          payer: {
            document: dados.pagadorFrete === "rem" ? dados.solicitanteDoc : dados.destinatarioDoc
          },
          originCity:{
            name: dados.
          }
        }
      ]
    }
  };

  return await axios.post("https://globalcargo.eslcloud.com.br/graphql", {
    query: query,
    variables: variables
  });
}
