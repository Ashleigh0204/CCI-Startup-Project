export default function Container({children, className}) {
    return (
        <div className={`m-4 px-4 py-3 border-4 rounded-md border-color-gray-100 ${className}`}>
            {children}
        </div>
    )
}