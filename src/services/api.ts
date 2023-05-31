// Path: src/services/api.ts
import { Planting } from '../types';

const API_URL = 
'https://script.google.com/macros/s/AKfycbxcA-jnwEUuomkknMNDWFftYAix8tPT3BgHhN5eo-NlXNnWA4Pyemvr_AeHcBSGLBkhVA/exec'

export async function fetchPlantings(): Promise<Planting[]> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Planting[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching plantings: ", error);
    return [];
  }
}
