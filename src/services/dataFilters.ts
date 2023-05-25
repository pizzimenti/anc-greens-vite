// path: src/services/dataFilters.ts
import { isToday, parseISO } from 'date-fns';
import { Planting } from '../types';  

export function checkIfPlantingHasTodayActivity(plantings: Planting[], column: keyof Planting): Planting[] {
  return plantings.filter(planting => {
    const value = planting[column];
    if (typeof value === 'string') {
      const date = parseISO(value);
      if (!isNaN(date.getTime())) { // ensures parsed string is a valid date
        return isToday(date);
      }
    }
    return false;
  });
}