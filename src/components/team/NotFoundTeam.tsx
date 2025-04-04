
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

const NotFoundTeam = () => {
  const navigate = useNavigate();
  
  return (
    <MainLayout>
      <div className="min-h-screen bg-racing-black p-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-racing-silver">Equipe não encontrada</p>
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

export default NotFoundTeam;
