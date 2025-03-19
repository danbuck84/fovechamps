
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useRaceManagementState } from "./useRaceManagementState";
import { useRaceManagementQuery } from "./useRaceManagementQuery";

export const useRaceOperations = () => {
  const {
    selectedRace,
    setSelectedRace,
    isEditing,
    setIsEditing,
    raceDate,
    setRaceDate,
    qualifyingDate,
    setQualifyingDate,
    isSubmitting,
    setIsSubmitting,
    raceTime,
    setRaceTime,
    qualifyingTime,
    setQualifyingTime,
    isValid,
    setIsValid,
    raceNumber,
    setRaceNumber,
    raceCountry,
    setRaceCountry,
    raceName,
    setRaceName,
    raceCircuit,
    setRaceCircuit
  } = useRaceManagementState();
  
  const { refetch } = useRaceManagementQuery();

  const handleEditRace = (race: any) => {
    setSelectedRace(race);
    setIsEditing(true);
    setIsValid(race.is_valid !== undefined ? race.is_valid : true);
    
    const raceDateTime = new Date(race.date);
    const qualifyingDateTime = new Date(race.qualifying_date);
    
    setRaceDate(raceDateTime);
    setQualifyingDate(qualifyingDateTime);
    
    setRaceTime(format(raceDateTime, "HH:mm"));
    setQualifyingTime(format(qualifyingDateTime, "HH:mm"));

    // Set the additional fields
    setRaceNumber(race.number || "");
    setRaceCountry(race.country || "");
    setRaceName(race.name || "");
    setRaceCircuit(race.circuit || "");
  };

  const handleSaveRace = async () => {
    if (!selectedRace || !raceDate || !qualifyingDate) {
      toast.error("Por favor, preencha todas as informações");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Combine date and time
      const raceDateTime = new Date(raceDate);
      const [raceHours, raceMinutes] = raceTime.split(':').map(Number);
      raceDateTime.setHours(raceHours, raceMinutes);

      const qualifyingDateTime = new Date(qualifyingDate);
      const [qualifyingHours, qualifyingMinutes] = qualifyingTime.split(':').map(Number);
      qualifyingDateTime.setHours(qualifyingHours, qualifyingMinutes);
      
      // Convert to ISO string for database
      const race_date_iso = raceDateTime.toISOString();
      const qualifying_date_iso = qualifyingDateTime.toISOString();

      console.log('Saving race details:', {
        id: selectedRace.id,
        number: raceNumber,
        name: raceName,
        country: raceCountry,
        circuit: raceCircuit,
        date: race_date_iso,
        qualifying_date: qualifying_date_iso,
        is_valid: isValid
      });

      // Update race in Supabase
      const { error } = await supabase
        .from("races")
        .update({
          name: raceName,
          country: raceCountry,
          circuit: raceCircuit,
          date: race_date_iso,
          qualifying_date: qualifying_date_iso,
          is_valid: isValid,
          number: raceNumber
        })
        .eq("id", selectedRace.id);

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      toast.success("Corrida atualizada com sucesso");
      setIsEditing(false);
      setSelectedRace(null);
      await refetch();
    } catch (error) {
      console.error("Erro ao atualizar corrida:", error);
      toast.error("Erro ao atualizar corrida");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedRace(null);
  };

  const handleValidChange = (isValid: boolean) => {
    setIsValid(isValid);
  };

  const handleDeleteRace = async (raceId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta corrida? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("races")
        .delete()
        .eq("id", raceId);

      if (error) throw error;
      
      toast.success("Corrida excluída com sucesso");
      await refetch();
    } catch (error) {
      console.error("Erro ao excluir corrida:", error);
      toast.error("Erro ao excluir corrida");
    }
  };

  const handleAddRace = async () => {
    try {
      const newRace = {
        name: "Nova Corrida",
        country: "País",
        circuit: "Circuito",
        date: new Date().toISOString(),
        qualifying_date: new Date().toISOString(),
        is_valid: false,
        number: ""
      };
      
      const { data, error } = await supabase
        .from("races")
        .insert(newRace)
        .select();

      if (error) {
        console.error("Erro ao adicionar corrida:", error);
        throw error;
      }
      
      toast.success("Nova corrida adicionada com sucesso");
      if (data && data.length > 0) {
        handleEditRace(data[0]);
      }
      await refetch();
    } catch (error) {
      console.error("Erro ao adicionar corrida:", error);
      toast.error("Erro ao adicionar corrida: " + (error as any).message);
    }
  };

  return {
    handleEditRace,
    handleSaveRace,
    handleCancel,
    handleValidChange,
    handleDeleteRace,
    handleAddRace
  };
};
