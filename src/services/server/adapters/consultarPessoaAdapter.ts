import "server-only";

import axios, { AxiosResponse } from "axios";

export interface RespostaGraphQLPessoa {
  data?: {
    company?: {
      edges: Array<{
        node?: {
          cnpj: string;
          mainAddress: {
            city: {
              name: string;
              state: {
                code: string;
              };
            };
          };
        };
      }>;
    };
    individual?: {
      edges: Array<{
        node?: {
          cpf: string;
          mainAddress: {
            city: {
              name: string;
              state: {
                code: string;
              };
            };
          };
        };
      }>;
    };
  };
}

//Lê a variavel de ambiente
const token = process.env.TOKEN_GRAPHQL_API;

// Cache em memória dos documentos já consultados
const cacheDocumentos = new Map<string, RespostaGraphQLPessoa>();

export default async function consultarPessoa(doc: string): Promise<AxiosResponse<RespostaGraphQLPessoa>> {
  //Caso não tenha o token
  if (!token) {
    console.error("Token API graphql não cadastrada.");
    throw new Error("Token API GraphQL não configurada");
  }

  //Verifica se existe no cache
  if (cacheDocumentos.has(doc)) {
    //retorna o valor caso exista
    return cacheDocumentos.get(doc) as AxiosResponse<RespostaGraphQLPessoa>;
  }
  //Query dinamica
  const query = `${
    doc.length === 14
      ? `query company($params: CompanyInput!, $after: String, $before: String, $first: Int, $last: Int) {
      company(params: $params, after: $after, before: $before, first: $first, last: $last) {
        edges {
          node {
            cnpj
            mainAddress {
              city {
                name
                state {
                  code
                }
              }
            }
          }
        }
      }
    }`
      : `query individual($params: IndividualInput!, $after: String, $before: String, $first: Int, $last: Int){
  individual(params: $params, after: $after, before: $before, first: $first, last: $last){
    edges{
      node{
        cpf
        mainAddress{
          city{
            name
            state{
              code
            }
          }
        }
      }
    }
  }
}`
  }`;

  //Variables dinamica
  const variables = {
    params: doc.length === 14 ? { cnpj: doc } : { cpf: doc }
  };

  //Faz a consulta
  const consulta = await axios.post(
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

  //Define o cache
  cacheDocumentos.set(doc, consulta);

  //Retorna consulta
  return consulta;
}
