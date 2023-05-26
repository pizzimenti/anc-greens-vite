// path: src/services/tableUtils.ts

import { Planting } from "../types";
import { isToday, parseISO } from "date-fns";

export function getDisplayedColumns(rows: Planting[]) {
  let displayedColumns = new Set<string>();

  rows.forEach((row) => {
    Object.entries(row).forEach(([key, value]) => {
      if (value && isToday(parseISO(value as string))) {
        displayedColumns.add(key);
      }
      if (value && !isToday(parseISO(value as string))) {
        displayedColumns.add(key);
      }
    });
  });

  return displayedColumns;
}
