interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    carregando?: boolean;
}

export function Button({ carregando, children, className, ...props }: ButtonProps) {
    return (
        <button
            {...props}
            disabled={carregando}
            className={`flex flex-row items-center justify-center gap-2 group
                bg-blue-600 text-white rounded-full cursor-pointer disabled:cursor-not-allowed
                hover:bg-blue-500  transition-all transform-transition 
                overflow-hidden whitespace-nowrap
                border-2 border-transparent hover:border-blue-600
                ${carregando ? "w-14 h-14 p-0" : "w-48 h-14 hover:-translate-y-0.5 active:scale-95"} ${className ? className : ""}`}
        >
            {carregando ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5
                    transition-transform duration-300 group-hover:translate-x-1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                    {children}
                </>
            )}
        </button >
    );
}