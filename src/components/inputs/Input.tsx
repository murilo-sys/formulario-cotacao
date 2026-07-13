import { IMaskInput } from "react-imask";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    mask?: string
    onAccept?: (value: string) => void;
}

export function Input({ className, mask, onAccept, ...props }: InputProps) {

    const baseClasses = `border border-zinc-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ""}`

    if (mask && onAccept) {
        return (
            // @ts-expect-error: Ignorando a tipagem complexa da biblioteca react-imask
            <IMaskInput
                {...(props)}
                mask={mask}
                onAccept={onAccept}
                className={baseClasses}
            />
        )
    }

    return (
        <input
            {...props}
            className={baseClasses}
        />
    )
}