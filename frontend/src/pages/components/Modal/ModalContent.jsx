export default function ModalContent({children, className=""}) {
    return (
        <div className={`text-sm text-gray-700 ${className}`}>
            {children}
        </div>
    )
}