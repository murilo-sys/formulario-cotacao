type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: InputProps) {
    return (
        <input
            {...props}
            className={`border border-zinc-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ""}`}
        />
    )
}