
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-racing-black text-racing-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-racing-silver mb-4">Página não encontrada</p>
        <Link to="/dashboard" className="text-racing-red hover:text-racing-red/80 underline">
          Voltar para o Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
