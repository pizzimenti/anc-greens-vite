import { Planting, Bed } from '../types';

const API_URL = 'https://script.google.com/macros/s/AKfycbws3_vvXokbGuQEb6Vk0bEpiMsTBeobHSsoMBIfZrEqS6Z7ttPu9VNT_ekJG1fy4pJ0Yg/exec';

export async function fetchPlantings(): Promise<Planting[]> {
  console.log('Fetching Plantings data');
  return fetchData<Planting>(API_URL, 'plantings');
}

export async function fetchBeds(): Promise<Bed[]> {
  console.log('Fetching Bed data');
  return fetchData<Bed>(API_URL, 'beds');
}

export async function updatePlanting(id: string, update: any) {
  const url = `${API_URL}?type=updatePlanting&plantingId=${encodeURIComponent(id)}&updatedData=${encodeURIComponent(JSON.stringify(update))}`;

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
