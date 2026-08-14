import "server-only";

import axios from "axios";

export interface DadosPessoaConsultada {
  valido: boolean;
  cidade?: string;
  estado?: string;
  cep?: string;
  contribuinte?: boolean;
}

// Lê a variável de ambiente
const token = process.env.TOKEN_GRAPHQL_API;

// Cache em memória dos documentos já consultados
const cacheDocumentos = new Map<string, DadosPessoaConsultada>();

export default async function consultarPessoa(doc: string): Promise<DadosPessoaConsultada> {
  // Caso não tenha o token
  if (!token) {
    console.error("Token API GraphQL não cadastrada.");
    throw new Error("Token API GraphQL não configurada");
  }

  // Verifica se existe no cache
  if (cacheDocumentos.has(doc)) {
    return cacheDocumentos.get(doc)!;
  }

  // Query dinâmica
  const query = `${
    doc.length === 14
      ? `query company($params: CompanyInput!, $after: String, $before: String, $first: Int, $last: Int) {
      company(params: $params, after: $after, before: $before, first: $first, last: $last) {
        edges {
          node {
            cnpj
            taxpayer
            mainAddress {
              postalCode
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
          postalCode
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

  // Variáveis dinâmicas
  const variables = {
    params: doc.length === 14 ? { cnpj: doc } : { cpf: doc }
  };

  // Faz a consulta GraphQL
  const consulta = await axios.post(
    "https://globalcargo.eslcloud.com.br/graphql",
    { query, variables },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`
      }
    }
  );

  // Extrai com segurança checando se o nó e os relacionamentos existem
  const data = consulta.data?.data;
  const nodeCompany = data?.company?.edges?.[0]?.node;
  const nodeIndividual = data?.individual?.edges?.[0]?.node;
  const node = nodeCompany || nodeIndividual;

  // Se não encontrou o cadastro ou faltam dados essenciais
  if (!node || !node.mainAddress?.city?.name || !node.mainAddress?.city?.state?.code) {
    const resultadoInvalido: DadosPessoaConsultada = { valido: false };
    cacheDocumentos.set(doc, resultadoInvalido);
    return resultadoInvalido;
  }

  // Monta o objeto limpo e formatado
  const resultadoValido: DadosPessoaConsultada = {
    valido: true,
    cidade: node.mainAddress.city.name,
    estado: node.mainAddress.city.state.code,
    cep: node.mainAddress.postalCode,
    contribuinte: node.taxpayer
  };

  // Salva no cache e retorna
  cacheDocumentos.set(doc, resultadoValido);
  return resultadoValido;
}
