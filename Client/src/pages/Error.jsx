import { Link } from "react-router-dom"

const Error = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="relative text-center p-10 bg-white shadow-2xl rounded-2xl animate-fadeIn">
                {/* Big 404 with bounce animation */}
                <h1 className="text-9xl font-extrabold text-blue-600 animate-bounce">
                    404
                </h1>
                <p className="mt-4 text-xl text-gray-600 font-medium">
                    Oops! The page you’re looking for doesn’t exist.
                </p>

                {/* Home Button */}
                <Link
                    to="/home"
                    className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
                >
                    <i className="ri-home-4-line text-2xl"></i> Go Home
                </Link>

                <div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-200 rounded-full opacity-50 animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-blue-300 rounded-full opacity-50 animate-ping"></div>
            </div>

            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.6s ease-in-out forwards;
                    }
                `}
            </style>
        </div>
    )
}

export default Error
