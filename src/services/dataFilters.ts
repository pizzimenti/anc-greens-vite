import { isToday, parseISO } from 'date-fns';

export type Planting = {
  harvestDate: string;
  T3Date: string;
  T2Date: string;
  T1Date: string;
  trayDate: string;
  seedingDate: string;
  [key: string]: any;  // for additional properties
}

export function filterPlantingsByDate(plantings: Planting[], column: keyof Planting): Planting[] {
  return plantings.filter(planting => {
    const date = parseISO(planting[column]);
    return isToday(date);
  });
}
