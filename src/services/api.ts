// Path: src/services/api.ts
import { Planting } from '../types';

const API_URL = 
'https://script.google.com/macros/s/AKfycbxY6NxQvv_LVvaQdMK4nSqcMVM4cpHLxidhvbD4NRPT6dzDyy10HmImaXB-GG8EosLKlg/exec'

export async function fetchPlantings(): Promise<Planting[]> {
  const response = await fetch(`${API_URL}?callback=processData`);
  const text = await response.text();
  const processData = (data: any) => data;
  const data: Planting[] = eval(text);
  return data;
}
