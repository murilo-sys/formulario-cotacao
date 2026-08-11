import "server-only";

import axios, { AxiosResponse } from "axios";

export interface RespostaGraphQLPessoa {
  data?: {
    company?: {
      edges?: Array<{
        node: {
          cnpj?: string;
        };
      }>;
    };
    individual?: {
      edges?: Array<{
        node: {
          cpf?: string;
        };
      }>;
    };
  };
}

//Lê a variavel de ambiente
const token = process.env.TOKEN_GRAPHQL_API;

export default async function consultarPessoa(doc: string): Promise<AxiosResponse<RespostaGraphQLPessoa>> {
  //Caso não tenha o token
  if (!token) {
    console.error("Token API graphql não cadastrada.");
    throw new Error("Token API GraphQL não configurada");
  }

  const query = `${
    doc.length === 14
      ? `query company($params: CompanyInput!, $after: String, $before: String, $first: Int, $last: Int){
  company(params: $params, after: $after, before: $before, first: $first, last: $last){
    edges{
      node{
        cnpj
     }
     }
   }
}`
      : `query individual($params: IndividualInput!, $after: String, $before: String, $first: Int, $last: Int){
  individual(params: $params, after: $after, before: $before, first: $first, last: $last){
    edges{
      node{
        cpf
      }
    }
  }
}`
  }`;

  const variables = {
    params: doc.length === 14 ? { cnpj: doc } : { cpf: doc }
  };

  return await axios.post(
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
}
