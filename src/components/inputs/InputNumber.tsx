import { IMaskInput } from "react-imask";

interface InputNumberProps extends React.InputHTMLAttributes<HTMLInputElement> {
    prefixo?: string
    onAccept: (value: string) => void;
    erro?: string
}

export function InputNumber({ className, erro, prefixo, ...props }: InputNumberProps) {

    const baseClasses = `border border-zinc-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ""}`

    return (

        <div className={`relative w-full ${erro ? "bg-red-100 animate-shake" : ""}`}>
            {/* @ts-expect-error: Ignorando a tipagem complexa da biblioteca react-imask */}
            <IMaskInput
                {...props}
                className={`${baseClasses} ${prefixo ? "pl-11" : ""}`}
                mask={Number}
                scale={2}
                thousandsSeparator="."
                radix=","
                padFractionalZeros={true}
                normalizeZeros={true}
                mapToRadix={['.']}
            />

            {prefixo ? (
                <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none`} >
                    {prefixo + " |"}
                </span>
            ) : ""}
        </div>

    )
}