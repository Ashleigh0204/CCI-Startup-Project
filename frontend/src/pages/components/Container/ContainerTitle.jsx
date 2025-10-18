export default function ContainerTitle({children, className=""}) {
    return (
        <div className={`text-lg font-bold underline text-green-800 ${className}`}>
            {children}
        </div>
    )
}