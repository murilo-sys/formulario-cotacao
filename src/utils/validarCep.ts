export default async function validarCep(cep: string) {

    // Valida se existe
    if (!cep) return false

    //Formata com regex deixando apenas números
    const cepFormatado = cep.replace(/\D/g, "")

    // Valida tamanho do cep
    if (cepFormatado.length !== 8) return false

    const url = `https://viacep.com.br/ws/${cepFormatado}/json/`

    try {
        // Faz a consulta do cep
        const cepConsulta = await fetch(url)

        //Caso não retorne 200-299
        if (!cepConsulta.ok) {
            throw new Error(`Erro de rede: ${cepConsulta.status}`);
        }

        const cepDados = await cepConsulta.json()

        //Caso contenha erro
        if (cepDados.erro == "true" || cepDados.erro == true) {
            return false
        }

        return true

    } catch {
        return null
    }



}