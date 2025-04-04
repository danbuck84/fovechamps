
import MainLayout from "@/components/layout/MainLayout";

interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "Carregando..." }: LoadingStateProps) => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-racing-black p-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-racing-silver">{message}</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoadingState;
