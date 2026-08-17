"use client";

import { CotacaoDados } from "@/schemas/cotacaoSchema";
import { Controller, Control, FieldPath } from "react-hook-form";

interface ToggleSwitchProps {
  name: FieldPath<CotacaoDados>;
  control: Control<CotacaoDados>;
  label?: string;
  tooltip: string;
}

export function ToggleSwitch({ name, control, label, tooltip }: ToggleSwitchProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <label className="flex flex-col items-center cursor-pointer select-none">
          <div className="flex flex-row items-center gap-1">
            {/* Texto ao lado (Opcional) */}
            {label && <span className="text-sm font-medium text-gray-700">{label}</span>}

            {tooltip && (
              <div className="relative group">
                {/* Ícone de Ajuda (?) */}
                <span className="flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-blue-500 group-hover:bg-blue-100 group-hover:text-blue-800 rounded-full cursor-help transition-all">?</span>
                {/* Caixinha de Tooltip que aparece no Hover */}
                <div
                  className="bg-gray-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center w-56 p-2.5 bg-
  gray-900 text-white text-[11px] leading-snug rounded-xl shadow-xl z-50 pointer-events-none transition-all"
                >
                  <span className="text-center text-black">{tooltip}</span>
                </div>
              </div>
            )}
          </div>

          {/* Input invisível para o formulário continuar lendo o boolean */}
          <input
            type="checkbox"
            checked={Boolean(field.value)}
            onChange={(e) => {
              field.onChange(e.target.checked);
            }}
            className="sr-only" // Esconde o checkbox quadrado padrão
          />

          {/*Fundo*/}
          <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${field.value ? "bg-blue-600" : "bg-gray-300"}`}>
            {/* Bolinha branca que desliza pro lado */}
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ease-in-out
  ${field.value ? "translate-x-5" : "translate-x-0"}`}
            />
          </div>
        </label>
      )}
    />
  );
}
