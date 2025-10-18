export default function Button({children,className=""}) {
    return (
        <button className={`bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${className}`}>{children}</button>
    )
}