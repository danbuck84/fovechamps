
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { format } from "date-fns";

export const useRaceManagement = () => {
  const [selectedRace, setSelectedRace] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [raceDate, setRaceDate] = useState<Date | undefined>(undefined);
  const [qualifyingDate, setQualifyingDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [raceDateDialogOpen, setRaceDateDialogOpen] = useState(false);
  const [qualifyingDateDialogOpen, setQualifyingDateDialogOpen] = useState(false);
  const [raceTime, setRaceTime] = useState("00:00");
  const [qualifyingTime, setQualifyingTime] = useState("00:00");
  const [isValid, setIsValid] = useState(true);

  const { data: races, isLoading, refetch } = useQuery({
    queryKey: ["admin-races"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

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
        date: race_date_iso,
        qualifying_date: qualifying_date_iso,
        is_valid: isValid
      });

      // Update race in Supabase
      const { data, error } = await supabase
        .from("races")
        .update({
          date: race_date_iso,
          qualifying_date: qualifying_date_iso,
          is_valid: isValid
        })
        .eq("id", selectedRace.id);

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      toast.success("Datas da corrida atualizadas com sucesso");
      setIsEditing(false);
      setSelectedRace(null);
      await refetch();
    } catch (error) {
      console.error("Erro ao atualizar corrida:", error);
      toast.error("Erro ao atualizar datas da corrida");
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
        is_valid: false
      };
      
      const { data, error } = await supabase
        .from("races")
        .insert(newRace)
        .select();

      if (error) throw error;
      
      toast.success("Nova corrida adicionada com sucesso");
      if (data && data.length > 0) {
        handleEditRace(data[0]);
      }
      await refetch();
    } catch (error) {
      console.error("Erro ao adicionar corrida:", error);
      toast.error("Erro ao adicionar corrida");
    }
  };

  return {
    races,
    isLoading,
    selectedRace,
    isEditing,
    raceDate,
    qualifyingDate,
    isSubmitting,
    raceDateDialogOpen,
    qualifyingDateDialogOpen,
    raceTime,
    qualifyingTime,
    isValid,
    setRaceDate,
    setQualifyingDate,
    setRaceDateDialogOpen,
    setQualifyingDateDialogOpen,
    setRaceTime,
    setQualifyingTime,
    handleEditRace,
    handleSaveRace,
    handleCancel,
    handleValidChange,
    handleDeleteRace,
    handleAddRace
  };
};
