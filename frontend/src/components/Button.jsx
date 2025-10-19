export default function Button({variant, children,className="", ...props}) {
    let style_class=""
    if (variant=='outline') style_class = "bg-white borderbg-white border border-gray-200 text-gray-400 hover:bg-gray-200"
    else if (variant=='primary') style_class = "bg-green-800 hover:bg-green-700 text-white"
    return (
        <button className={` py-2 px-4 rounded ${className} ${style_class}`} {...props}>{children}</button>
    )
}