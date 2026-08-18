import { CotacaoDados } from "@/schemas/cotacaoSchema";
import validarCep from "@/utils/validarCep";
import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

export function useEndereco() {
  // Nome Rua Origem - Nome Rua Destino
  const [enderecoOrigem, setEnderecoOrigem] = useState<string>("");
  const [enderecoDestino, setEnderecoDestino] = useState<string>("");

  // Cep origem - Cep destino /-/-/
  // Usado para quando o usuario clicar no campo, guardar o valor,
  // e se quando ele sair, verificar se ambos são iguais, se for igual, não verifica novamente na API
  const cepOrigemRef = useRef<string>("");
  const cepDestinoRef = useRef<string>("");

  // Context do useForm principal
  const { setError } = useFormContext<CotacaoDados>();

  //Função de consultarCep no momento do onBlur
  async function consultarCepBlur(valorAtual: string, campo: "cepOrigem" | "cepDestino") {
    const refAtual = campo === "cepOrigem" ? cepOrigemRef : cepDestinoRef;
    const setEndereco = campo === "cepOrigem" ? setEnderecoOrigem : setEnderecoDestino;

    // Se não foi alterado o texto, retorna
    if (refAtual.current === valorAtual) return;

    // Caso o campo esteja vazio
    if (valorAtual.trim() === "") {
      setEndereco("");
      return;
    }

    //Valida e consulta o cep Atual
    const { cepValido, cidade, estado } = await validarCep(valorAtual);

    //Caso o cep não seja válido
    if (cepValido === false) {
      setError(campo, { type: "manual", message: "Cep Inválido" });
      return;
    }

    if (cidade && estado) setEndereco(`${cidade} - ${estado}`);
  }

  // Exporta o que a tela precisa usar:
  return {
    enderecoOrigem,
    enderecoDestino,
    cepOrigemRef,
    cepDestinoRef,
    consultarCepBlur
  };
}
