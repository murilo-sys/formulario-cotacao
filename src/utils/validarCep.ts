// Cache em memória dos ceps já consultados
const cacheCeps = new Map<string, { cepValido: boolean; cidade: string; estado: string }>();

export default async function validarCep(cep: string) {
  // Valida se existe
  if (!cep)
    return {
      cepValido: false
    };

  //Formata com regex deixando apenas números
  const cepFormatado = cep.replace(/\D/g, "");

  // Valida tamanho do cep
  if (cepFormatado.length !== 8)
    return {
      cepValido: false
    };

  //Verifica se o cep existe no cache e retorna ele caso exista
  if (cacheCeps.has(cepFormatado)) {
    return cacheCeps.get(cepFormatado);
  }

  const url = `https://viacep.com.br/ws/${cepFormatado}/json/`;

  try {
    // Faz a consulta do cep
    const cepConsulta = await fetch(url);

    //Caso não retorne 200-299
    if (!cepConsulta.ok) {
      throw new Error(`Erro de rede: ${cepConsulta.status}`);
    }

    //Lê a resposta
    const cepDados = await cepConsulta.json();

    //Caso contenha erro ou não encontrou (Api retorna 200 mesmo tendo erro)
    if (cepDados.erro == "true") {
      return {
        cepValido: false
      };
    }

    cacheCeps.set(cepFormatado, { cepValido: true, cidade: cepDados.localidade, estado: cepDados.uf });
    return {
      cepValido: true,
      cidade: cepDados.localidade,
      estado: cepDados.uf
    };
  } catch {
    return {
      cepValido: null
    };
  }
}
