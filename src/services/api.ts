// path: src/services/api.ts

import { Planting, Bed } from '../types';

const API_URL = "https://script.google.com/macros/s/AKfycbz5-Ix2MHZhCWTohuhL0afs3vmyy92ivMySfUOsiQtAF73L-lIHLfORIepYL3PD7eBATw/exec";

export async function fetchPlantings(): Promise<Planting[]> {
  console.log('Fetching Plantings data');
  return fetchData<Planting>(API_URL, 'plantings');
}

export async function fetchBeds(): Promise<Bed[]> {
  console.log('Fetching Bed data');
  return fetchData<Bed>(API_URL, 'beds');
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
