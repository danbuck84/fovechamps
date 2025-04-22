
/**
 * OpenF1 API Client
 * Documentation: https://openf1.org/
 */

const BASE_URL = 'https://api.openf1.org/v1';

interface OpenF1Options {
  season?: number;
  session_key?: number;
  round?: number;
  limit?: number;
}

// Drivers endpoint
export async function fetchDrivers(options: OpenF1Options = {}) {
  const url = new URL(`${BASE_URL}/drivers`);
  
  // Add query parameters
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`OpenF1 API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Sessions endpoint (races, qualifying, practice)
export async function fetchSessions(options: OpenF1Options = {}) {
  const url = new URL(`${BASE_URL}/sessions`);
  
  // Add query parameters
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`OpenF1 API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Race results
export async function fetchResults(options: OpenF1Options = {}) {
  const url = new URL(`${BASE_URL}/position`);
  
  // Add query parameters
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`OpenF1 API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Teams data
export async function fetchTeams(options: OpenF1Options = {}) {
  const url = new URL(`${BASE_URL}/teams`);
  
  // Add query parameters
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`OpenF1 API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Lap times
export async function fetchLapTimes(options: OpenF1Options = {}) {
  const url = new URL(`${BASE_URL}/laps`);
  
  // Add query parameters
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`OpenF1 API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Circuit information
export async function fetchCircuits(options: OpenF1Options = {}) {
  const url = new URL(`${BASE_URL}/circuits`);
  
  // Add query parameters
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`OpenF1 API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Pit stops data
export async function fetchPitStops(options: OpenF1Options = {}) {
  const url = new URL(`${BASE_URL}/pit`);
  
  // Add query parameters
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`OpenF1 API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Car data (telemetry)
export async function fetchCarData(options: OpenF1Options = {}) {
  const url = new URL(`${BASE_URL}/car_data`);
  
  // Add query parameters
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`OpenF1 API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}
