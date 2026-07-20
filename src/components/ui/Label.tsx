interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    obrigatorio?: boolean
}

export function Label({ obrigatorio, className, ...props }: LabelProps) {
    return (
        <label
            {...props}
            className={`font-medium text-black ${className || ""} ${obrigatorio ? "after:content-['*'] after:ml-1 after:text-red-500" : ""} `}
        />
    )
}