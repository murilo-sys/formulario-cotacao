import { CotacaoCompletaDados } from "@/schemas/cotacaoSchema";
import consultarDoc from "@/services/consultarDoc";
import { useFormContext } from "react-hook-form";

type CampoDocumento = "remetenteDoc" | "destinatarioDoc";

export function useValidarDocumento() {
  //useFormContext para importar o useForm do formulário principal "integrando" eles
  const { setError, trigger } = useFormContext<CotacaoCompletaDados>();

  async function consultarDocumento(documento: string, campo: CampoDocumento): Promise<boolean> {
    // Faz a verificação da sintaxe usando trigger no zod
    const sintaxeValida = await trigger(campo);

    //Se não for true, retorna false
    if (!sintaxeValida) return false;

    //Consta o doc no sistema
    const ehValido = await consultarDoc(documento);

    //Caso seja valido
    if (ehValido) {
      return true;

      // caso não seja valido
    } else {
      setError(campo, { type: "manual", message: "cadastroInexistente" });
      return false;
    }
  }

  return {
    consultarDocumento
  };
}
