
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
  session_type?: string;
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
  
  console.log(`Fetching drivers from: ${url.toString()}`);
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`OpenF1 API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
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
  
  console.log(`Fetching sessions from: ${url.toString()}`);
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`OpenF1 API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
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
  
  console.log(`Fetching results from: ${url.toString()}`);
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`OpenF1 API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
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
  
  console.log(`Fetching teams from: ${url.toString()}`);
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`OpenF1 API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
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
  
  console.log(`Fetching lap times from: ${url.toString()}`);
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`OpenF1 API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
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
  
  console.log(`Fetching circuits from: ${url.toString()}`);
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`OpenF1 API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
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
  
  console.log(`Fetching pit stops from: ${url.toString()}`);
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`OpenF1 API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
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
  
  console.log(`Fetching car data from: ${url.toString()}`);
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`OpenF1 API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
}
