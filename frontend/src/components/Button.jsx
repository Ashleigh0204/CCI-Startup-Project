export default function Button({variant, children,className="", ...props}) {
    let style_class=""
    if (variant=='outline') style_class = "bg-white border border-gray-200 text-gray-400 hover:bg-gray-200"
    else if (variant=='primary') style_class = "bg-green-800 hover:bg-green-700 text-white"
    else if (variant=='selected') style_class = "bg-white text-black"
    else if (variant=='secondary') style_class = "bg-black text-gray-300 hover:text-white hover:bg-gray-700"
    return (
        <button className={` py-2 px-4 rounded ${className} ${style_class}`} {...props}>{children}</button>
    )
}