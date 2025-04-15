
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useIsMobile } from "@/hooks/use-mobile";

const NotFoundDriver = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <MainLayout>
      <div className={`min-h-screen bg-racing-black ${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-racing-silver text-lg md:text-xl">Piloto não encontrado</p>
          <Button 
            onClick={() => navigate(-1)} 
            className="mt-4 bg-racing-red hover:bg-racing-red/80"
          >
            Voltar
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFoundDriver;
