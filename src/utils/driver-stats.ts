
// Driver stats data mapping
export const getDriverStats = (driverName: string) => {
  const stats = {
    "Max Verstappen": { 
      country: "Netherlands", 
      podiums: 112, 
      points: 3023.5, 
      gp: 209, 
      championships: 4, 
      highest_finish: "1 (x63)",
      highest_grid: 1,
      dob: "30/09/1997",
      pob: "Hasselt, Belgium"
    },
    "Yuki Tsunoda": { 
      country: "Japan", 
      podiums: 0, 
      points: 91, 
      gp: 87, 
      championships: 0, 
      highest_finish: "4 (x1)",
      highest_grid: 3,
      dob: "11/05/2000",
      pob: "Sagamihara, Japan"
    },
    "Liam Lawson": { 
      country: "New Zealand", 
      podiums: 0, 
      points: 6, 
      gp: 11, 
      championships: 0, 
      highest_finish: "9 (x3)",
      highest_grid: 5,
      dob: "11/02/2002",
      pob: "Hastings, New Zealand"
    },
    "Charles Leclerc": { 
      country: "Monaco", 
      podiums: 43, 
      points: 1430, 
      gp: 147, 
      championships: 0, 
      highest_finish: "1 (x8)",
      highest_grid: 1,
      dob: "16/10/1997",
      pob: "Monte Carlo, Monaco"
    },
    "Lewis Hamilton": { 
      country: "United Kingdom", 
      podiums: 202, 
      points: 4862.5, 
      gp: 356, 
      championships: 7, 
      highest_finish: "1 (x105)",
      highest_grid: 1,
      dob: "07/01/1985",
      pob: "Stevenage, England"
    },
    "Lando Norris": { 
      country: "United Kingdom", 
      podiums: 26, 
      points: 1007, 
      gp: 128, 
      championships: 0, 
      highest_finish: "1 (x4)",
      highest_grid: 1,
      dob: "13/11/1999",
      pob: "Bristol, England"
    },
    // Default stats for any driver not specifically defined
    "default": { 
      country: "Unknown", 
      podiums: 0, 
      points: 0, 
      gp: 0, 
      championships: 0, 
      highest_finish: "N/A",
      highest_grid: 0,
      dob: "Unknown",
      pob: "Unknown"
    }
  };
  
  return stats[driverName] || stats.default;
};
