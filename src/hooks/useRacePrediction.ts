
import { useRaceData } from "./race/useRaceData";
import { useDriversData } from "./race/useDriversData";
import { usePredictionForm } from "./race/usePredictionForm";
import { usePredictionSubmit } from "./race/usePredictionSubmit";
import { useFormatters } from "./race/useFormatters";

export const useRacePrediction = (raceId: string | undefined) => {
  // Admin status
  const isAdmin = true; // Todos os usuários têm acesso de administrador
  
  // Get race data
  const { race, isLoadingRace, isDeadlinePassed } = useRaceData(raceId);
  
  // Get drivers data
  const { drivers, isLoadingDrivers } = useDriversData();
  
  // Get form state and existing prediction
  const {
    poleTime,
    setPoleTime,
    fastestLap,
    setFastestLap,
    qualifyingTop10,
    setQualifyingTop10,
    raceTop10,
    setRaceTop10,
    dnfPredictions,
    handleDriverDNF,
    getAvailableDrivers: getDriversByPosition,
    existingPrediction,
    setExistingPrediction,
    existingPredictionQuery
  } = usePredictionForm(raceId, isDeadlinePassed);
  
  // Get submission handler
  const { handleSubmit: submitPrediction, navigate } = usePredictionSubmit(raceId, race);
  
  // Get formatters
  const { handlePoleTimeChange: formatPoleTime } = useFormatters();
  
  // Wrapper functions
  const handlePoleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => 
    formatPoleTime(e, setPoleTime);
  
  const getAvailableDrivers = (position: number, isQualifying: boolean = true) => 
    getDriversByPosition(drivers, position, isQualifying);
  
  const handleSubmit = (e: React.FormEvent) => 
    submitPrediction(
      e, 
      poleTime, 
      fastestLap, 
      qualifyingTop10, 
      raceTop10, 
      dnfPredictions, 
      existingPredictionQuery
    );

  return {
    race,
    drivers,
    poleTime,
    setPoleTime,
    handlePoleTimeChange,
    fastestLap,
    setFastestLap,
    qualifyingTop10,
    setQualifyingTop10,
    raceTop10,
    setRaceTop10,
    dnfPredictions,
    handleDriverDNF,
    getAvailableDrivers,
    isAdmin,
    isLoadingRace,
    isLoadingDrivers,
    isDeadlinePassed,
    existingPrediction,
    setExistingPrediction,
    handleSubmit,
    navigate
  };
};
