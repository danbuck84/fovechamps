
// Function to get team stats based on team name
export const useTeamStats = (teamName: string) => {
  const stats = {
    "Red Bull Racing": {
      fullName: "Oracle Red Bull Racing",
      base: "Milton Keynes, United Kingdom",
      teamChief: "Christian Horner",
      techChief: "Pierre Waché",
      chassis: "RB21",
      firstEntry: 1997,
      championships: 6,
      highestFinish: "1 (x122)",
      poles: 103,
      fastestLaps: 99
    },
    "Ferrari": {
      fullName: "Scuderia Ferrari HP",
      base: "Maranello, Italy",
      teamChief: "Frédéric Vasseur",
      techChief: "Loic Serra & Enrico Gualtieri",
      chassis: "SF-25",
      firstEntry: 1950,
      championships: 16,
      highestFinish: "1 (x249)",
      poles: 253,
      fastestLaps: 263
    },
    "Mercedes": {
      fullName: "Mercedes-AMG PETRONAS Formula One Team",
      base: "Brackley, United Kingdom",
      teamChief: "Toto Wolff",
      techChief: "James Allison",
      chassis: "W16",
      firstEntry: 1970,
      championships: 8,
      highestFinish: "1 (x120)",
      poles: 133,
      fastestLaps: 100
    },
    "McLaren": {
      fullName: "McLaren Formula 1 Team",
      base: "Woking, United Kingdom",
      teamChief: "Andrea Stella",
      techChief: "Peter Prodromou & Neil Houldey",
      chassis: "MCL39",
      firstEntry: 1966,
      championships: 9,
      highestFinish: "1 (x189)",
      poles: 164,
      fastestLaps: 172
    },
    "Aston Martin": {
      fullName: "Aston Martin Aramco Formula One Team",
      base: "Silverstone, United Kingdom",
      teamChief: "Andy Cowell",
      techChief: "Enrico Cardile",
      chassis: "AMR25",
      firstEntry: 2018,
      championships: 0,
      highestFinish: "1 (x1)",
      poles: 1,
      fastestLaps: 3
    },
    "Alpine": {
      fullName: "BWT Alpine Formula One Team",
      base: "Enstone, United Kingdom",
      teamChief: "Oliver Oakes",
      techChief: "David Sanchez",
      chassis: "A525",
      firstEntry: 1986,
      championships: 2,
      highestFinish: "1 (x21)",
      poles: 20,
      fastestLaps: 16
    },
    "Williams": {
      fullName: "Williams Racing",
      base: "Grove, United Kingdom",
      teamChief: "James Vowles",
      techChief: "Pat Fry",
      chassis: "FW47",
      firstEntry: 1978,
      championships: 9,
      highestFinish: "1 (x114)",
      poles: 128,
      fastestLaps: 133
    },
    "RB": {
      fullName: "Visa Cash App Racing Bulls Formula One Team",
      base: "Faenza, Italy",
      teamChief: "Laurent Mekies",
      techChief: "Jody Egginton",
      chassis: "VCARB 02",
      firstEntry: 1985,
      championships: 0,
      highestFinish: "1 (x2)",
      poles: 1,
      fastestLaps: 4
    },
    "Haas": {
      fullName: "MoneyGram Haas F1 Team",
      base: "Kannapolis, United States",
      teamChief: "Ayao Komatsu",
      techChief: "Andrea De Zordo",
      chassis: "VF-25",
      firstEntry: 2016,
      championships: 0,
      highestFinish: "4 (x1)",
      poles: 1,
      fastestLaps: 3
    },
    "Kick Sauber": {
      fullName: "Stake F1 Team Kick Sauber",
      base: "Hinwil, Switzerland",
      teamChief: "Mattia Binotto",
      techChief: "James Key", 
      chassis: "C45",
      firstEntry: 1993,
      championships: 0,
      highestFinish: "1 (x1)",
      poles: 1,
      fastestLaps: 7
    },
    // Default stats
    "default": {
      fullName: "Unknown Team",
      base: "Unknown",
      teamChief: "Unknown",
      techChief: "Unknown",
      chassis: "Unknown",
      firstEntry: 0,
      championships: 0,
      highestFinish: "N/A",
      poles: 0,
      fastestLaps: 0
    }
  };
  
  return stats[teamName] || stats.default;
};
