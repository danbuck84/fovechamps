
import { useRaceManagementState } from "./useRaceManagementState";
import { useRaceManagementQuery } from "./useRaceManagementQuery";
import { useRaceOperations } from "./useRaceOperations";

export const useRaceManagement = () => {
  const state = useRaceManagementState();
  const { races, isLoading } = useRaceManagementQuery();
  const operations = useRaceOperations();

  return {
    races,
    isLoading,
    ...state,
    ...operations
  };
};
