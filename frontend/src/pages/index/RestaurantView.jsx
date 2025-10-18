export default function RestaurantView({title, description, isOpen, nextTime, kwords}) {
    return (
        <div  className={`border my-2 px-4 py-2 ${!isOpen
            ? "bg-gray-400 border-gray-800"
            : "bg-gray-50 border-gray-400"
        }`}>
            <h1 className="text-black font-bold font-md">{title}</h1>
            <p>{description}</p>
            <p>{kwords.join (", ")}</p>
            {isOpen ? <p>Open now!</p> : <p>Closed</p>}
            {isOpen ? <p>Closes at {nextTime}</p> : <p>Opens at {nextTime}</p>}
        </div>
    )
}