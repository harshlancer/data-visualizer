
import { CovidData, TimelineData } from '@/types';

const BASE_URL = 'https://disease.sh/v3/covid-19';

/**
 * Fetches global COVID-19 statistics
 */
export const fetchGlobalData = async (): Promise<CovidData> => {
  try {
    const response = await fetch(`${BASE_URL}/all`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching global data:', error);
    throw error;
  }
};

/**
 * Fetches COVID-19 statistics for all countries
 */
export const fetchAllCountriesData = async (): Promise<CovidData[]> => {
  try {
    const response = await fetch(`${BASE_URL}/countries`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching countries data:', error);
    throw error;
  }
};

/**
 * Fetches COVID-19 statistics for a specific country
 */
export const fetchCountryData = async (country: string): Promise<CovidData> => {
  try {
    const response = await fetch(`${BASE_URL}/countries/${country}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data for country ${country}:`, error);
    throw error;
  }
};

/**
 * Fetches historical COVID-19 data
 */
export const fetchHistoricalData = async (days = 30, country = 'all'): Promise<TimelineData> => {
  try {
    const url = country === 'all' 
      ? `${BASE_URL}/historical/all?lastdays=${days}` 
      : `${BASE_URL}/historical/${country}?lastdays=${days}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching historical data for ${country}:`, error);
    throw error;
  }
};

/**
 * Formats historical data for charts
 */
export const formatHistoricalData = (
  data: any, 
  dataType: 'cases' | 'deaths' | 'recovered' = 'cases'
) => {
  // For global data
  if (data.timeline) {
    return Object.entries(data.timeline[dataType] || {}).map(([date, value]) => ({
      name: new Date(date).toLocaleDateString(),
      value: Number(value),
    }));
  }
  
  // For country data
  return Object.entries(data[dataType] || {}).map(([date, value]) => ({
    name: new Date(date).toLocaleDateString(),
    value: Number(value),
  }));
};
