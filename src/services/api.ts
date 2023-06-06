// path: src/services/api.ts

import { Planting, Bed } from '../types';

const API_URL = 'https://script.google.com/macros/s/AKfycbygTe39x-0dxH6BciHZfbKt-O8I5DcwJY8JhQl14cf_RF0Y4nmC7hnUf5fQZDF0YTKyyw/exec';

export async function fetchPlantings(): Promise<Planting[]> {
  console.log('Fetching Plantings data');
  return fetchData<Planting>(API_URL, 'plantings');
}

export async function fetchBeds(): Promise<Bed[]> {
  console.log('Fetching Bed data');
  return fetchData<Bed>(API_URL, 'beds');
}

export async function updatePlanting(id: string | undefined, update: Partial<Planting>) {
  if (!id) {
    throw new Error('Missing planting id');
  }

  const url = `${API_URL}?type=updatePlanting&plantingId=${encodeURIComponent(id)}&updatedData=${encodeURIComponent(JSON.stringify(update))}`;

  // Log the URL and the update data
  console.log("Update URL: ", url);
  console.log("Update data: ", update);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to update planting');
  }
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
