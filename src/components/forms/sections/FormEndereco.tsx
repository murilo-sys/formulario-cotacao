"use client";

import { Input } from "@/components/ui/inputs/Input";
import { Label } from "@/components/ui/Label";
import { useEndereco } from "@/hooks/useEndereco";
import { CotacaoDados } from "@/schemas/cotacaoSchema";
import { Controller, useFormContext } from "react-hook-form";

export default function FormEndereco() {
  const { enderecoOrigem, enderecoDestino, cepOrigemRef, cepDestinoRef, consultarCepBlur } = useEndereco();

  //useFormContext para importar o useForm do formulário principal "integrando" eles
  const {
    control,
    clearErrors,
    formState: { errors }
  } = useFormContext<CotacaoDados>();

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h2 className="font-bold text-xl ">Dados dos endereços</h2>
        <p className="text-gray-500 text-md font-light">Lugar de onde a carga irá sair e ser entregue</p>
      </div>

      <div>
        <div className="flex flex-col gap-2 lg:flex-row lg:justify-between w-full">
          <div className="lg:w-[43%] flex flex-col">
            <Label obrigatorio={true} htmlFor="cepOrigem">
              CEP de origem
            </Label>
            <Controller
              name="cepOrigem"
              control={control}
              render={({ field }) => (
                <Input
                  ref={field.ref}
                  onFocus={() => {
                    cepOrigemRef.current = field.value;
                  }}
                  rua={enderecoOrigem}
                  placeholder="00000-000"
                  erro={errors.cepOrigem?.message}
                  id="cepOrigem"
                  type="text"
                  mask="00000-000"
                  onBlur={async () => {
                    consultarCepBlur(field.value, "cepOrigem");
                    field.onBlur();
                  }}
                  value={field.value}
                  onAccept={(valor) => {
                    clearErrors("cepOrigem");
                    field.onChange(valor);
                  }}
                />
              )}
            />
          </div>

          <div className="lg:w-[43%] flex flex-col">
            <Label obrigatorio={true} htmlFor="cepDestino">
              CEP de destino
            </Label>
            <Controller
              name="cepDestino"
              control={control}
              render={({ field }) => (
                <Input
                  onFocus={() => {
                    cepDestinoRef.current = field.value;
                  }}
                  ref={field.ref}
                  placeholder="00000-000"
                  rua={enderecoDestino}
                  erro={errors.cepDestino?.message}
                  id="cepDestino"
                  type="text"
                  mask="00000-000"
                  value={field.value}
                  onBlur={async () => {
                    consultarCepBlur(field.value, "cepDestino");
                    field.onBlur();
                  }}
                  onAccept={(valor) => {
                    clearErrors("cepDestino");
                    field.onChange(valor);
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
