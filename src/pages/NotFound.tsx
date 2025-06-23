
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Check if this is a facility route that might be valid
    const facilityRoutePattern = /^\/facility\/[a-zA-Z-]+$/;
    if (facilityRoutePattern.test(location.pathname)) {
      // If it's a facility route, redirect to the facility route handler
      console.log("Redirecting facility route to handler");
      navigate(location.pathname, { replace: true });
      return;
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="app-gradient text-white px-4 py-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/')} 
            className="text-white font-bold text-xl bg-white/20 rounded-lg px-3 py-1 hover:bg-white/30 transition-colors"
          >
            ← 
          </button>
          <h1 className="text-lg font-semibold">Page Not Found</h1>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center px-4">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">🤔</span>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">404</h1>
          <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
          <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105"
          >
            🏠 Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
