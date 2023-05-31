import { Planting, FreeLocation } from '../types';

const API_URL = "https://script.google.com/macros/s/AKfycbz1-R4ykENzSx31Re3VWhUHxZQ3VWYQTV8MvbSQBbcedFYsbWUgzKlqZ9gDTjo7HTb1AA/exec";

export async function fetchPlantings(): Promise<Planting[]> {
  console.log('Fetching Plantings data');
  return fetchData<Planting>(API_URL, 'plantings');
}

export async function fetchFreeLocations(): Promise<FreeLocation[]> {
  console.log('Fetching FreeLocations data');
  return fetchData<FreeLocation>(API_URL, 'freeLocations');
}

async function fetchData<T>(url: string, type: string): Promise<T[]> {
  try {
    const response = await fetch(`${url}?type=${type}`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data: T[] = await response.json();
    console.log('Fetched data');
    return data;
  } catch (error) {
    console.error('Failed to fetch data', error);
    return [];
  }
}
