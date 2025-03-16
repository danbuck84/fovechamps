
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
        qualifying_date: qualifying_date_iso
      });

      // Update race in Supabase
      const { data, error } = await supabase
        .from("races")
        .update({
          date: race_date_iso,
          qualifying_date: qualifying_date_iso
        })
        .eq("id", selectedRace.id)
        .select();

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      console.log('Update response:', data);
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
    setRaceDate,
    setQualifyingDate,
    setRaceDateDialogOpen,
    setQualifyingDateDialogOpen,
    setRaceTime,
    setQualifyingTime,
    handleEditRace,
    handleSaveRace,
    handleCancel
  };
};
