
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface DriverHeaderProps {
  name: string;
  number: number;
  country: string;
}

const DriverHeader = ({ name, number, country }: DriverHeaderProps) => {
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
          <CardTitle className="text-3xl font-bold text-racing-white flex items-center">
            <span className="mr-2">{number}</span>
            <span>{name}</span>
          </CardTitle>
          <div className="text-racing-silver flex items-center mt-2">
            <Flag className="h-4 w-4 mr-2" />
            <span>{country}</span>
          </div>
        </CardHeader>
      </Card>
    </>
  );
};

export default DriverHeader;
