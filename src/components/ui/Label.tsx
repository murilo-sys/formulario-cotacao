interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    obrigatorio?: boolean
}

export function Label({ obrigatorio, className, ...props }: LabelProps) {
    return (
        <label
            {...props}
            className={`w-full lg:w-fit font-medium text-black ${className || ""} ${obrigatorio ? "after:content-['*'] after:ml-1 after:text-red-500" : ""} `}
        />
    )
}