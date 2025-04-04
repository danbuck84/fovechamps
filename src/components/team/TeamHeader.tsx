
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TeamHeaderProps {
  teamName: string;
  fullName: string;
}

const TeamHeader = ({ teamName, fullName }: TeamHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="text-racing-silver hover:text-racing-white hover:bg-racing-silver/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      <Card className="bg-racing-black border-racing-silver/20 mb-6">
        <CardHeader className="border-b border-racing-silver/10 pb-4">
          <CardTitle className="text-3xl font-bold text-racing-white">{teamName}</CardTitle>
          <p className="text-racing-silver mt-1">{fullName}</p>
        </CardHeader>
        <CardContent className="pt-6"></CardContent>
      </Card>
    </>
  );
};

export default TeamHeader;
