import { IMaskInput } from "react-imask";

interface InputNumberProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onAccept: (value: string) => void;
}

export function InputNumber({ className, ...props }: InputNumberProps) {

    const baseClasses = `border border-zinc-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ""}`

    return (

        // @ts-expect-error: Ignorando a tipagem complexa da biblioteca react-imask
        <IMaskInput
            {...props}
            className={`${baseClasses}`}
            mask={Number}
            scale={2}
            thousandsSeparator="."
            radix=","
            padFractionalZeros={true}
            normalizeZeros={true}
            mapToRadix={['.']}
        />
    )
}