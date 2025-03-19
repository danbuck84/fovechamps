
import { useState } from "react";

export const useRaceManagementState = () => {
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
  const [raceNumber, setRaceNumber] = useState("");
  const [raceCountry, setRaceCountry] = useState("");
  const [raceName, setRaceName] = useState("");
  const [raceCircuit, setRaceCircuit] = useState("");

  return {
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
    raceDateDialogOpen,
    setRaceDateDialogOpen,
    qualifyingDateDialogOpen,
    setQualifyingDateDialogOpen,
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
  };
};
