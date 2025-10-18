export default function Header() {
    return (
        <div>
            <nav className="bg-black text-white">
                <div className="flex justify-between items-center space-x-5 px-5">
                    <div className="flex items-center font-bold text-2xl">  
                        <img src="/logo.png" className="h-20"/>
                            Forty Knives and Forks
                    </div>
                    <div className="flex items-center">
                        <img src="/profile.jpg" className="h-16 rounded-full"/>
                        <div className="pl-5">Norm Niner</div>
                    </div>
                </div>
            </nav>
        </div>
    )
}