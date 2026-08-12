"use client";

import { Input } from "@/components/ui/inputs/Input";
import { InputNumber } from "@/components/ui/inputs/InputNumber";
import { Label } from "@/components/ui/Label";
import LinhasCubagens from "@/components/ui/LinhasCubagens";
import { CotacaoDados } from "@/schemas/cotacaoSchema";
import { Controller, useFormContext } from "react-hook-form";

export default function FormMercadoria() {
  //useFormContext para importar o useForm do formulário principal "integrando" eles
  const {
    control,
    clearErrors,
    formState: { errors }
  } = useFormContext<CotacaoDados>();

  return (
    <div className="flex flex-col gap-2">
      {/* Cabeçalho dados da mercadoria */}
      <div>
        <h2 className="font-bold text-xl ">Dados da mercadoria</h2>
        <p className="text-gray-500 text-md font-light">Informações das cargas que serão despachadas</p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-3 w-full">
          {/* Input Peso Real */}
          <div className="flex flex-col">
            <Label obrigatorio={true} htmlFor="pesoReal">
              Peso Real
            </Label>

            <Controller
              name="pesoReal"
              control={control}
              render={({ field }) => (
                <InputNumber
                  ref={field.ref}
                  className="w-full pl-11"
                  prefixo="KG"
                  erro={errors.pesoReal?.message}
                  id="pesoReal"
                  type="text"
                  value={field.value}
                  onAccept={(valor) => {
                    clearErrors("pesoReal");
                    field.onChange(valor);
                  }}
                />
              )}
            />
          </div>

          {/* Input valor Nfe */}
          <div className="flex flex-col">
            <Label obrigatorio={true} htmlFor="valorNfe">
              Valor total NF-e
            </Label>

            <Controller
              name="valorNfe"
              control={control}
              render={({ field }) => (
                <InputNumber
                  ref={field.ref}
                  erro={errors.valorNfe?.message}
                  className="w-full"
                  prefixo="R$"
                  id="valorNfe"
                  type="text"
                  value={field.value}
                  onAccept={(valor) => {
                    clearErrors("valorNfe");
                    field.onChange(valor);
                  }}
                />
              )}
            />
          </div>

          {/* Input total de volumes */}
          <div className="flex flex-col">
            <Label obrigatorio={true} htmlFor="totalVolumes">
              Total de Volumes
            </Label>

            <Controller
              name="totalVolumes"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="w-full pl-12"
                  prefixo="UN"
                  erro={errors.totalVolumes?.message}
                  id="totalVolumes"
                  type="text"
                  ref={field.ref}
                  value={field.value}
                  onChange={(e) => {
                    clearErrors("totalVolumes");
                    const valorLimpo = e.target.value.replace(/\D/g, "");
                    field.onChange(valorLimpo);
                  }}
                />
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <p className="font-medium">Dimensões das embalagens</p>
            <p className="text-gray-500 text-sm">Medidas em metros (m)</p>
          </div>

          <div>
            <LinhasCubagens />
          </div>
        </div>
      </div>
    </div>
  );
}
