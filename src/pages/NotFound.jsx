import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center px-6 py-12 bg-white shadow-lg rounded-lg">
                <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
                <p className="text-xl text-gray-700 mb-4">Page Not Found</p>
                <p className="text-gray-500 mb-6">
                    Sorry, the page you’re looking for doesn’t exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
